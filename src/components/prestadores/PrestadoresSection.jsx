import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Stethoscope, Building2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PrestadorForm } from './PrestadorForm';
import { prestadores, especialidades } from '../../data/mockData';

export default function PrestadoresSection() {
  const [filtros, setFiltros] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const prestadoresFiltrados = prestadores.filter(prestador => {
    if (!prestador.activo) return false;
    if (filtros.cuitCuil && !prestador.cuitCuil.includes(filtros.cuitCuil)) return false;
    if (filtros.nombre && !prestador.nombreCompleto.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    if (filtros.codigoPostal) {
      const tieneCodigoPostal = prestador.direcciones.some(dir => dir.codigoPostal?.includes(filtros.codigoPostal));
      if (!tieneCodigoPostal) return false;
    }
    if (filtros.especialidad) {
      if (!prestador.especialidades.includes(filtros.especialidad)) return false;
    }
    if (filtros.diaAtencion) {
      const tieneHorarioEnDia = Object.values(prestador.horariosAtencion).some(horarios =>
        horarios.some(horario => horario.dia === filtros.diaAtencion)
      );
      if (!tieneHorarioEnDia) return false;
    }
    return true;
  });

  const getEspecialidadNombre = (especialidadId) => {
    const especialidad = especialidades.find(e => e.id === especialidadId);
    return especialidad?.nombre || especialidadId;
  };

  const getDireccionesPrincipales = (prestador) => {
    return prestador.direcciones.slice(0, 2);
  };

  const getHorariosResumen = (prestador) => {
    const todosHorarios = Object.values(prestador.horariosAtencion).flat();
    const dias = [...new Set(todosHorarios.map(h => h.dia))];
    return dias.slice(0, 3).join(', ');
  };

  return (
    <div className="prestadores-section">
      {/* Header */}
      <div className="prestadores-header-bar">
        <div>
          <h2 className="prestadores-title">Gestión de Prestadores</h2>
          <p className="prestadores-subtitle">Administra profesionales y centros médicos</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button className="prestadores-nuevo-btn flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Prestador</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Prestador</DialogTitle>
            </DialogHeader>
            <PrestadorForm
              onClose={() => setMostrarFormulario(false)}
              onSave={(prestador) => {
                console.log('Guardando prestador:', prestador);
                setMostrarFormulario(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Filtros */}
      <div className="prestadores-search-card">
        <div className="prestadores-search-header">
          <Search className="h-5 w-5" />
          <span>Buscar Prestadores</span>
        </div>
        <form className="prestadores-search-row" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="prestadores-search-field">
            <label className="prestadores-search-label">CUIT/CUIL</label>
            <Input
              className="prestadores-search-input"
              placeholder="20123456789"
              value={filtros.cuitCuil || ''}
              onChange={(e) => setFiltros({ ...filtros, cuitCuil: e.target.value })}
            />
          </div>
          <div className="prestadores-search-field">
            <label className="prestadores-search-label">Nombre</label>
            <Input
              className="prestadores-search-input"
              placeholder="Buscar por nombre..."
              value={filtros.nombre || ''}
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
            />
          </div>
          <div className="prestadores-search-field">
            <label className="prestadores-search-label">Código Postal</label>
            <Input
              className="prestadores-search-input"
              placeholder="1043"
              value={filtros.codigoPostal || ''}
              onChange={(e) => setFiltros({ ...filtros, codigoPostal: e.target.value })}
            />
          </div>
          <div className="prestadores-search-field">
            <label className="prestadores-search-label">Especialidad</label>
            <Select value={filtros.especialidad || 'all'} onValueChange={(value) => setFiltros({ ...filtros, especialidad: value === 'all' ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {especialidades.map(esp => (
                  <SelectItem key={esp.id} value={esp.id}>{esp.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="prestadores-search-field">
            <label className="prestadores-search-label">Día de Atención</label>
            <Select value={filtros.diaAtencion || 'all'} onValueChange={(value) => setFiltros({ ...filtros, diaAtencion: value === 'all' ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="LUNES">Lunes</SelectItem>
                <SelectItem value="MARTES">Martes</SelectItem>
                <SelectItem value="MIERCOLES">Miércoles</SelectItem>
                <SelectItem value="JUEVES">Jueves</SelectItem>
                <SelectItem value="VIERNES">Viernes</SelectItem>
                <SelectItem value="SABADO">Sábado</SelectItem>
                <SelectItem value="DOMINGO">Domingo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
      {/* Lista de prestadores */}
      <div className="prestadores-list">
        {[...prestadoresFiltrados].sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto)).map((prestador) => (
              <div key={prestador.id} className="prestadores-card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', background: '#fff', border: '1.5px solid #e5e7eb', padding: 0, marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', background: '#a3b18a', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', padding: '1.2rem 1.5rem', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ background: '#eaf3fa', borderRadius: '8px', padding: '0.5rem' }}>
                  <User style={{ color: '#2563eb', width: 28, height: 28 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>{prestador.nombreCompleto}</div>
                  <div style={{ color: '#222', fontSize: '0.98rem' }}>CUIT/CUIL: {prestador.cuitCuil}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 'none' }}>
                <Button variant="outline" size="sm" className="prestadores-action-btn" style={{ background: '#222', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: 'none' }}>
                  <Edit className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="prestadores-action-btn" style={{ background: '#222', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: 'none' }}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.2rem', gap: '2rem', width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem', textAlign: 'center' }}>Especialidades</div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', minHeight: '32px' }}>
                  {prestador.especialidades.map((espId) => (
                    <span key={espId} style={{ background: '#eaf3fa', color: '#2563eb', borderRadius: '6px', padding: '0.2rem 0.7rem', fontSize: '0.95em', fontWeight: 500 }}>{getEspecialidadNombre(espId)}</span>
                  ))}
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Dirección</div>
                <div style={{ color: '#25613b', fontSize: '0.98rem' }}>{prestador.direcciones[0].calle} {prestador.direcciones[0].numero}, {prestador.direcciones[0].localidad}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Teléfono</div>
                <div style={{ color: '#25613b', fontSize: '0.98rem' }}>{prestador.telefonos[0]?.numero || '-'}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Días de Atención</div>
                <div style={{ color: '#25613b', fontSize: '0.98rem' }}>{getHorariosResumen(prestador)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#64748b', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Estado</div>
             <span style={{ background: '#fff', color: '#222', borderRadius: '8px', padding: '0.35rem 1.1rem', fontSize: '1em', fontWeight: 500, border: '1.5px solid #b2be97', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>Activo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {prestadoresFiltrados.length === 0 && (
        <div className="prestadores-card">
          <div className="py-12 text-center">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No se encontraron prestadores</h3>
            <p className="text-gray-600">
              {Object.values(filtros).some(v => v) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza registrando un nuevo prestador'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
