import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { rallyApi } from "../services/rallyApi";
import { DashboardSummary, ResourceCollections, ResourceName } from "../types/entities";
import { useSelection } from "./SelectionContext";

type EditionResource = Exclude<ResourceName, "years" | "editions">;

interface RallyDataContextValue {
  data: ResourceCollections;
  dashboard: DashboardSummary | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  reloadEditionData: () => Promise<void>;
  saveResource: (
    resource: ResourceName,
    values: Record<string, unknown>,
    id?: string
  ) => Promise<void>;
  deleteResource: (resource: ResourceName, id: string) => Promise<void>;
}

const editionResources: EditionResource[] = [
  "cars",
  "carUsages",
  "teams",
  "people",
  "routes",
  "hotels",
  "fuelings",
  "maintenances",
  "meals",
  "alerts"
];

const emptyCollections: ResourceCollections = {
  years: [],
  editions: [],
  cars: [],
  carUsages: [],
  teams: [],
  people: [],
  routes: [],
  hotels: [],
  fuelings: [],
  maintenances: [],
  meals: [],
  alerts: []
};

const RallyDataContext = createContext<RallyDataContextValue | null>(null);

export const RallyDataProvider = ({ children }: { children: ReactNode }) => {
  const { selectedEditionId, selectedYearId } = useSelection();
  const [data, setData] = useState<ResourceCollections>(emptyCollections);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadYears = useCallback(async () => {
    const years = await rallyApi.getYears();
    setData((previous) => ({ ...previous, years }));
  }, []);

  const loadEditions = useCallback(async () => {
    const editions = await rallyApi.getEditions(selectedYearId ?? undefined);
    setData((previous) => ({ ...previous, editions }));
  }, [selectedYearId]);

  const reloadEditionData = useCallback(async () => {
    if (!selectedEditionId) {
      setData((previous) => ({
        ...previous,
        cars: [],
        carUsages: [],
        teams: [],
        people: [],
        routes: [],
        hotels: [],
        fuelings: [],
        maintenances: [],
        meals: [],
        alerts: []
      }));
      setDashboard(null);
      return;
    }

    const [dashboardData, ...collections] = await Promise.all([
      rallyApi.getDashboard(selectedEditionId),
      ...editionResources.map((resource) =>
        rallyApi.listResource(
          resource,
          resource === "people" ? undefined : { editionId: selectedEditionId }
        )
      )
    ]);

    const nextData = editionResources.reduce(
      (accumulator, resource, index) => ({
        ...accumulator,
        [resource]: collections[index]
      }),
      {} as Pick<ResourceCollections, EditionResource>
    );

    setDashboard(dashboardData);
    setData((previous) => ({ ...previous, ...nextData }));
  }, [selectedEditionId]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        await loadYears();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha ao carregar anos.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [loadYears]);

  useEffect(() => {
    if (!selectedYearId) {
      setData((previous) => ({ ...previous, editions: [] }));
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        await loadEditions();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha ao carregar edicoes.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [loadEditions, selectedYearId]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        await reloadEditionData();
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha ao carregar dados da edicao.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [reloadEditionData]);

  const saveResource = useCallback<RallyDataContextValue["saveResource"]>(
    async (resource, values, id) => {
      setSaving(true);
      setError(null);

      try {
        if (id) {
          await rallyApi.updateResource(resource, id, values);
        } else {
          await rallyApi.createResource(resource, values);
        }

        if (resource === "years") {
          await loadYears();
        } else if (resource === "editions") {
          await loadEditions();
        } else {
          await reloadEditionData();
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha ao salvar registro.");
        throw cause;
      } finally {
        setSaving(false);
      }
    },
    [loadEditions, loadYears, reloadEditionData]
  );

  const deleteResource = useCallback<RallyDataContextValue["deleteResource"]>(
    async (resource, id) => {
      setSaving(true);
      setError(null);

      try {
        await rallyApi.deleteResource(resource, id);

        if (resource === "years") {
          await loadYears();
        } else if (resource === "editions") {
          await loadEditions();
        } else {
          await reloadEditionData();
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Falha ao remover registro.");
        throw cause;
      } finally {
        setSaving(false);
      }
    },
    [loadEditions, loadYears, reloadEditionData]
  );

  const value = useMemo<RallyDataContextValue>(
    () => ({
      data,
      dashboard,
      loading,
      saving,
      error,
      reloadEditionData,
      saveResource,
      deleteResource
    }),
    [dashboard, data, deleteResource, error, loading, reloadEditionData, saveResource, saving]
  );

  return <RallyDataContext.Provider value={value}>{children}</RallyDataContext.Provider>;
};

export const useRallyData = () => {
  const context = useContext(RallyDataContext);

  if (!context) {
    throw new Error("useRallyData must be used inside RallyDataProvider.");
  }

  return context;
};
