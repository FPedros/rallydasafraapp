import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const RoutesPage = () => <CrudResourcePage config={resourcePageConfigs.routes} />;
