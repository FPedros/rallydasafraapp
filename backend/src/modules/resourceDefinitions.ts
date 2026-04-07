import { DatabaseSchema, ResourceName } from "../types/entities.js";

export interface ResourceDefinition {
  collection: keyof DatabaseSchema;
  editionResolver?: (record: any, db: DatabaseSchema) => string | undefined;
}

export const resourceDefinitions: Record<ResourceName, ResourceDefinition> = {
  years: { collection: "years" },
  editions: { collection: "editions", editionResolver: (record) => record.id },
  cars: { collection: "cars", editionResolver: (record) => record.edicaoId },
  carUsages: { collection: "carUsages", editionResolver: (record) => record.edicaoId },
  teams: { collection: "teams", editionResolver: (record) => record.edicaoId },
  people: { collection: "people" },
  routes: { collection: "routes", editionResolver: (record) => record.edicaoId },
  hotels: { collection: "hotels", editionResolver: (record) => record.edicaoId },
  fuelings: {
    collection: "fuelings",
    editionResolver: (record, db) => db.cars.find((car) => car.id === record.carroId)?.edicaoId
  },
  maintenances: {
    collection: "maintenances",
    editionResolver: (record, db) => db.cars.find((car) => car.id === record.carroId)?.edicaoId
  },
  meals: {
    collection: "meals",
    editionResolver: (record, db) => db.teams.find((team) => team.id === record.equipeId)?.edicaoId
  },
  alerts: { collection: "alerts", editionResolver: (record) => record.edicaoId }
};
