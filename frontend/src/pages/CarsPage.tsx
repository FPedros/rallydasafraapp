import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const CarsPage = () => <CrudResourcePage config={resourcePageConfigs.cars} />;
