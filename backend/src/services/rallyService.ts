import {
  AlertLevel,
  DashboardSummary,
  DatabaseSchema,
  ResourceName
} from "../types/entities.js";
import { db } from "../repositories/inMemoryDatabase.js";
import { createId } from "../utils/id.js";
import { getLimitStatus } from "../utils/mealStatus.js";
import { resourceDefinitions } from "../modules/resourceDefinitions.js";

type QueryValue = string | undefined;
type FilterQuery = Record<string, QueryValue>;
type TeamPayload = Record<string, unknown> & {
  edicaoId?: string;
  nome?: string;
  carroId?: string;
  origem?: string;
  destino?: string;
  observacoes?: string;
  limiteAlimentacao?: number;
  pessoaIds?: unknown;
};

const searchableKeys: Record<ResourceName, string[]> = {
  years: ["ano"],
  editions: ["nome", "descricao", "status"],
  cars: ["placa", "modelo", "marca", "status", "observacoes"],
  carUsages: ["data", "observacoes"],
  teams: ["nome", "observacoes"],
  people: ["nome", "telefone", "email", "cargo"],
  routes: ["nome", "origem", "destino", "observacoes"],
  hotels: ["nome", "cidade", "estado", "endereco"],
  fuelings: ["posto", "observacoes"],
  maintenances: ["tipo", "descricao", "observacoes"],
  meals: ["descricao", "categoria"],
  alerts: ["tipo", "titulo", "descricao", "nivel"]
};

const prefixByResource: Record<ResourceName, string> = {
  years: "year",
  editions: "edition",
  cars: "car",
  carUsages: "usage",
  teams: "team",
  people: "person",
  routes: "route",
  hotels: "hotel",
  fuelings: "fuel",
  maintenances: "maint",
  meals: "meal",
  alerts: "alert"
};

class RallyService {
  private snapshot(): DatabaseSchema {
    return {
      years: [...db.getCollection("years")],
      editions: [...db.getCollection("editions")],
      cars: [...db.getCollection("cars")],
      carUsages: [...db.getCollection("carUsages")],
      teams: [...db.getCollection("teams")],
      people: [...db.getCollection("people")],
      routes: [...db.getCollection("routes")],
      hotels: [...db.getCollection("hotels")],
      fuelings: [...db.getCollection("fuelings")],
      maintenances: [...db.getCollection("maintenances")],
      meals: [...db.getCollection("meals")],
      alerts: [...db.getCollection("alerts")]
    };
  }

  private normalizeString(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
  }

  private normalizeStringList(value: unknown) {
    if (!Array.isArray(value)) {
      return [];
    }

    return Array.from(
      new Set(
        value
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim())
          .filter(Boolean)
      )
    );
  }

  private validateTeamPayload(payload: TeamPayload, fallback?: { edicaoId: string }) {
    const edicaoId = this.normalizeString(payload.edicaoId) || fallback?.edicaoId || "";
    const nome = this.normalizeString(payload.nome);
    const carroId = this.normalizeString(payload.carroId);
    const origem = this.normalizeString(payload.origem);
    const destino = this.normalizeString(payload.destino);
    const observacoes = typeof payload.observacoes === "string" ? payload.observacoes : "";
    const limiteAlimentacao = Number(payload.limiteAlimentacao ?? 0);
    const pessoaIds = this.normalizeStringList(payload.pessoaIds);

    if (!edicaoId) {
      throw new Error("edicaoId e obrigatorio para salvar a equipe.");
    }

    if (!nome) {
      throw new Error("Nome da equipe e obrigatorio.");
    }

    if (!carroId) {
      throw new Error("Selecione um carro para a equipe.");
    }

    if (!origem) {
      throw new Error("Informe o ponto de partida da equipe.");
    }

    if (!destino) {
      throw new Error("Informe o ponto de chegada da equipe.");
    }

    if (pessoaIds.length === 0) {
      throw new Error("Selecione pelo menos uma pessoa para a equipe.");
    }

    if (Number.isNaN(limiteAlimentacao) || limiteAlimentacao < 0) {
      throw new Error("Budget da equipe invalido.");
    }

    const data = this.snapshot();

    if (!data.cars.some((car) => car.id === carroId)) {
      throw new Error("Carro selecionado nao encontrado.");
    }

    if (pessoaIds.some((personId) => !data.people.some((person) => person.id === personId))) {
      throw new Error("Uma ou mais pessoas selecionadas nao foram encontradas.");
    }

    return {
      edicaoId,
      nome,
      carroId,
      origem,
      destino,
      observacoes,
      limiteAlimentacao,
      pessoaIds
    };
  }

  private upsertTeamRoute(
    teamId: string,
    payload: ReturnType<RallyService["validateTeamPayload"]>,
    existingRouteId?: string
  ) {
    const currentRoutes = [...db.getCollection("routes")];
    const routeRecord = {
      edicaoId: payload.edicaoId,
      equipeId: teamId,
      nome: payload.nome,
      origem: payload.origem,
      destino: payload.destino,
      observacoes: payload.observacoes
    };

    if (existingRouteId) {
      const routeExists = currentRoutes.some((route) => route.id === existingRouteId);

      if (routeExists) {
        db.setCollection(
          "routes",
          currentRoutes.map((route) =>
            route.id === existingRouteId ? { ...route, ...routeRecord, id: existingRouteId } : route
          )
        );
        return existingRouteId;
      }
    }

    const routeId = createId(prefixByResource.routes);
    db.setCollection("routes", [...currentRoutes, { ...routeRecord, id: routeId }]);

    return routeId;
  }

  private syncTeamCar(teamId: string, nextCarId: string) {
    db.setCollection(
      "teams",
      db.getCollection("teams").map((team) =>
        team.id !== teamId && team.carroId === nextCarId ? { ...team, carroId: "" } : team
      )
    );

    db.setCollection(
      "cars",
      db.getCollection("cars").map((car) => {
        if (car.id === nextCarId) {
          return { ...car, equipeId: teamId };
        }

        if (car.equipeId === teamId) {
          return { ...car, equipeId: "" };
        }

        return car;
      })
    );
  }

  private syncTeamPeople(teamId: string, selectedPeopleIds: string[]) {
    const selectedIds = new Set(selectedPeopleIds);

    db.setCollection(
      "people",
      db.getCollection("people").map((person) => {
        if (selectedIds.has(person.id)) {
          return { ...person, equipeId: teamId };
        }

        if (person.equipeId === teamId) {
          return { ...person, equipeId: "" };
        }

        return person;
      })
    );
  }

  private createTeam(payload: Record<string, unknown>) {
    const normalized = this.validateTeamPayload(payload as TeamPayload);
    const teamId = createId(prefixByResource.teams);
    const routeId = this.upsertTeamRoute(teamId, normalized);
    const currentTeams = [...db.getCollection("teams")];
    const teamRecord = {
      id: teamId,
      edicaoId: normalized.edicaoId,
      nome: normalized.nome,
      carroId: normalized.carroId,
      rotaId: routeId,
      limiteAlimentacao: normalized.limiteAlimentacao,
      observacoes: normalized.observacoes
    };

    db.setCollection("teams", [...currentTeams, teamRecord]);
    this.syncTeamCar(teamId, normalized.carroId);
    this.syncTeamPeople(teamId, normalized.pessoaIds);

    return teamRecord;
  }

  private updateTeam(id: string, payload: Record<string, unknown>) {
    const currentTeams = [...db.getCollection("teams")];
    const existingTeam = currentTeams.find((team) => team.id === id);

    if (!existingTeam) {
      throw new Error("Registro nao encontrado.");
    }

    const normalized = this.validateTeamPayload(payload as TeamPayload, {
      edicaoId: existingTeam.edicaoId
    });
    const routeId = this.upsertTeamRoute(id, normalized, existingTeam.rotaId);
    const nextTeam = {
      ...existingTeam,
      edicaoId: normalized.edicaoId,
      nome: normalized.nome,
      carroId: normalized.carroId,
      rotaId: routeId,
      limiteAlimentacao: normalized.limiteAlimentacao,
      observacoes: normalized.observacoes,
      id
    };

    db.setCollection(
      "teams",
      currentTeams.map((team) => (team.id === id ? nextTeam : team))
    );
    this.syncTeamCar(id, normalized.carroId);
    this.syncTeamPeople(id, normalized.pessoaIds);

    return nextTeam;
  }

  private removeTeam(id: string) {
    const currentTeams = [...db.getCollection("teams")];
    const existingTeam = currentTeams.find((team) => team.id === id);

    if (!existingTeam) {
      throw new Error("Registro nao encontrado.");
    }

    db.setCollection(
      "teams",
      currentTeams.filter((team) => team.id !== id)
    );
    db.setCollection(
      "routes",
      db.getCollection("routes").filter((route) => route.id !== existingTeam.rotaId)
    );
    db.setCollection(
      "cars",
      db.getCollection("cars").map((car) =>
        car.equipeId === id ? { ...car, equipeId: "" } : car
      )
    );
    db.setCollection(
      "people",
      db.getCollection("people").map((person) =>
        person.equipeId === id ? { ...person, equipeId: "" } : person
      )
    );
  }

  private getEditionId(resource: ResourceName, record: any, data: DatabaseSchema) {
    const resolver = resourceDefinitions[resource].editionResolver;
    return resolver ? resolver(record, data) : undefined;
  }

  private applyQueryFilters(resource: ResourceName, items: any[], query: FilterQuery) {
    const data = this.snapshot();
    const search = query.search?.toLowerCase().trim();

    return items.filter((item) => {
      const editionId = this.getEditionId(resource, item, data);

      if (query.yearId) {
        if (resource === "editions" && item.anoRallyId !== query.yearId) {
          return false;
        }

        if (resource !== "editions" && editionId) {
          const edition = data.editions.find((entry) => entry.id === editionId);
          if (edition?.anoRallyId !== query.yearId) {
            return false;
          }
        }
      }

      if (query.editionId && editionId && editionId !== query.editionId) {
        return false;
      }

      if (query.teamId && item.equipeId !== query.teamId && item.id !== query.teamId) {
        return false;
      }

      if (query.carId && item.carroId !== query.carId && item.id !== query.carId) {
        return false;
      }

      if (query.routeId && item.rotaId !== query.routeId && item.id !== query.routeId) {
        return false;
      }

      if (query.personId && item.pessoaId !== query.personId && item.id !== query.personId) {
        return false;
      }

      if (query.responsible === "true" && item.isResponsavel !== true) {
        return false;
      }

      if (query.from && "data" in item && item.data < query.from) {
        return false;
      }

      if (query.to && "data" in item && item.data > query.to) {
        return false;
      }

      if (!search) {
        return true;
      }

      return searchableKeys[resource].some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }

  private ensureSingleResponsible(resource: ResourceName, payload: any, id?: string) {
    if (resource !== "people" || !payload.isResponsavel || !payload.equipeId) {
      return;
    }

    const collection = db.getCollection("people");
    db.setCollection(
      "people",
      collection.map((person) =>
        person.equipeId === payload.equipeId && person.id !== id
          ? { ...person, isResponsavel: false }
          : person
      )
    );
  }

  public list(resource: ResourceName, query: FilterQuery = {}) {
    const collection = resourceDefinitions[resource].collection;
    const items = [...(db.getCollection(collection) as unknown as Array<Record<string, unknown>>)];
    return this.applyQueryFilters(resource, items, query);
  }

  public getById(resource: ResourceName, id: string) {
    const collection = resourceDefinitions[resource].collection;
    const item = db.findById(collection, id);

    if (!item) {
      throw new Error("Registro nao encontrado.");
    }

    return item;
  }

  public create(resource: ResourceName, payload: Record<string, unknown>) {
    if (resource === "teams") {
      return this.createTeam(payload);
    }

    const collection = resourceDefinitions[resource].collection;
    const current = [...(db.getCollection(collection) as unknown as Array<Record<string, unknown>>)];
    const entity = { ...payload, id: createId(prefixByResource[resource]) };

    this.ensureSingleResponsible(resource, entity);
    db.setCollection(collection, [...current, entity] as never);

    return entity;
  }

  public update(resource: ResourceName, id: string, payload: Record<string, unknown>) {
    if (resource === "teams") {
      return this.updateTeam(id, payload);
    }

    const collection = resourceDefinitions[resource].collection;
    const current = [...(db.getCollection(collection) as unknown as Array<Record<string, unknown>>)];
    const existing = current.find((item) => item.id === id);

    if (!existing) {
      throw new Error("Registro nao encontrado.");
    }

    const nextItem = { ...existing, ...payload, id };
    this.ensureSingleResponsible(resource, nextItem, id);

    db.setCollection(
      collection,
      current.map((item) => (item.id === id ? nextItem : item)) as never
    );

    return nextItem;
  }

  public remove(resource: ResourceName, id: string) {
    if (resource === "teams") {
      this.removeTeam(id);
      return;
    }

    const collection = resourceDefinitions[resource].collection;
    const current = [...(db.getCollection(collection) as unknown as Array<Record<string, unknown>>)];
    const next = current.filter((item) => item.id !== id);

    if (next.length === current.length) {
      throw new Error("Registro nao encontrado.");
    }

    db.setCollection(collection, next as never);
  }

  public getDashboard(editionId: string): DashboardSummary {
    const data = this.snapshot();
    const teams = data.teams.filter((team) => team.edicaoId === editionId);
    const cars = data.cars.filter((car) => car.edicaoId === editionId);
    const alerts = data.alerts.filter((alert) => alert.edicaoId === editionId && !alert.visualizado);
    const teamSummaries = teams.map((team) => {
      const mealTotal = data.meals
        .filter((meal) => meal.equipeId === team.id)
        .reduce((sum, meal) => sum + meal.valor, 0);
      const responsible = data.people.find(
        (person) => person.equipeId === team.id && person.isResponsavel
      );
      const route = data.routes.find((entry) => entry.id === team.rotaId);
      const car = data.cars.find((entry) => entry.id === team.carroId);

      return {
        teamId: team.id,
        teamName: team.nome,
        mealTotal,
        mealLimit: team.limiteAlimentacao,
        mealStatus: getLimitStatus(mealTotal, team.limiteAlimentacao) as AlertLevel,
        carName: car ? `${car.marca} ${car.modelo}` : "Nao vinculado",
        routeName: route?.nome ?? "Nao vinculada",
        responsibleName: responsible?.nome ?? "Sem responsavel"
      };
    });

    const totalFuelCost = data.fuelings
      .filter((fueling) => cars.some((car) => car.id === fueling.carroId))
      .reduce((sum, fueling) => sum + fueling.valor, 0);
    const totalMealsCost = data.meals
      .filter((meal) => teams.some((team) => team.id === meal.equipeId))
      .reduce((sum, meal) => sum + meal.valor, 0);

    return {
      teamsCount: teams.length,
      carsCount: cars.length,
      totalFuelCost,
      totalMealsCost,
      activeAlerts: alerts.length,
      teamSummaries
    };
  }
}

export const rallyService = new RallyService();
