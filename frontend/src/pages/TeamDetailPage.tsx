import { Navigate, useParams } from "react-router-dom";
import { PageSection } from "../components/shared/PageSection";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { useRallyData } from "../hooks/useRallyData";
import { formatCurrency } from "../utils/formatters";
import { getLimitStatus } from "../utils/limitStatus";

export const TeamDetailPage = () => {
  const { id } = useParams();
  const { data } = useRallyData();
  const team = data.teams.find((entry) => entry.id === id);

  if (!team) {
    return <Navigate to="/app/teams" replace />;
  }

  const car = data.cars.find((entry) => entry.id === team.carroId);
  const route = data.routes.find((entry) => entry.id === team.rotaId);
  const people = data.people.filter((entry) => entry.equipeId === team.id);
  const meals = data.meals.filter((entry) => entry.equipeId === team.id);
  const alerts = data.alerts.filter((entry) => entry.entidadeId === team.id || entry.edicaoId === team.edicaoId);
  const totalMeals = meals.reduce((sum, entry) => sum + entry.valor, 0);
  const limitStatus = getLimitStatus(totalMeals, team.limiteAlimentacao);

  return (
    <div className="space-y-6">
      <PageSection
        title={team.nome}
        description="Visao detalhada da equipe, pessoas, trajeto, carro e consumo."
      >
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text/70">Equipe</p>
                <h2 className="text-3xl font-bold text-dark">{team.nome}</h2>
              </div>
              <Badge variant={limitStatus === "exceeded" ? "critical" : limitStatus}>
                {limitStatus}
              </Badge>
            </div>
            <div className="grid gap-3 text-sm text-text/75 sm:grid-cols-2">
              <p>Carro: {car ? `${car.marca} ${car.modelo}` : "Nao vinculado"}</p>
              <p>Partida: {route?.origem ?? "Nao definida"}</p>
              <p>Chegada: {route?.destino ?? "Nao definida"}</p>
              <p>Budget: {formatCurrency(team.limiteAlimentacao)}</p>
              <p>Total consumido: {formatCurrency(totalMeals)}</p>
            </div>
            <p className="rounded-3xl bg-primary/10 px-4 py-3 text-sm text-dark">{team.observacoes}</p>
          </Card>
          <Card className="space-y-3">
            <p className="text-sm text-text/70">Resumo financeiro</p>
            <p className="text-3xl font-bold text-dark">{formatCurrency(totalMeals)}</p>
            <p className="text-sm text-text/75">
              Budget configurado: {formatCurrency(team.limiteAlimentacao)}
            </p>
            <p className="text-sm text-text/75">
              Margem restante: {formatCurrency(team.limiteAlimentacao - totalMeals)}
            </p>
          </Card>
        </div>
      </PageSection>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <PageSection title="Pessoas da equipe">
          <div className="grid gap-4">
            {people.map((person) => {
              const totalByPerson = meals
                .filter((entry) => entry.pessoaId === person.id)
                .reduce((sum, entry) => sum + entry.valor, 0);

              return (
                <Card key={person.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-dark">{person.nome}</h3>
                      <p className="text-sm text-text/70">{person.cargo}</p>
                    </div>
                    {person.isResponsavel ? <Badge variant="warning">responsavel</Badge> : null}
                  </div>
                  <div className="grid gap-2 text-sm text-text/75 sm:grid-cols-2">
                    <p>{person.telefone}</p>
                    <p>{person.email}</p>
                    <p>Total alimentacao: {formatCurrency(totalByPerson)}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </PageSection>

        <PageSection title="Alertas relacionados">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-dark">{alert.titulo}</p>
                  <Badge variant={alert.nivel === "critical" ? "critical" : "warning"}>
                    {alert.nivel}
                  </Badge>
                </div>
                <p className="text-sm text-text/75">{alert.descricao}</p>
              </Card>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
};
