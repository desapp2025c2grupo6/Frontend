import { useState } from 'react';
import Header from './components/layout/Header';
import AfiliadosSection from './components/afiliados/AfiliadosSection';
import PrestadoresSection from './components/prestadores/PrestadoresSection';
import AgendasSection from './components/agendas/AgendasSection';
import ReportesSection from './components/reportes/ReportesSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('afiliados');

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'afiliados':
        return <AfiliadosSection />;
      case 'prestadores':
        return <PrestadoresSection />;
      case 'agendas':
        return <AgendasSection />;
      case 'reportes':
        return <ReportesSection />;
      default:
        return <AfiliadosSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderActiveSection()}
      </main>
    </div>
  );
}