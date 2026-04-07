import { EdicaoRally } from "../types/entities";

export type StageKey = "soja" | "milho" | "algodao";

interface StageMeta {
  label: string;
  description: string;
}

const STAGE_META: Record<StageKey, StageMeta> = {
  soja: {
    label: "Soja",
    description: "Operacao principal de levantamento em campo da safra de soja."
  },
  milho: {
    label: "Milho",
    description: "Etapa dedicada ao monitoramento e consolidacao do milho."
  },
  algodao: {
    label: "Algodao",
    description: "Etapa reservada para o acompanhamento da operacao de algodao."
  }
};

export const ALL_STAGE_KEYS: StageKey[] = ["soja", "milho", "algodao"];

const EDITION_STAGE_BY_ID: Record<string, StageKey> = {
  "edition-2025-milho": "milho",
  "edition-2026-soja": "soja",
  "edition-2026-visitas": "algodao"
};

export const getEditionStageKey = (edition: EdicaoRally): StageKey => {
  const mappedStage = EDITION_STAGE_BY_ID[edition.id];

  if (mappedStage) {
    return mappedStage;
  }

  const normalizedText = `${edition.nome} ${edition.descricao}`.toLowerCase();

  if (normalizedText.includes("algod")) {
    return "algodao";
  }

  if (normalizedText.includes("milho")) {
    return "milho";
  }

  return "soja";
};

export const getEditionStageMeta = (edition: EdicaoRally): StageMeta =>
  STAGE_META[getEditionStageKey(edition)];

export const getStageMetaByKey = (stage: StageKey): StageMeta => STAGE_META[stage];
