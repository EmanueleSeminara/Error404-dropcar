const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
var distance = require("../models/distance");

const searchManagement = require("../models/searchManagement");
const vehicleManagement = require("../models/vehicleManagement");

const isGuest = require("../middleware/isGuest");

// Ricerca i veicoli disponibili per una prenotazione in base ai valori inseriti
router.post("/searchvehicles/", isGuest, async (req, res) => {
  try {
    const vehicles = await vehicleManagement.getVehiclesAndReservation(
      req.body.type
    );
    let flag = true;
    const availableVehicles = vehicles.filter((vehicle, i, vehicles) => {
      if (!vehicle.idReservation) {
        return vehicle;
      } else {
        if (vehicle.id !== vehicles[i + 1].id) {
          if (
            flag &&
            !(
              new Date(vehicle.dateC) > new Date(req.body.dateR) &&
              new Date(vehicle.dateR) < new Date(req.body.dateC)
            )
          ) {
            return vehicle;
          }
          flag = true;
        } else {
          if (
            new Date(vehicle.dateC) > new Date(req.body.dateR) &&
            new Date(vehicle.dateR) < new Date(req.body.dateC)
          ) {
            flag = false;
          }
        }
      }
    });
    res.json(availableVehicles);
  } catch (err) {
    res.status(503).json({
      error: "Database error during the creation of user - " + err,
    });
  }
});

// Verifica la presenza di un autista disponibile e restituisce i veicoli che possono essere prenotati con autista
router.post("/searchcarwithdriver", isGuest, async (req, res) => {
  try {
    if (await searchManagement.searchDrivers(req.body.dateR, req.body.dateC)) {
      res.json(
        await searchManagement.searchVehiclesForDrivers(req.body.category)
      );
    } else {
      res.status(513).json({ error: "No driver available" });
    }
  } catch (err) {
    res.status(503).json({
      error: "Database error during the creation of user - " + err,
    });
  }
});

// Ricerca tra i veicoli fuori stallo
router.get("/vehiclesoutofstall/", isGuest, async (req, res) => {
  try {
    vehiclesOutOfStall = await searchManagement.searchVehiclesOutOfStall(
      req.query.dateR,
      req.query.dateC
    );
    Promise.all(
      vehiclesOutOfStall.map(async (vehicle) => {
        try {
          const data = await distance.get(req.query.start, vehicle.position);
          return {
            id: vehicle.id,
            type: vehicle.type,
            category: vehicle.category,
            position: vehicle.position,
            distance: data.distance,
            distanceValue: data.distanceValue,
            duration: data.duration,
          };
        } catch (err) {
          console.log(err);
        }
      })
    ).then((data) => {
      res.json(
        data.sort((first, second) => first.distanceValue - second.distanceValue)
      );
    });
  } catch (err) {
    res.status(503).json({
      error: "Database error during the creation of user - " + err,
    });
  }
});

module.exports = router;
