import axios from "axios";
import db from "./db.json";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

let data = { ...db };
let actualPacient: string = "";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/status", (req, res) => {
  res.status(200).jsonp({ ...data, actualPacient });
});

app.post("/order-ambulance", (req, res) => {
  const { uid } = req.body;

  data.freeSpots -= 1;
  actualPacient = uid;

  res.status(200).jsonp({ msg: "Ambulance is on a way for " + uid });
});

setInterval(() => {
  data.freeSpots -= 1;
}, 10000);

app.listen(5001, () => {
  console.log("Hospital Service is running on port 5001");
  axios
    .post("http://localhost:5000/check-pacients")
    .then(({ data }) => {
      if (data.uid) {
        data.freeSpots -= 1;
        actualPacient = data.uid;
      }
    })
    .catch((err) => console.log({ err }));
});
