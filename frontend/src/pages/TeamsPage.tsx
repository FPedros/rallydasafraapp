import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const TeamsPage = () => <CrudResourcePage config={resourcePageConfigs.teams} />;
