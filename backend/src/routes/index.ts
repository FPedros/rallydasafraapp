import { Router } from "express";
import { createCrudRouter } from "./createCrudRouter.js";
import { rallyController } from "../controllers/rallyController.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

apiRouter.get("/dashboard", rallyController.dashboard);
apiRouter.use("/years", createCrudRouter("years"));
apiRouter.use("/editions", createCrudRouter("editions"));
apiRouter.use("/cars", createCrudRouter("cars"));
apiRouter.use("/car-usages", createCrudRouter("carUsages"));
apiRouter.use("/teams", createCrudRouter("teams"));
apiRouter.use("/people", createCrudRouter("people"));
apiRouter.use("/routes", createCrudRouter("routes"));
apiRouter.use("/hotels", createCrudRouter("hotels"));
apiRouter.use("/fuelings", createCrudRouter("fuelings"));
apiRouter.use("/maintenances", createCrudRouter("maintenances"));
apiRouter.use("/meals", createCrudRouter("meals"));
apiRouter.use("/alerts", createCrudRouter("alerts"));
