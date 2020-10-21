import db from "./db.json";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

let data = { ...db };
let tempUid: string;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/total", (req, res) => {
  res.status(200).jsonp(data);
});

app.post("/check-pacients", (req, res) => {
  res.status(200).jsonp({ uid: tempUid });
  tempUid = "";
});

app.post("/report-sickness", (req, res) => {
  tempUid = String(Math.floor(Math.random() * 100000000000));
  data.todayInfected += 1;
  data.totalInfected += 1;

  axios
    .post("http://localhost:5001/order-ambulance", { uid: tempUid })
    .then(({ data }) => {
      tempUid = "";
      res.status(200).jsonp({ data, status: "OK" });
    })
    .catch((err) => {
      res.status(204).jsonp({
        status:
          "Hospital is unavailable at the moment and will be dispatched right away",
      });
    });
});

setInterval(() => {
  data.todayInfected += 1;
  data.totalInfected += 1;
}, 10000);

app.listen(5000, () => console.log("Infected Service is running on port 5000"));
