import axios from "axios";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const checkForData = (data: any) => {
  if (data !== null) {
    return data;
  } else {
    return "Service is unavailable at the moment";
  }
};

app.post("/report-sickness", async (req, res) => {
  const response = await axios
    .post("http://localhost:5000/report-sickness")
    .then(({ data }) => data);

  res.status(200).jsonp(response);
});

app.get("/status", async (req, res) => {
  const hospitalStatus = await axios
    .get("http://localhost:5001/status")
    .then(({ data }) => data)
    .catch((err) => {
      return null;
    });
  const totalSick = await axios
    .get("http://localhost:5000/total")
    .then(({ data }) => data)
    .catch((err) => {
      return null;
    });

  res.status(200).jsonp({
    hospital: checkForData(hospitalStatus),
    sick: checkForData(totalSick),
  });
});

app.listen(5002, () => {
  console.log("API Gateway is running on port 5002");
});
