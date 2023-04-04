import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import carsRoute from "./routes/cars.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ msg: "Bienvenidos a la API" });
});

app.use("/api/cars", carsRoute);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
