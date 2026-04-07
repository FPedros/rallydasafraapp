import { DashboardSummary, ResourceCollections, ResourceName } from "../types/entities";
import { apiRequest } from "./api";

const resourcePathMap: Record<ResourceName, string> = {
  years: "years",
  editions: "editions",
  cars: "cars",
  carUsages: "car-usages",
  teams: "teams",
  people: "people",
  routes: "routes",
  hotels: "hotels",
  fuelings: "fuelings",
  maintenances: "maintenances",
  meals: "meals",
  alerts: "alerts"
};

export const rallyApi = {
  getYears: () => apiRequest<ResourceCollections["years"]>("/years"),
  getEditions: (yearId?: string) =>
    apiRequest<ResourceCollections["editions"]>("/editions", undefined, { yearId }),
  getDashboard: (editionId: string) =>
    apiRequest<DashboardSummary>("/dashboard", undefined, { editionId }),
  listResource: <T extends ResourceName>(resource: T, params?: Record<string, string | undefined>) =>
    apiRequest<ResourceCollections[T]>(`/${resourcePathMap[resource]}`, undefined, params),
  getResource: <T extends ResourceName>(resource: T, id: string) =>
    apiRequest<ResourceCollections[T][number]>(`/${resourcePathMap[resource]}/${id}`),
  createResource: <T extends ResourceName>(resource: T, payload: Record<string, unknown>) =>
    apiRequest<ResourceCollections[T][number]>(`/${resourcePathMap[resource]}`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateResource: <T extends ResourceName>(
    resource: T,
    id: string,
    payload: Record<string, unknown>
  ) =>
    apiRequest<ResourceCollections[T][number]>(`/${resourcePathMap[resource]}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteResource: <T extends ResourceName>(resource: T, id: string) =>
    apiRequest<void>(`/${resourcePathMap[resource]}/${id}`, { method: "DELETE" })
};
