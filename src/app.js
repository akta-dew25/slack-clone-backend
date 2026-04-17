import express from "express";
import cors from "cors";
import routerV1 from "../src/routes/v1/index.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", routerV1);

app.post("/", () => {});

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
