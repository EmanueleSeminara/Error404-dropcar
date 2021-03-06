import React, { Component } from "react";
import { Button } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../../../ComponentsCss/Pannel.css";
import Axios from "axios";
import { Alert} from "@material-ui/lab";
import NavbarCliente from "../../NavbarCliente";

export default class PannelloModifcaDati extends Component {
  state = {
    name: "",
    surname: "",
    email: "",
    birthdate: "",
    phone: "",
    error: false,
    success: false,
    string: "",
  };

  componentDidMount() {
    if (localStorage.getItem("utente") === null) {
      window.location.href = "/";
    } else {
      let c = JSON.parse(localStorage.getItem("utente"));
      if (c.role === "driver") {
        window.location.href = "/pannelloAutista";
      } else if (c.role === "admin") {
        window.location.href = "/pannelloAmministratore";
      } else if (c.role === "valet") {
        window.location.href = "/pannelloParcheggiatore";
      } else {
        Axios.get("/api/guest/mydata")
          .then((res) => {
            console.log(res);
            this.setState({ name: res.data.name });
            this.setState({ surname: res.data.surname });
            this.setState({ email: res.data.email });
            this.setState({ birthdate: res.data.birthdate });
            this.setState({ phone: res.data.phone });
          })
          .catch((err) => {
            window.location.href = "/errorServer";
          });
      }
    }
  }

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  onValidSubmit = (event) => {
    event.preventDefault();
    this.update();
  };

  update = () => {
    Axios.put("/api/guest/update", this.state)
      .then((res) => {
        this.setState({ error: false });
        this.setState({ success: true });
      })
      .catch((err) => {
        this.setState({ success: false });
        if (err.response.status === 513) {
          this.setState({ string: "email già associata ad un account" });
          this.setState({ error: true });
        } else if (err.response.status === 422) {
          this.setState({ string: "errore nell'inserimento dei dati" });
          this.setState({ error: true });
        } else if (err.response.status === 503) {
          console.log("inpossibile regitrarsi al momento");
          this.setState({
            string:
              "impossibile modificare i dati al momento, riprova più tardi",
          });
          this.setState({ error: true });
        } else {
          window.location.href = "/errorServer";
        }
      });
  };

  render() {
    // definisco il lower bound per la data di nascita
    let eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 16);
    eighteenYearsAgo = eighteenYearsAgo.toJSON().split("T")[0];

    return (
      <div className="ez sfondo no-scrollable" style={{ height: "100%" }}>
        <NavbarCliente />

        {this.state.error && (
          <Alert severity="error">{this.state.string}</Alert>
        )}
        {this.state.success && (
          <Alert severity="success">Dati modificati correttamente</Alert>
        )}

        <AvForm onValidSubmit={this.onValidSubmit}>
          <div className="row h-100 justify-content-md-center  boxpannel">
            <div className="row bg-pannell justify-content-md-center ">
              <div className="col">
                <div className="title">Modifica Dati</div>

                {/* Riga nome e cognome */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <AvField
                      name="nome"
                      type="text"
                      label="Nome"
                      placeholder={this.state.name}
                      onChange={this.handleChange("name")}
                      style={{ label: { color: "white" } }}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <AvField
                      name="cognome"
                      type="text"
                      label="Cognome"
                      placeholder={this.state.surname}
                      onChange={this.handleChange("surname")}
                    />
                  </div>
                </div>

                {/* Riga data di nascita */}
                <div className="row">
                  <div className="col-12">
                    <AvField
                      name="dataNascita"
                      label="Data di nascita"
                      type="date"
                      placeholder={this.state.birthdate}
                      max={eighteenYearsAgo}
                      onChange={this.handleChange("birthdate")}
                      errorMessage="Devi essere maggiorenne"
                    />
                  </div>
                </div>

                {/*Riga email */}
                <div className="row">
                  <div className="col-12">
                    <AvField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder={this.state.email}
                      onChange={this.handleChange("email")}
                      errorMessage="Campo non valido."
                      /* required */
                    />
                  </div>
                </div>

                {/* Riga numero di telefono */}
                <div className="row">
                  <div className="col-12 ">
                    <AvField
                      name="telefono"
                      label="Numero di telefono"
                      type="tel"
                      placeholder={this.state.phone}
                      validate={{
                        minLength: { value: 10 },
                        maxLength: { value: 10 },
                        tel: { pattern: /^((3[{1-9}][{0-9}]))([\d]{7})$/ },
                      }}
                      errorMessage="il numero di telefono non è valido"
                      onChange={this.handleChange("phone")}
                    />
                  </div>
                </div>

                <div className="text-center" style={{ paddingTop: "2%" }}>
                  <Button type="submit" className="buttonCyano">
                    Modifica
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AvForm>
      </div>
    );
  }
}
