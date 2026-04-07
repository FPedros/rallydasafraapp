import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const MaintenancesPage = () => <CrudResourcePage config={resourcePageConfigs.maintenances} />;
