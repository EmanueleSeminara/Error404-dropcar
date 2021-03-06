import React, { Component } from "react";
import { Alert } from "@material-ui/lab";
import Axios from "axios";

export default class CardPrenotaVeicolo extends Component {
  state = {
    error: false,
  };

  componentDidUpdate(propsPrec) {
    if (this.props !== propsPrec) {
      this.setState({ error: false });
    }
  }

  setting = () => {
    let license = true;
    Axios.get("/api/guest/getdatacarlicense")
      .then((res) => {
        if (this.props.driver) {
          license = true;
        } else if (this.props.type === "car") {
          console.log("sono dentro car");
          license = res.data.b;
        } else if (this.props.type === "scooter") {
          console.log("sono dentro scooter");
          license =
            res.data.b ||
            res.data.a2 ||
            res.data.a1 ||
            res.data.am ||
            res.data.a;
        }

        if (license) {
          const reservation = JSON.parse(localStorage.getItem("reservation"));
          reservation.refVehicle = this.props.id;
          if (this.props.type === "car") {
            reservation.category = this.props.category;
          }
          window.localStorage.setItem(
            "reservation",
            JSON.stringify(reservation)
          );
          console.log(JSON.parse(localStorage.getItem("reservation")));
          window.location.href = "/riepilogoPrenotazione";
        } else {
          this.setState({ error: true });
        }
      })
      .catch((err) => {
        window.location.href = "/errorServer";
      });
  };

  render() {
    return (
      <div className="card card-css">
        <center>
          <div className="row no-gutters">
            <div className="col-12">
              <div className="card-body">
                <h5 className="infoCard">Tipo: {this.props.type}</h5>
                {this.props.type === "car" && (
                  <p className="infoCard">Categoria: {this.props.category}</p>
                )}
                {this.props.position !== undefined && (
                  <p className="infoCard">Posizione: {this.props.position}</p>
                )}
                {this.props.duration !== undefined && (
                  <p className="infoCard">
                    Tempo per raggiongere il veicolo: {this.props.duration}
                  </p>
                )}
                {this.props.distance !== undefined && (
                  <p className="infoCard">Distanza: {this.props.distance}</p>
                )}
                <p className="infoCard">Id: {this.props.id}</p>
                <button
                  className="buttonCyano"
                  onClick={() => {
                    this.setting();
                  }}
                  style={{ textDecoration: "none" }}
                >
                  Prenota
                </button>
              </div>
            </div>
          </div>
          {this.state.error && (
            <Alert severity="error">Non hai una patente adeguata</Alert>
          )}
        </center>
      </div>
    );
  }
}
