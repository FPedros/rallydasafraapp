import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const PeoplePage = () => <CrudResourcePage config={resourcePageConfigs.people} />;
