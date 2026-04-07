import { Router } from "express";
import { rallyController } from "../controllers/rallyController.js";
import { ResourceName } from "../types/entities.js";

export const createCrudRouter = (resource: ResourceName) => {
  const router = Router();

  router.get("/", rallyController.list(resource));
  router.get("/:id", rallyController.getById(resource));
  router.post("/", rallyController.create(resource));
  router.put("/:id", rallyController.update(resource));
  router.delete("/:id", rallyController.remove(resource));

  return router;
};
