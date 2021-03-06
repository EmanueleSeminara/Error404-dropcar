import React, { Component } from "react";
import { Button } from "reactstrap";

export default class CardConsegna extends Component {
  state = {
    consegna: false,
    disabled: true,
  };

  setting = () => {
    if (this.props.state === "withdrawn") {
      this.setState({ consegna: true });
    } else {
      this.setState({ consegna: false });
    }
  };

  componentDidMount() {
    this.setting();
  }

  componentDidUpdate(propsPrecedenti) {
    if (this.props !== propsPrecedenti) {
      this.setting();
    }
  }

  render() {
    return (
      <div className="card card-css-RC">
        <div className="row no-gutters">
          <div className="col">
            <div className="card-body">
              <div className="row no-gutters">
                <div className="col-md-12">
                  <p className="infoCard">
                    <strong>ID veicolo: {this.props.refVehicle}</strong>
                  </p>
                  <hr style={{ backgroundColor: "white" }} />
                </div>
              </div>

              <div className="row no-gutters">
                <div className="col-md-6">
                  <p className="infoCard">
                    <strong>Tipo:</strong> {this.props.type}{" "}
                    {this.props.type === "car" ? (
                      <> {this.props.category}</>
                    ) : (
                      <></>
                    )}
                  </p>
                  <p className="infoCard">
                    <strong>Parcheggio ritiro:</strong> {this.props.refParkingR}
                  </p>
                  <p className="infoCard">
                    <strong>Data ritiro:</strong> {this.props.dateR}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="infoCard">
                    <strong>Cliente:</strong> {this.props.name}{" "}
                    {this.props.surname}
                  </p>
                  <p className="infoCard">
                    <strong>Parcheggio consegna:</strong>{" "}
                    {this.props.refParkingC}
                  </p>
                  <p className="infoCard">
                    <strong>Data consegna:</strong> {this.props.dateC}
                  </p>
                </div>
              </div>

              <div
                className="row"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="button"
                  className="buttonVerde"
                  onClick={() =>
                    this.props.remove(this.props.id, this.props.refVehicle)
                  }
                  disabled={!this.state.consegna}
                >
                  Preleva veicolo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
