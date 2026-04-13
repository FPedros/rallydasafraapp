import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRallyData } from "../../hooks/useRallyData";
import { useSelection } from "../../hooks/useSelection";
import { getEditionStageMeta } from "../../utils/editionStage";
import { ProfileMenu } from "./ProfileMenu";
import { Button } from "../ui/Button";

export const AppHeader = () => {
  const { data } = useRallyData();
  const { clearSelection, selectedEditionId, selectedYearId } = useSelection();
  const { logout } = useAuth();

  const selectedYear = data.years.find((year) => year.id === selectedYearId);
  const selectedEdition = data.editions.find((edition) => edition.id === selectedEditionId);
  const stageLabel = selectedEdition ? getEditionStageMeta(selectedEdition).label : "Etapa pendente";

  return (
    <header className="hidden rounded-xl border border-border bg-card p-5 shadow-sm lg:block">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {selectedYear ? `Edicao ${selectedYear.ano}` : "Edicao pendente"} • {stageLabel}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/select-edition">
            <Button variant="ghost">Alterar etapa</Button>
          </Link>
          <ProfileMenu
            onLogout={() => {
              clearSelection();
              logout();
            }}
          />
        </div>
      </div>
    </header>
  );
};
