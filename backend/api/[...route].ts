import cors from "cors";
import express from "express";
import { apiRouter } from "../src/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", apiRouter);

export default app;
