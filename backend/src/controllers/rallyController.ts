import { Request, Response } from "express";
import { ResourceName } from "../types/entities.js";
import { rallyService } from "../services/rallyService.js";

const parseError = (error: unknown) =>
  error instanceof Error ? error.message : "Erro interno ao processar a requisicao.";

const normalizeQuery = (query: Request["query"]) =>
  Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : typeof value === "string" ? value : undefined
    ])
  ) as Record<string, string | undefined>;

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const rallyController = {
  list: (resource: ResourceName) => (request: Request, response: Response) => {
    try {
      const data = rallyService.list(resource, normalizeQuery(request.query));
      response.json(data);
    } catch (error) {
      response.status(400).json({ message: parseError(error) });
    }
  },
  getById: (resource: ResourceName) => (request: Request, response: Response) => {
    try {
      const data = rallyService.getById(resource, getParam(request.params.id));
      response.json(data);
    } catch (error) {
      response.status(404).json({ message: parseError(error) });
    }
  },
  create: (resource: ResourceName) => (request: Request, response: Response) => {
    try {
      const data = rallyService.create(resource, request.body);
      response.status(201).json(data);
    } catch (error) {
      response.status(400).json({ message: parseError(error) });
    }
  },
  update: (resource: ResourceName) => (request: Request, response: Response) => {
    try {
      const data = rallyService.update(resource, getParam(request.params.id), request.body);
      response.json(data);
    } catch (error) {
      response.status(400).json({ message: parseError(error) });
    }
  },
  remove: (resource: ResourceName) => (request: Request, response: Response) => {
    try {
      rallyService.remove(resource, getParam(request.params.id));
      response.status(204).send();
    } catch (error) {
      response.status(404).json({ message: parseError(error) });
    }
  },
  dashboard: (request: Request, response: Response) => {
    try {
      const editionId = String(request.query.editionId ?? "");
      if (!editionId) {
        response.status(400).json({ message: "editionId e obrigatorio." });
        return;
      }

      response.json(rallyService.getDashboard(editionId));
    } catch (error) {
      response.status(400).json({ message: parseError(error) });
    }
  }
};
