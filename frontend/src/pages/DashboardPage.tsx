import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { useRallyData } from "../hooks/useRallyData";
import { formatCurrency } from "../utils/formatters";

export const DashboardPage = () => {
  const { dashboard, loading } = useRallyData();

  if (loading && !dashboard) {
    return <Card>Carregando visao operacional...</Card>;
  }

  if (!dashboard) {
    return <Alert title="Contexto incompleto">Selecione ano e edicao para abrir o dashboard.</Alert>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Equipes" value={String(dashboard.teamsCount)} />
        <StatCard label="Carros" value={String(dashboard.carsCount)} />
        <StatCard label="Combustivel" value={formatCurrency(dashboard.totalFuelCost)} />
        <StatCard
          label="Alertas ativos"
          value={String(dashboard.activeAlerts)}
          status={dashboard.activeAlerts > 0 ? "warning" : "normal"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-sm text-text/70">Resumo por equipe</p>
            <h2 className="text-2xl font-bold text-dark">Operacao consolidada</h2>
          </div>
          <div className="grid gap-4">
            {dashboard.teamSummaries.map((team) => (
              <div
                key={team.teamId}
                className="rounded-3xl border border-primary/10 bg-primary/10 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-dark">{team.teamName}</h3>
                    <p className="mt-1 text-sm text-text/70">
                      {team.carName} • {team.routeName}
                    </p>
                  </div>
                  <Badge variant={team.mealStatus === "critical" ? "critical" : team.mealStatus}>
                    {team.mealStatus}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-text/75 sm:grid-cols-3">
                  <p>Responsavel: {team.responsibleName}</p>
                  <p>Alimentacao: {formatCurrency(team.mealTotal)}</p>
                  <p>Limite: {formatCurrency(team.mealLimit)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm text-text/70">Financeiro rapido</p>
          <h2 className="text-2xl font-bold text-dark">{formatCurrency(dashboard.totalMealsCost)}</h2>
          <p className="text-sm text-text/75">
            Total de alimentacao registrado nesta edicao ate o momento.
          </p>
          {dashboard.activeAlerts > 0 ? (
            <Alert title="Atencao operacional">
              Existem {dashboard.activeAlerts} alertas ativos para acompanhamento imediato.
            </Alert>
          ) : (
            <Alert title="Operacao estabilizada">Nao ha alertas pendentes no momento.</Alert>
          )}
        </Card>
      </div>
    </div>
  );
};
