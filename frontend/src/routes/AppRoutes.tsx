import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSelection } from "../hooks/useSelection";
import { MainLayout } from "../layouts/MainLayout";
import { AlertsPage } from "../pages/AlertsPage";
import { CarDetailPage } from "../pages/CarDetailPage";
import { CarsPage } from "../pages/CarsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EditionSelectionPage } from "../pages/EditionSelectionPage";
import { FuelingsPage } from "../pages/FuelingsPage";
import { HotelsPage } from "../pages/HotelsPage";
import { MaintenancesPage } from "../pages/MaintenancesPage";
import { MealsPage } from "../pages/MealsPage";
import { PeoplePage } from "../pages/PeoplePage";
import { RoutesPage } from "../pages/RoutesPage";
import { TeamDetailPage } from "../pages/TeamDetailPage";
import { TeamsPage } from "../pages/TeamsPage";
import { WelcomePage } from "../pages/WelcomePage";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { selectedEditionId, selectedYearId } = useSelection();

  if (!isAuthenticated) {
    return <WelcomePage />;
  }

  if (!selectedYearId || !selectedEditionId) {
    return <Navigate to="/select-edition" replace />;
  }

  return <Navigate to="/app/dashboard" replace />;
};

const RequireAuth = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const RequireSelection = () => {
  const { selectedEditionId, selectedYearId } = useSelection();

  if (!selectedYearId || !selectedEditionId) {
    return <Navigate to="/select-edition" replace />;
  }

  return <MainLayout />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route element={<RequireAuth />}>
      <Route path="/select-edition" element={<EditionSelectionPage />} />
      <Route path="/app" element={<RequireSelection />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="cars/:id" element={<CarDetailPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="teams/:id" element={<TeamDetailPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="fuelings" element={<FuelingsPage />} />
        <Route path="maintenances" element={<MaintenancesPage />} />
        <Route path="meals" element={<MealsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route index element={<Navigate to="/app/dashboard" replace />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
