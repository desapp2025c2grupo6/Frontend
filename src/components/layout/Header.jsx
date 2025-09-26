
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="bg-white shadow mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Gestión de la App</h1>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="afiliados">Afiliados</TabsTrigger>
            <TabsTrigger value="prestadores">Prestadores</TabsTrigger>
            <TabsTrigger value="agendas">Agendas</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
}
