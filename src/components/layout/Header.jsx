
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, Stethoscope, Calendar, BarChart2 } from "lucide-react";

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="navbar-header">
      <div className="navbar-content-full">
        <div className="navbar-title-group">
          <h1 className="navbar-title">Sistema de Medicina Integral</h1>
          <div className="navbar-subtitle">Administración de afiliados y prestadores</div>
        </div>
        <nav className="navbar-menu-below">
          <Tabs value={activeTab} onValueChange={onTabChange} className="tabs-navbar">
            <TabsList className="TabsList">
              <TabsTrigger value="afiliados" className="TabsTrigger">
                <Users style={{ width: 20, height: 20, marginRight: 6 }} /> Afiliados
              </TabsTrigger>
              <TabsTrigger value="prestadores" className="TabsTrigger">
                <Stethoscope style={{ width: 20, height: 20, marginRight: 6 }} /> Prestadores
              </TabsTrigger>
              <TabsTrigger value="agendas" className="TabsTrigger">
                <Calendar style={{ width: 20, height: 20, marginRight: 6 }} /> Agendas
              </TabsTrigger>
              <TabsTrigger value="reportes" className="TabsTrigger">
                <BarChart2 style={{ width: 20, height: 20, marginRight: 6 }} /> Reportes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>
      </div>
    </header>
  );
}
