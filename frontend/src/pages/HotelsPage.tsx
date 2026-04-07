import { CrudResourcePage } from "../components/shared/CrudResourcePage";
import { resourcePageConfigs } from "./resourceDefinitions";

export const HotelsPage = () => <CrudResourcePage config={resourcePageConfigs.hotels} />;
