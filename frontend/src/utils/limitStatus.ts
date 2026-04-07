import { ConsumptionStatus } from "../types/entities";

export const getLimitStatus = (valorAtual: number, limite: number): ConsumptionStatus => {
  if (limite <= 0) {
    return "normal";
  }

  const ratio = valorAtual / limite;

  if (ratio > 1) {
    return "exceeded";
  }

  if (ratio >= 0.8) {
    return "warning";
  }

  return "normal";
};
