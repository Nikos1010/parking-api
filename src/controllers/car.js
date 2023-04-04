import { notFoundData } from "../middleware/notFoundFile.js";
import fs from "fs";

const dataPath = "./src/data/data.json";

const getAllCars = (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const cars = JSON.parse(data).cars;
    const { content, statusCode } = notFoundData(cars);
    res.status(statusCode).json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getCar = (req, res) => {
  const plate = req.params.plate;

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const cars = JSON.parse(data).cars;
    const car = cars.find((car) => car.plate === plate);
    const { content, statusCode } = notFoundData([car]);
    res.status(statusCode).send(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const createCar = (req, res) => {
  const newCar = req.body;

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const cars = JSON.parse(data).cars;
    const carExists = cars.some((car) => car.plate === newCar.plate);
    if (carExists) {
      res.status(400).send("Car already exists");
    } else {
      cars.push(newCar);
      fs.writeFileSync(dataPath, JSON.stringify({ cars }));
      res.status(201).json(newCar);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateCar = (req, res) => {
  const plate = req.params.plate;
  const newTypeCar = req.body.typeCar;

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const cars = JSON.parse(data).cars;
    const carToUpdate = cars.find((car) => car.plate === plate);

    if (!carToUpdate) {
      res.status(404).send("No se encontró el carro con esa placa");
      return;
    }

    if (newTypeCar === "Residente") carToUpdate.totalTimeMonth = 0;

    carToUpdate.typeCar = newTypeCar;
    fs.writeFileSync(dataPath, JSON.stringify({ cars }));
    res.send("Tipo de carro modificado correctamente");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateDepartureTime = (req, res) => {
  const plate = req.params.plate;
  const { departureTime } = req.body;
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const { cars } = JSON.parse(data);

    const carIndex = cars.findIndex((car) => car.plate === plate);
    if (carIndex === -1) {
      return res.status(404).send("Car not found");
    }

    const car = cars[carIndex];
    car.stayTime[0].departureTime =
      departureTime || car.stayTime[0].departureTime;
    car.stayTime.unshift({
      entryTime: "",
      departureTime: "",
    });

    fs.writeFileSync(dataPath, JSON.stringify({ cars }));
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateEntryTime = (req, res) => {
  const plate = req.params.plate;
  const { entryTime } = req.body;
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    const { cars } = JSON.parse(data);

    const carIndex = cars.findIndex((car) => car.plate === plate);
    if (carIndex === -1) {
      return res.status(404).send("Car not found");
    }

    const car = cars[carIndex];
    car.stayTime[0].entryTime = entryTime;

    fs.writeFileSync(dataPath, JSON.stringify({ cars }));
    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateTotalTimeMonth = async (req, res) => {
  try {
    const plate = req.params.plate;
    const { entryTime, totalTimeMonth } = req.body;

    const data = fs.readFileSync(dataPath, "utf-8");
    const { cars } = JSON.parse(data);

    const carIndex = cars.findIndex((car) => car.plate === plate);
    if (carIndex === -1) {
      return res.status(404).send("Car not found");
    }

    const car = cars[carIndex];
    car.stayTime[0].entryTime = entryTime;
    car.totalTimeMonth += totalTimeMonth;

    fs.writeFileSync(dataPath, JSON.stringify({ cars }));

    res.json(car);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const updateAllCars = (req, res) => {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const { cars } = JSON.parse(data);
    cars.forEach((car) => {
      if (car.typeCar === "Oficial") {
        car.stayTime = [{ entryTime: "", departureTime: "" }];
      } else if (car.typeCar === "Residente") {
        car.totalTimeMonth = 0;
      }
    });
    fs.writeFileSync(dataPath, JSON.stringify({ cars }));
    res.json(cars);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

export {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  updateEntryTime,
  updateDepartureTime,
  updateTotalTimeMonth,
  updateAllCars,
};
