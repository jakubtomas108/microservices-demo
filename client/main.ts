import axios from "axios";

const totalSick = document.getElementById("totalSick")!;
const todaySick = document.getElementById("todaySick")!;
const freeSpaces = document.getElementById("freeSpaces")!;
const ambulanceFor = document.getElementById("ambulanceFor")!;
const sickButton = document.getElementById("submitSickness")!;

const errText = "Service is unavailable at the moment";

const checkResult = (data: any) => {
  sickButton.style.display = "none";

  if (!data) {
    alert(
      "Hospital is currently unavailable, but once its ready, it will dispatch for You"
    );
  } else {
    console.log(data);
  }
};

sickButton.addEventListener("click", () => {
  axios
    .post("http://localhost:5002/report-sickness")
    .then(({ data }) => {
      checkResult(data.data);
    })
    .catch((err) => console.log({ err }));
});

const parseData = (data: any) => {
  const { hospital, sick } = data;

  if (hospital !== errText) {
    freeSpaces.innerText = `Free spaces in hospitals: ${hospital.freeSpots}`;

    if (hospital.actualPacient) {
      sickButton.style.display = "none";
      ambulanceFor.innerText = `Ambulance is going for pacient with ID: ${hospital.actualPacient}`;
    }
  } else {
    ambulanceFor.innerText = "";
    freeSpaces.innerText = `Hospital service is currently out of order`;
  }

  if (sick !== errText) {
    totalSick.innerText = `Total people infected: ${sick.totalInfected}`;
    todaySick.innerText = `Today infected: ${sick.todayInfected}`;
  } else {
    todaySick.innerText = "";
    totalSick.innerText = `Total sick people service is currently out of order`;
    sickButton.style.display = "none";
  }
};

const getData = () => {
  axios
    .get("http://localhost:5002/status")
    .then((data) => parseData(data.data))
    .catch((err) => console.log({ err }));
};

setInterval(getData, 5000);

getData();
