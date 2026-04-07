import { ResourceCollections, ResourceName } from "../types/entities";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters";
import { getLimitStatus } from "../utils/limitStatus";

interface Option {
  value: string;
  label: string;
}

interface FilterDefinition {
  name: string;
  label: string;
  type: "select" | "date-from" | "date-to";
  target?: string;
  options: (data: ResourceCollections) => Option[];
}

interface FieldDefinition {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "checkbox"
    | "multiselect";
  required?: boolean;
  fullWidth?: boolean;
  hint?: string;
  options?: (data: ResourceCollections) => Option[];
}

interface ResourceCard {
  title: string;
  subtitle?: string;
  details: string[];
  highlight?: string;
  badge?: "normal" | "warning" | "critical";
  detailPath?: string;
}

export interface ResourcePageConfig {
  resource: Exclude<ResourceName, "years" | "editions">;
  singularLabel: string;
  title: string;
  description: string;
  formDescription: string;
  searchPlaceholder: string;
  searchKeys: string[];
  fields: FieldDefinition[];
  filters: FilterDefinition[];
  defaults: (data: ResourceCollections) => Record<string, string | number | boolean | string[]>;
  card: (item: Record<string, unknown>, data: ResourceCollections) => ResourceCard;
}

const teamOptions = (data: ResourceCollections) =>
  data.teams.map((team) => ({ value: team.id, label: team.nome }));
const carOptions = (data: ResourceCollections) =>
  data.cars.map((car) => ({ value: car.id, label: `${car.marca} ${car.modelo}` }));
const peopleOptions = (data: ResourceCollections) =>
  data.people.map((person) => {
    const team = data.teams.find((entry) => entry.id === person.equipeId);

    return {
      value: person.id,
      label: team ? `${person.nome} • ${team.nome}` : `${person.nome} • Sem equipe`
    };
  });

const statusOptions: Option[] = [
  { value: "planejado", label: "Planejado" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "ativo", label: "Ativo" },
  { value: "concluido", label: "Concluido" },
  { value: "inativo", label: "Inativo" }
];

export const resourcePageConfigs: Record<string, ResourcePageConfig> = {
  cars: {
    resource: "cars",
    singularLabel: "Carro",
    title: "Carros",
    description: "",
    formDescription: "Placa, status e quilometragem atual.",
    searchPlaceholder: "Buscar por placa, modelo ou marca",
    searchKeys: ["placa", "modelo", "marca", "observacoes"],
    filters: [{ name: "equipeId", label: "Equipe", type: "select", options: teamOptions }],
    defaults: () => ({
      placa: "",
      modelo: "",
      marca: "",
      ano: new Date().getFullYear(),
      kmAtual: 0,
      status: "ativo",
      observacoes: "",
      edicaoId: ""
    }),
    fields: [
      { name: "placa", label: "Placa", type: "text", required: true },
      { name: "modelo", label: "Modelo", type: "text", required: true },
      { name: "marca", label: "Marca", type: "text", required: true },
      { name: "ano", label: "Ano", type: "number", required: true },
      { name: "kmAtual", label: "KM atual", type: "number", required: true },
      { name: "status", label: "Status", type: "select", required: true, options: () => statusOptions },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item, data) => {
      const latestUsage = data.carUsages
        .filter((entry) => entry.carroId === item.id)
        .sort((left, right) => right.data.localeCompare(left.data))[0];
      const team = data.teams.find((entry) => entry.id === (latestUsage?.equipeId ?? item.equipeId));

      return {
        title: `${item.marca} ${item.modelo}`,
        subtitle: String(item.placa),
        details: [
          `Equipe: ${team?.nome ?? "Nao vinculada"}`,
          `KM atual: ${formatNumber(Number(item.kmAtual ?? 0))}`,
          `Status: ${String(item.status)}`,
          latestUsage ? `Ultimo uso: ${formatDate(String(latestUsage.data))}` : "Sem uso registrado"
        ],
        highlight: String(item.observacoes || ""),
        detailPath: `/app/cars/${item.id}`
      };
    }
  },
  teams: {
    resource: "teams",
    singularLabel: "Equipe",
    title: "Equipes",
    description: "",
    formDescription:
      "Defina carro, partida, chegada, pessoas da equipe, budget e observacoes.",
    searchPlaceholder: "Buscar por nome da equipe",
    searchKeys: ["nome", "observacoes"],
    filters: [],
    defaults: () => ({
      nome: "",
      carroId: "",
      origem: "",
      destino: "",
      pessoaIds: [],
      limiteAlimentacao: 0,
      observacoes: "",
      edicaoId: ""
    }),
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "carroId", label: "Carro", type: "select", required: true, options: carOptions },
      { name: "origem", label: "Ponto de partida", type: "text", required: true },
      { name: "destino", label: "Ponto de chegada", type: "text", required: true },
      {
        name: "pessoaIds",
        label: "Pessoas",
        type: "multiselect",
        required: true,
        fullWidth: true,
        hint: "As pessoas selecionadas serao vinculadas a esta equipe.",
        options: peopleOptions
      },
      { name: "limiteAlimentacao", label: "Budget", type: "number", required: true },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item, data) => {
      const car = data.cars.find((entry) => entry.id === item.carroId);
      const route = data.routes.find((entry) => entry.id === item.rotaId);
      const peopleCount = data.people.filter((person) => person.equipeId === item.id).length;
      const mealTotal = data.meals
        .filter((meal) => meal.equipeId === item.id)
        .reduce((sum, meal) => sum + meal.valor, 0);
      const status = getLimitStatus(mealTotal, Number(item.limiteAlimentacao ?? 0));

      return {
        title: String(item.nome),
        subtitle: route ? `${route.origem} -> ${route.destino}` : "Trajeto nao definido",
        details: [
          `Carro: ${car ? `${car.marca} ${car.modelo}` : "Nao vinculado"}`,
          `Pessoas: ${peopleCount}`,
          `Consumo: ${formatCurrency(mealTotal)}`,
          `Budget: ${formatCurrency(Number(item.limiteAlimentacao ?? 0))}`
        ],
        badge: status === "exceeded" ? "critical" : status,
        highlight: String(item.observacoes || ""),
        detailPath: `/app/teams/${item.id}`
      };
    }
  },
  people: {
    resource: "people",
    singularLabel: "Pessoa",
    title: "Pessoas",
    description: "Cadastros das equipes com um unico responsavel principal.",
    formDescription: "Marque o checkbox para destacar o responsavel da equipe.",
    searchPlaceholder: "Buscar por nome, email ou cargo",
    searchKeys: ["nome", "email", "cargo"],
    filters: [
      { name: "equipeId", label: "Equipe", type: "select", options: teamOptions },
      {
        name: "isResponsavel",
        label: "Responsavel",
        type: "select",
        options: () => [
          { value: "true", label: "Sim" },
          { value: "false", label: "Nao" }
        ]
      }
    ],
    defaults: () => ({
      equipeId: "",
      nome: "",
      telefone: "",
      email: "",
      cargo: "",
      isResponsavel: false
    }),
    fields: [
      { name: "equipeId", label: "Equipe", type: "select", required: true, options: teamOptions },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "telefone", label: "Telefone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "cargo", label: "Cargo", type: "text", required: true },
      {
        name: "isResponsavel",
        label: "E responsavel pela equipe?",
        type: "checkbox",
        hint: "Somente um responsavel principal por equipe."
      }
    ],
    card: (item, data) => {
      const team = data.teams.find((entry) => entry.id === item.equipeId);

      return {
        title: String(item.nome),
        subtitle: String(item.cargo),
        details: [
          `Equipe: ${team?.nome ?? "Nao vinculada"}`,
          `Telefone: ${String(item.telefone)}`,
          `Email: ${String(item.email)}`
        ],
        badge: item.isResponsavel ? "warning" : undefined,
        highlight: item.isResponsavel ? "Responsavel principal da equipe" : undefined
      };
    }
  },
  routes: {
    resource: "routes",
    singularLabel: "Rota",
    title: "Rotas",
    description: "Trechos planejados por equipe e edicao.",
    formDescription: "Vincule cada rota a uma equipe e mantenha observacoes de campo.",
    searchPlaceholder: "Buscar por nome, origem ou destino",
    searchKeys: ["nome", "origem", "destino"],
    filters: [{ name: "equipeId", label: "Equipe", type: "select", options: teamOptions }],
    defaults: () => ({
      nome: "",
      origem: "",
      destino: "",
      observacoes: "",
      equipeId: "",
      edicaoId: ""
    }),
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "equipeId", label: "Equipe", type: "select", required: true, options: teamOptions },
      { name: "origem", label: "Origem", type: "text", required: true },
      { name: "destino", label: "Destino", type: "text", required: true },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item, data) => {
      const team = data.teams.find((entry) => entry.id === item.equipeId);

      return {
        title: String(item.nome),
        subtitle: `${item.origem} -> ${item.destino}`,
        details: [
          `Equipe: ${team?.nome ?? "Nao vinculada"}`,
          `Observacao: ${String(item.observacoes || "Sem observacoes")}`
        ]
      };
    }
  },
  hotels: {
    resource: "hotels",
    singularLabel: "Hotel",
    title: "Hoteis e hospedagens",
    description: "Base de hospedagem vinculada ao contexto da edicao.",
    formDescription: "Cadastre parceiros, enderecos e telefones de apoio.",
    searchPlaceholder: "Buscar por nome ou cidade",
    searchKeys: ["nome", "cidade", "estado", "endereco"],
    filters: [],
    defaults: () => ({
      nome: "",
      endereco: "",
      cidade: "",
      estado: "",
      telefone: "",
      observacoes: "",
      edicaoId: ""
    }),
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "endereco", label: "Endereco", type: "text", required: true, fullWidth: true },
      { name: "cidade", label: "Cidade", type: "text", required: true },
      { name: "estado", label: "Estado", type: "text", required: true },
      { name: "telefone", label: "Telefone", type: "tel", required: true },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item) => ({
      title: String(item.nome),
      subtitle: `${item.cidade}/${item.estado}`,
      details: [`Endereco: ${String(item.endereco)}`, `Telefone: ${String(item.telefone)}`],
      highlight: String(item.observacoes || "")
    })
  },
  fuelings: {
    resource: "fuelings",
    singularLabel: "Abastecimento",
    title: "Abastecimentos",
    description: "Historico completo de combustivel por carro.",
    formDescription: "Registre data, quilometragem, litros e valor.",
    searchPlaceholder: "Buscar por posto ou observacoes",
    searchKeys: ["posto", "observacoes"],
    filters: [
      { name: "carroId", label: "Carro", type: "select", options: carOptions },
      { name: "from", label: "Periodo inicial", type: "date-from", target: "data", options: () => [] },
      { name: "to", label: "Periodo final", type: "date-to", target: "data", options: () => [] }
    ],
    defaults: () => ({
      carroId: "",
      data: "",
      km: 0,
      litros: 0,
      valor: 0,
      posto: "",
      observacoes: ""
    }),
    fields: [
      { name: "carroId", label: "Carro", type: "select", required: true, options: carOptions },
      { name: "data", label: "Data", type: "date", required: true },
      { name: "km", label: "KM", type: "number", required: true },
      { name: "litros", label: "Litros", type: "number", required: true },
      { name: "valor", label: "Valor", type: "number", required: true },
      { name: "posto", label: "Posto", type: "text", required: true },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item, data) => {
      const car = data.cars.find((entry) => entry.id === item.carroId);

      return {
        title: String(item.posto),
        subtitle: formatDate(String(item.data)),
        details: [
          `Carro: ${car ? `${car.marca} ${car.modelo}` : "Nao vinculado"}`,
          `KM: ${formatNumber(Number(item.km ?? 0))}`,
          `Valor: ${formatCurrency(Number(item.valor ?? 0))}`
        ],
        highlight: `${Number(item.litros ?? 0)} litros`
      };
    }
  },
  maintenances: {
    resource: "maintenances",
    singularLabel: "Manutencao",
    title: "Manutencoes",
    description: "Controle preventivo e corretivo por veiculo.",
    formDescription: "Mantenha historico tecnico e custo acumulado.",
    searchPlaceholder: "Buscar por tipo ou descricao",
    searchKeys: ["tipo", "descricao", "observacoes"],
    filters: [
      { name: "carroId", label: "Carro", type: "select", options: carOptions },
      { name: "from", label: "Periodo inicial", type: "date-from", target: "data", options: () => [] },
      { name: "to", label: "Periodo final", type: "date-to", target: "data", options: () => [] }
    ],
    defaults: () => ({
      carroId: "",
      tipo: "",
      descricao: "",
      data: "",
      km: 0,
      valor: 0,
      observacoes: ""
    }),
    fields: [
      { name: "carroId", label: "Carro", type: "select", required: true, options: carOptions },
      { name: "tipo", label: "Tipo", type: "text", required: true },
      { name: "descricao", label: "Descricao", type: "text", required: true, fullWidth: true },
      { name: "data", label: "Data", type: "date", required: true },
      { name: "km", label: "KM", type: "number", required: true },
      { name: "valor", label: "Valor", type: "number", required: true },
      { name: "observacoes", label: "Observacoes", type: "textarea", fullWidth: true }
    ],
    card: (item, data) => {
      const car = data.cars.find((entry) => entry.id === item.carroId);

      return {
        title: String(item.tipo),
        subtitle: String(item.descricao),
        details: [
          `Carro: ${car ? `${car.marca} ${car.modelo}` : "Nao vinculado"}`,
          `Data: ${formatDate(String(item.data))}`,
          `Valor: ${formatCurrency(Number(item.valor ?? 0))}`
        ],
        highlight: String(item.observacoes || "")
      };
    }
  },
  meals: {
    resource: "meals",
    singularLabel: "Alimentacao",
    title: "Alimentacao",
    description: "Lancamentos por pessoa e consolidado por equipe.",
    formDescription: "O limite nao bloqueia lancamentos, apenas sinaliza consumo.",
    searchPlaceholder: "Buscar por descricao ou categoria",
    searchKeys: ["descricao", "categoria"],
    filters: [
      { name: "equipeId", label: "Equipe", type: "select", options: teamOptions },
      { name: "pessoaId", label: "Pessoa", type: "select", options: peopleOptions },
      { name: "from", label: "Periodo inicial", type: "date-from", target: "data", options: () => [] },
      { name: "to", label: "Periodo final", type: "date-to", target: "data", options: () => [] }
    ],
    defaults: () => ({
      equipeId: "",
      pessoaId: "",
      data: "",
      valor: 0,
      descricao: "",
      categoria: ""
    }),
    fields: [
      { name: "equipeId", label: "Equipe", type: "select", required: true, options: teamOptions },
      { name: "pessoaId", label: "Pessoa", type: "select", required: true, options: peopleOptions },
      { name: "data", label: "Data", type: "date", required: true },
      { name: "valor", label: "Valor", type: "number", required: true },
      { name: "categoria", label: "Categoria", type: "text", required: true },
      { name: "descricao", label: "Descricao", type: "textarea", required: true, fullWidth: true }
    ],
    card: (item, data) => {
      const person = data.people.find((entry) => entry.id === item.pessoaId);
      const team = data.teams.find((entry) => entry.id === item.equipeId);

      return {
        title: String(item.categoria),
        subtitle: formatCurrency(Number(item.valor ?? 0)),
        details: [
          `Equipe: ${team?.nome ?? "Nao vinculada"}`,
          `Pessoa: ${person?.nome ?? "Nao vinculada"}`,
          `Data: ${formatDate(String(item.data))}`
        ],
        highlight: String(item.descricao)
      };
    }
  },
  alerts: {
    resource: "alerts",
    singularLabel: "Alerta",
    title: "Alertas",
    description: "Sinais operacionais e financeiros da edicao.",
    formDescription: "Cadastre avisos criticos ou preventivos sem perder rastreabilidade.",
    searchPlaceholder: "Buscar por titulo ou descricao",
    searchKeys: ["titulo", "descricao", "tipo"],
    filters: [
      {
        name: "nivel",
        label: "Nivel",
        type: "select",
        options: () => [
          { value: "normal", label: "Normal" },
          { value: "warning", label: "Alerta" },
          { value: "critical", label: "Critico" }
        ]
      }
    ],
    defaults: () => ({
      tipo: "",
      titulo: "",
      descricao: "",
      nivel: "warning",
      entidadeRelacionada: "",
      entidadeId: "",
      visualizado: false,
      edicaoId: ""
    }),
    fields: [
      { name: "tipo", label: "Tipo", type: "text", required: true },
      { name: "titulo", label: "Titulo", type: "text", required: true, fullWidth: true },
      { name: "descricao", label: "Descricao", type: "textarea", required: true, fullWidth: true },
      {
        name: "nivel",
        label: "Nivel",
        type: "select",
        required: true,
        options: () => [
          { value: "normal", label: "Normal" },
          { value: "warning", label: "Alerta" },
          { value: "critical", label: "Critico" }
        ]
      },
      { name: "entidadeRelacionada", label: "Entidade relacionada", type: "text", required: true },
      { name: "entidadeId", label: "ID da entidade", type: "text", required: true },
      { name: "visualizado", label: "Ja foi visualizado?", type: "checkbox" }
    ],
    card: (item) => ({
      title: String(item.titulo),
      subtitle: String(item.tipo),
      details: [
        `Nivel: ${String(item.nivel)}`,
        `Entidade: ${String(item.entidadeRelacionada)} (${String(item.entidadeId)})`
      ],
      badge:
        String(item.nivel) === "critical"
          ? "critical"
          : String(item.nivel) === "warning"
            ? "warning"
            : "normal",
      highlight: String(item.descricao)
    })
  }
};
