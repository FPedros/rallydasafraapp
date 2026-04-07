import { useNavigate } from "react-router-dom";
import { PageSection } from "../components/shared/PageSection";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useRallyData } from "../hooks/useRallyData";
import { useSelection } from "../hooks/useSelection";

export const YearSelectionPage = () => {
  const navigate = useNavigate();
  const { data, loading } = useRallyData();
  const { selectedYearId, setSelectedYearId } = useSelection();

  return (
    <div className="w-full px-4 py-8 sm:px-6 xl:px-8 2xl:px-10">
      <PageSection
        title="Selecao do ano"
        description="O sistema so exibe dados operacionais depois que o ano e a edicao forem escolhidos."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {data.years.map((year) => (
            <Card key={year.id} className="space-y-4">
              <div>
                <p className="text-sm text-text/70">Ano do Rally</p>
                <h2 className="text-3xl font-bold text-dark">{year.ano}</h2>
              </div>
              <p className="text-sm text-text/75">
                Status: {year.ativo ? "ativo para novas operacoes" : "historico encerrado"}
              </p>
              <Button
                fullWidth
                variant={selectedYearId === year.id ? "accent" : "primary"}
                onClick={() => {
                  setSelectedYearId(year.id);
                  navigate("/select-edition");
                }}
              >
                Selecionar ano
              </Button>
            </Card>
          ))}
          {!loading && data.years.length === 0 ? <Card>Nenhum ano disponivel.</Card> : null}
        </div>
      </PageSection>
    </div>
  );
};
