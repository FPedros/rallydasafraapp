import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const AlertsPage = () => <CrudResourcePage config={resourcePageConfigs.alerts} />;
