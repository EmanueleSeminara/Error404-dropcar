import React from "react";

function CardEliminaCarta(props) {
  return (
    <div className="card ">
      <center>
        <div className="row no-gutters">
          <div className="col">
            <div className="card-body">
              <h5>
                <font color="grey">
                  Intestatario: {props.name} {props.surname}{" "}
                </font>
              </h5>
              <h5>
                <font color="grey">
                  numero carta:{" "}
                  {props.number.replace(
                    /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)/gm,
                    "**** **** **** "
                  )}
                </font>
              </h5>
              <button
                className="btn-lg btn-danger"
                onClick={() => {
                  props.remove(props.id);
                }}
                style={{ textDecoration: "none" }}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}

export default CardEliminaCarta;
