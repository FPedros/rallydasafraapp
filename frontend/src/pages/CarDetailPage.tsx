import { Navigate, useParams } from "react-router-dom";
import { PageSection } from "../components/shared/PageSection";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useRallyData } from "../hooks/useRallyData";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters";

export const CarDetailPage = () => {
  const { id } = useParams();
  const { data } = useRallyData();
  const car = data.cars.find((entry) => entry.id === id);

  if (!car) {
    return <Navigate to="/app/cars" replace />;
  }

  const usageHistory = data.carUsages
    .filter((entry) => entry.carroId === car.id)
    .sort((left, right) => right.data.localeCompare(left.data));
  const latestUsage = usageHistory[0];
  const team = data.teams.find((entry) => entry.id === (latestUsage?.equipeId ?? car.equipeId));
  const route = data.routes.find((entry) => entry.id === team?.rotaId);
  const responsible = latestUsage
    ? data.people.find((entry) => entry.id === latestUsage.responsavelPessoaId)
    : data.people.find((entry) => entry.equipeId === team?.id && entry.isResponsavel);
  const fuelings = data.fuelings.filter((entry) => entry.carroId === car.id);
  const maintenances = data.maintenances.filter((entry) => entry.carroId === car.id);
  const totalCost =
    fuelings.reduce((sum, entry) => sum + entry.valor, 0) +
    maintenances.reduce((sum, entry) => sum + entry.valor, 0);

  return (
    <div className="space-y-6">
      <PageSection
        title={`${car.marca} ${car.modelo}`}
        description="Historico do carro dentro da edicao selecionada."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="space-y-3 xl:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text/70">Placa</p>
                <h2 className="text-3xl font-bold text-dark">{car.placa}</h2>
              </div>
              <Badge variant={car.status === "ativo" ? "normal" : "warning"}>{car.status}</Badge>
            </div>
            <div className="grid gap-3 text-sm text-text/75 sm:grid-cols-2">
              <p>Equipe atual: {team?.nome ?? "Nao vinculada"}</p>
              <p>Responsavel atual: {responsible?.nome ?? "Sem responsavel"}</p>
              <p>Quilometragem atual: {formatNumber(car.kmAtual)} km</p>
              <p>Trajeto atual: {route ? `${route.origem} -> ${route.destino}` : "Sem rota"}</p>
            </div>
            <p className="rounded-3xl bg-primary/10 px-4 py-3 text-sm text-dark">{car.observacoes}</p>
          </Card>
          <Card className="space-y-3">
            <p className="text-sm text-text/70">Gastos relacionados</p>
            <p className="text-3xl font-bold text-dark">{formatCurrency(totalCost)}</p>
            <p className="text-sm text-text/75">
              Abastecimentos: {formatCurrency(fuelings.reduce((sum, entry) => sum + entry.valor, 0))}
            </p>
            <p className="text-sm text-text/75">
              Manutencoes: {formatCurrency(maintenances.reduce((sum, entry) => sum + entry.valor, 0))}
            </p>
            <p className="text-sm text-text/75">
              Usos na edicao: {formatNumber(usageHistory.length)}
            </p>
          </Card>
        </div>
      </PageSection>

      <div className="grid gap-4 xl:grid-cols-3">
        <PageSection title="Historico de uso na edicao">
          <div className="grid gap-4">
            {usageHistory.length > 0 ? (
              usageHistory.map((entry) => {
                const usageTeam = data.teams.find((teamEntry) => teamEntry.id === entry.equipeId);
                const usageResponsible = data.people.find(
                  (personEntry) => personEntry.id === entry.responsavelPessoaId
                );

                return (
                  <Card key={entry.id} className="space-y-2 text-sm text-text/75">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-dark">{formatDate(entry.data)}</p>
                      <Badge variant="normal">uso</Badge>
                    </div>
                    <p>Equipe: {usageTeam?.nome ?? "Nao vinculada"}</p>
                    <p>Responsavel: {usageResponsible?.nome ?? "Sem responsavel"}</p>
                    <p>{entry.observacoes}</p>
                  </Card>
                );
              })
            ) : (
              <Card className="text-sm text-text/75">Nenhum uso registrado nesta edicao.</Card>
            )}
          </div>
        </PageSection>

        <PageSection title="Historico de abastecimentos">
          <div className="grid gap-4">
            {fuelings.map((entry) => (
              <Card key={entry.id} className="text-sm text-text/75">
                <p className="font-semibold text-dark">{entry.posto}</p>
                <p>
                  {formatDate(entry.data)} • {entry.litros} litros
                </p>
                <p>
                  KM {formatNumber(entry.km)} • {formatCurrency(entry.valor)}
                </p>
              </Card>
            ))}
          </div>
        </PageSection>

        <PageSection title="Historico de manutencoes">
          <div className="grid gap-4">
            {maintenances.map((entry) => (
              <Card key={entry.id} className="text-sm text-text/75">
                <p className="font-semibold text-dark">{entry.tipo}</p>
                <p>{entry.descricao}</p>
                <p>
                  {formatDate(entry.data)} • KM {formatNumber(entry.km)}
                </p>
                <p>{formatCurrency(entry.valor)}</p>
              </Card>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
};
