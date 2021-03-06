import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default class NavbarCliente extends Component {
  state = {
    isOpen: false,
  };

  logout = () => {
    window.localStorage.clear();
    Axios.post("/api/user/logout")
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.location.href = "/login";
        } else {
          window.location.href = "/errorServer";
        }
      });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div>
        <Navbar
          light
          expand="md"
          style={{ backgroundColor: "#39304d", marginBottom: "45px" }}
          fixed="top"
        >
          <NavbarBrand href="/" style={{ color: "white" }}>
            dropcar
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink
                  href="/ricerca"
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  Ricerca
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav style={{ color: "white" }}>
                  Gestione Accout
                </DropdownToggle>
                <DropdownMenu left>
                  <DropdownItem>
                    <a
                      href="/modificaPassword"
                      style={{ textDecoration: "none" }}
                    >
                      Modifica Password
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/modificaDatiPersonali"
                      style={{ textDecoration: "none" }}
                    >
                      Modifica Dati Personali
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/inserimentoPatente"
                      style={{ textDecoration: "none" }}
                    >
                      Inserisci Patente
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/aggiornaPatente"
                      style={{ textDecoration: "none" }}
                    >
                      Aggiorna Patente
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/inserimentoMetodoPagamento"
                      style={{ textDecoration: "none" }}
                    >
                      Aggiungi Metodo Pagamento
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/eliminazioneMetodoPagamento"
                      style={{ textDecoration: "none" }}
                    >
                      Elimina Metodi Pagamento
                    </a>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav style={{ color: "white" }}>
                  Gestione Prenotazione
                </DropdownToggle>
                <DropdownMenu left>
                  <DropdownItem>
                    <a
                      href="/ritiroConsegna"
                      style={{ textDecoration: "none" }}
                    >
                      Ritiro/Consegna
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/prenotazioniEffettuate"
                      style={{ textDecoration: "none" }}
                    >
                      Prenotazioni effettuate
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a href="/segnalaGuasto" style={{ textDecoration: "none" }}>
                      Segnala guasto
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/consegnaFuoriStallo"
                      style={{ textDecoration: "none" }}
                    >
                      Consegna fuori dallo stallo
                    </a>
                  </DropdownItem>
                  <DropdownItem>
                    <a
                      href="/ritardoConsegna"
                      style={{ textDecoration: "none" }}
                    >
                      Ritardo consegna
                    </a>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => {
                    this.logout();
                  }}
                  style={{
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    textAlign: "left",
                    padding: "0",
                  }}
                >
                  Logout
                </button>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
