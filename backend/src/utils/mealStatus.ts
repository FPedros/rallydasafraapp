import { AlertLevel } from "../types/entities.js";

export const getLimitStatus = (valorAtual: number, limite: number): AlertLevel => {
  if (limite <= 0) {
    return "normal";
  }

  const ratio = valorAtual / limite;

  if (ratio > 1) {
    return "critical";
  }

  if (ratio >= 0.8) {
    return "warning";
  }

  return "normal";
};
