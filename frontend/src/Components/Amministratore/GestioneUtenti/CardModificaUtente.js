import React, { Component } from 'react';
import { Button, ListGroup, Jumbotron } from 'reactstrap';
import { AvForm, AvField } from "availity-reactstrap-validation"
import Alert from '@material-ui/lab/Alert';

export default class CardModificaUtente extends Component {

	state = {
		modifica: false,
		name: "",
		surname: "",
		email: "",
		password: "",
		birthdate: "",
		phone: "",
		error: false,
		success: false,
		string: "errore"
	};

	setting = () => {
		this.setState({ id: this.props.id });
		this.setState({ name: this.props.name });
		this.setState({ surname: this.props.surname });
		this.setState({ email: this.props.email });
		this.setState({ phone: this.props.phone });
		this.setState({ birthdate: this.props.birthdate });
	}

	componentDidMount() {
		this.setting();
	}

	componentDidUpdate(propsPrecedenti) {
		if (this.props !== propsPrecedenti) {
			this.setting();
		}
	}
	setModifica = (input) => {
		this.setState({ modifica: !this.state[input] });
	}

	handleChange = (input) => (e) => {
		this.setState({ [input]: e.target.value });
	}

	isStrongPassword(value, ctx, input, cb) {

		if (!value || value === '') {
			cb(false);
			return;
		}

		if (value.match(/[$@#&!]+/) && value.match(/[a-z]+/) && value.match(/[A-Z]+/) && value.match(/[0-9]+/)) {
			cb(true);
			return;
		} else {
			cb(false);
			return;

		}
	}

	modify = () => {}

	onValidSubmit = (event) => {
		event.preventDefault();
		this.modify();
		console.log(this.state);
	};

	render() {

		let eighteenYearsAgo = new Date();
		eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 16);
		eighteenYearsAgo = eighteenYearsAgo.toJSON().split("T")[0];


		return (
			<div>
				<div className="card mb-3">
					<div className="row no-gutters">
						<div className="col-md-8">
							<div className="card-body"  >
								<h5>nome: {this.state.name}</h5>
								<h5>cognome: {this.state.surname} </h5>
								<h5>email: {this.state.email}</h5>
								<button className="btn-lg btn-primary" onClick={() => { this.setModifica("modifica") }} style={{ textDecoration: "none", marginTop: "20px" }} onClick={() => this.setModifica(true)}>Modifica</button>
							</div>
						</div>
					</div>
					{this.state.modifica &&
						<center>
							<ListGroup>
								<Jumbotron>
								<AvForm onValidSubmit={this.onValidSubmit}>
										{/* Riga name e cognome */}
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


										<br />
										<hr style={{ backgroundColor: "#3FD0CB" }} />

										{/* Riga eta di nascita */}
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

										<br />
										<hr style={{ backgroundColor: "#3FD0CB" }} />

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
												/>
											</div>
										</div>

										<br />
										<hr style={{ backgroundColor: "#3FD0CB" }} />

										{/* Riga password */}
										<div className="row">
											<div className="col-12 ">
												<AvField
												name="password"
												label="Password"
												type="password"
												placeholder="***********"
												validate={{
													/* required: {
														value: true,
														errorMessage: "Il campo è richiesto"
													}, */
													minLength: { value: 8, errorMessage: "La password deve contenere almeno 8 caratteri" },
													isStrong: this.isStrongPassword
												}}
												errorMessage="La password deve contenere almeno una lettera minuscola, una lettere maiuscola, un numero e un carattere speciale"
												onChange={this.handleChange("password")}
												/>
											</div>
										</div>

										<br />
										<hr style={{ backgroundColor: "#3FD0CB" }} />

										{/* Riga numero di telefono */}
										<div className="row">
											<div className="col-12 ">
												<AvField
													name="telefono"
													label="Numero di cellulare"
													type="tel"
													placeholder={this.state.phone}
													validate={{
														minLength: { value: 10 },
														maxLength: { value: 10 },
													}}
													errorMessage="il numero di telefono deve contenere 10 cifre"
													onChange={this.handleChange("phone")}
												/>
											</div>
										</div>

										<hr style={{ backgroundColor: "#3FD0CB" }} />


										{/* Pulsante aggiungi*/}
										<Button color="outline-success" type="submit" style={{ padding: "8px", margin: "10px" }}  >
											Modifica
										</Button>
									<Button
										color="outline-danger"
										onClick={() => {
											this.setModifica("modifica");
											this.setState({ error: false });
											this.setState({ success: false });
											this.setting();
										}}
										style={{ padding: "8px", margin: "10px" }}  >
										Annulla
									</Button>


									<br />
									{this.state.error && <Alert severity="error">{this.state.string}</Alert>}
									{this.state.success && <Alert severity="success">Dati Modificati Correttamente</Alert>}
									</AvForm>
								</Jumbotron>
							</ListGroup>
						</center>}
				</div>
			</div>
		);
	}
};

