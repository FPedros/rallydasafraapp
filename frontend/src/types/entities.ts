export type EntityStatus = "planejado" | "em_andamento" | "ativo" | "concluido" | "inativo";
export type AlertLevel = "normal" | "warning" | "critical";
export type ConsumptionStatus = "normal" | "warning" | "exceeded";
export type ResourceName =
  | "years"
  | "editions"
  | "cars"
  | "carUsages"
  | "teams"
  | "people"
  | "routes"
  | "hotels"
  | "fuelings"
  | "maintenances"
  | "meals"
  | "alerts";

export interface AnoRally {
  id: string;
  ano: number;
  ativo: boolean;
}

export interface EdicaoRally {
  id: string;
  anoRallyId: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  status: EntityStatus;
}

export interface Carro {
  id: string;
  edicaoId: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  kmAtual: number;
  status: EntityStatus;
  observacoes: string;
  equipeId: string;
}

export interface UsoCarro {
  id: string;
  edicaoId: string;
  carroId: string;
  equipeId: string;
  responsavelPessoaId: string;
  data: string;
  observacoes: string;
}

export interface Equipe {
  id: string;
  edicaoId: string;
  nome: string;
  carroId: string;
  rotaId: string;
  limiteAlimentacao: number;
  observacoes: string;
}

export interface Pessoa {
  id: string;
  equipeId: string;
  nome: string;
  telefone: string;
  email: string;
  cargo: string;
  isResponsavel: boolean;
}

export interface Rota {
  id: string;
  edicaoId: string;
  equipeId: string;
  nome: string;
  origem: string;
  destino: string;
  observacoes: string;
}

export interface Hotel {
  id: string;
  edicaoId: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
  observacoes: string;
}

export interface Abastecimento {
  id: string;
  carroId: string;
  data: string;
  km: number;
  litros: number;
  valor: number;
  posto: string;
  observacoes: string;
}

export interface Manutencao {
  id: string;
  carroId: string;
  tipo: string;
  descricao: string;
  data: string;
  km: number;
  valor: number;
  observacoes: string;
}

export interface Alimentacao {
  id: string;
  equipeId: string;
  pessoaId: string;
  data: string;
  valor: number;
  descricao: string;
  categoria: string;
  comprovanteImagem?: string;
  comprovanteNome?: string;
  comprovanteMimeType?: string;
}

export interface Alerta {
  id: string;
  edicaoId: string;
  tipo: string;
  titulo: string;
  descricao: string;
  nivel: AlertLevel;
  entidadeRelacionada: string;
  entidadeId: string;
  visualizado: boolean;
}

export interface DashboardSummary {
  teamsCount: number;
  carsCount: number;
  totalFuelCost: number;
  totalMealsCost: number;
  activeAlerts: number;
  teamSummaries: Array<{
    teamId: string;
    teamName: string;
    mealTotal: number;
    mealLimit: number;
    mealStatus: AlertLevel;
    carName: string;
    routeName: string;
    responsibleName: string;
  }>;
}

export interface ResourceCollections {
  years: AnoRally[];
  editions: EdicaoRally[];
  cars: Carro[];
  carUsages: UsoCarro[];
  teams: Equipe[];
  people: Pessoa[];
  routes: Rota[];
  hotels: Hotel[];
  fuelings: Abastecimento[];
  maintenances: Manutencao[];
  meals: Alimentacao[];
  alerts: Alerta[];
}
