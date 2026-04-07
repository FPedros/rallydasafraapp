import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface SelectionContextValue {
  selectedYearId: string | null;
  selectedEditionId: string | null;
  setSelectedYearId: (value: string | null) => void;
  setSelectedEditionId: (value: string | null) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const YEAR_KEY = "rally:selected-year";
const EDITION_KEY = "rally:selected-edition";

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYearId, setSelectedYear] = useState<string | null>(
    () => localStorage.getItem(YEAR_KEY) || null
  );
  const [selectedEditionId, setSelectedEdition] = useState<string | null>(
    () => localStorage.getItem(EDITION_KEY) || null
  );

  useEffect(() => {
    if (selectedYearId) {
      localStorage.setItem(YEAR_KEY, selectedYearId);
    } else {
      localStorage.removeItem(YEAR_KEY);
    }
  }, [selectedYearId]);

  useEffect(() => {
    if (selectedEditionId) {
      localStorage.setItem(EDITION_KEY, selectedEditionId);
    } else {
      localStorage.removeItem(EDITION_KEY);
    }
  }, [selectedEditionId]);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedYearId,
      selectedEditionId,
      setSelectedYearId: (value) => {
        setSelectedYear(value);
        setSelectedEdition(null);
      },
      setSelectedEditionId: setSelectedEdition,
      clearSelection: () => {
        setSelectedYear(null);
        setSelectedEdition(null);
      }
    }),
    [selectedEditionId, selectedYearId]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = () => {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used inside SelectionProvider.");
  }

  return context;
};
