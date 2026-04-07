import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/shared/AppHeader";
import { BottomNav } from "../components/shared/BottomNav";
import { SidebarNav } from "../components/shared/SidebarNav";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/cars", label: "Carros" },
  { to: "/app/teams", label: "Equipes" },
  { to: "/app/people", label: "Pessoas" },
  { to: "/app/routes", label: "Rotas" },
  { to: "/app/hotels", label: "Hoteis" },
  { to: "/app/fuelings", label: "Abastec." },
  { to: "/app/maintenances", label: "Manut." },
  { to: "/app/meals", label: "Aliment." },
  { to: "/app/alerts", label: "Alertas" }
];

export const MainLayout = () => (
  <div className="min-h-screen w-full px-4 py-4 pb-24 sm:px-6 xl:px-8 2xl:px-10 lg:pb-6">
    <div className="flex w-full items-start gap-6">
      <SidebarNav items={navItems} />
      <main className="min-w-0 flex-1 space-y-6">
        <AppHeader />
        <Outlet />
      </main>
    </div>
    <BottomNav items={navItems} />
  </div>
);
