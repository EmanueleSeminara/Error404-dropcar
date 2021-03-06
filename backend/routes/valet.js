const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const valetManagement = require("../models/valetManagement");
const vehicleManagement = require("../models/vehicleManagement");
const reservationManagement = require("../models/reservationManagement");

const isValet = require("../middleware/isValet");

// Prenotazioni presenti nel parcheggio del parcheggiatore che fa la chiamata
router.get("/reservationsinmyparking/", isValet, async (req, res) => {
  try {
    res.json(await valetManagement.listVehiclesInParking(req.user.id));
  } catch (err) {
    res.json({
      error: "Database error when requesting reservations - " + err,
    });
  }
});

// Prenotazioni che arriveranno nel parcheggio del parcheggiatore che fa la chiamata
router.get("/vehiclesgoingtomyparking/", isValet, async (req, res) => {
  try {
    res.json(await valetManagement.listVehiclesByDestination(req.user.id));
  } catch (err) {
    res.json({
      error: "Database error when requesting reservations - " + err,
    });
  }
});

// Consegna del veicolo al cliente
router.put("/deliveryvehicle", isValet, async (req, res) => {
  try {
    const reservation = await reservationManagement.getReservationById(
      req.body.id
    );
    const dateNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" })
    );
    if (
      reservation.refValetR === req.user.id &&
      reservation.refVehicle === req.body.refVehicle &&
      new Date(reservation.dateR) <= dateNow
    ) {
      reservation.state = "withdrawn";
      await vehicleManagement.updateState(reservation.refVehicle, "in use");
      await reservationManagement.changeState(reservation);
      const deliveryDate = new Date(reservation.dateC).getTime();
      const nowDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" })
      ).getTime();
      const timerDatetime = deliveryDate - nowDate;
 
      // Scadenza orario di consegna
      setTimeout(async () => {
        try {
          const isInReservations = await reservationManagement.isInReservations(
            req.user.id,
            reservation.id
          );
          if (isInReservations) {
            mail.sendExpiredDeliveryMail(
              req.user.email,
              req.user.name,
              reservation.id
            );
            const admins = await userManagement.getAllAdmins();
            admins.forEach((admin) => {
              mail.sendExpiredDeliveryMail(
                admin.email,
                "Admin",
                reservation.id
              );
            });
          }
        } catch (err) {
          console.log(err);
        }
      }, timerDatetime);

      // Mancata consegna
      setTimeout(async () => {
        try {
          const isInReservations = await reservationManagement.isInReservations(
            req.user.id,
            reservation.id
          );
          if (isInReservations) {
            mail.sendDeliveryFailureyMail(
              req.user.email,
              req.user.name,
              reservation.id
            );
            const admins = await userManagement.getAllAdmins();
            admins.forEach((admin) => {
              mail.sendDeliveryFailureyMailAdmin(
                admin.email,
                req.user.name,
                reservation.id,
                req.user.email
              );
            });
          }
        } catch (err) {
          console.log(err);
        }

      }, timerDatetime + 14400000);
      res.status(200).end();
    } else {
      res.status(513).json({
        error: "Unable to collect the vehicle",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(503).json({
      error: "Database error while collecting the vehicle - " + err,
    });
  }
});

// Ritiro del veicolo dal cliente
router.delete("/retirevehicle", isValet, async (req, res) => {
  try {
    const reservation = await reservationManagement.getReservationById(
      req.query.id
    );
    const dateNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" })
    );
    if (
      reservation.refValetC == req.user.id &&
      reservation.refVehicle == req.query.refVehicle &&
      reservation.state == "withdrawn"
    ) {
      await vehicleManagement.updateState("available", reservation.refVehicle);
      await reservationManagement.deleteReservationById(reservation.id);
      await vehicleManagement.changeRefParking(
        reservation.refParkingC,
        reservation.refVehicle
      );
      res.status(200).end();
    } else {
      res.status(513).json({
        error: "Unable to delivery the vehicle",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(503).json({
      error: "Database error while delivering the vehicle - " + err,
    });
  }
});

module.exports = router;
