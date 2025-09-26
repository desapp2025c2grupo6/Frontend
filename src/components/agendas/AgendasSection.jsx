import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AgendaForm } from './AgendaForm';
import { agendasTurnos, prestadores, especialidades } from '../../data/mockData';

export function AgendasSection() {
  const [filtros, setFiltros] = useState({ prestador: '', especialidad: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [agendaSeleccionada, setAgendaSeleccionada] = useState(null);

  const agendasFiltradas = agendasTurnos.filter(agenda => {
    if (!agenda.activa) return false;
    if (filtros.prestador && agenda.prestadorId !== filtros.prestador) return false;
    if (filtros.especialidad && agenda.especialidadId !== filtros.especialidad) return false;
    return true;
  });

  const getPrestadorNombre = (prestadorId) => {
    const prestador = prestadores.find(p => p.id === prestadorId);
    return prestador?.nombreCompleto || 'Prestador no encontrado';
  };

  const getEspecialidadNombre = (especialidadId) => {
    const especialidad = especialidades.find(e => e.id === especialidadId);
    return especialidad?.nombre || 'Especialidad no encontrada';
  };

  const getDireccionTexto = (prestadorId, direccionId) => {
    const prestador = prestadores.find(p => p.id === prestadorId);
    const direccion = prestador?.direcciones.find(d => d.id === direccionId);
    if (!direccion) return 'Dirección no encontrada';
    return `${direccion.calle} ${direccion.numero}, ${direccion.localidad}`;
  };

  const formatearHorarios = (horarios) => {
    return horarios.map(h => `${h.dia.charAt(0) + h.dia.slice(1).toLowerCase()}: ${h.horaInicio}-${h.horaFin}`).join(', ');
  };

  const calcularTurnosPorSemana = (agenda) => {
    let totalMinutos = 0;
    agenda.horarios.forEach(horario => {
      const inicio = new Date(`2024-01-01T${horario.horaInicio}`);
      const fin = new Date(`2024-01-01T${horario.horaFin}`);
      const minutos = (fin.getTime() - inicio.getTime()) / (1000 * 60);
      totalMinutos += minutos;
    });
    return Math.floor(totalMinutos / agenda.duracionTurnoMinutos);
  };

  const editarAgenda = (agenda) => {
    setAgendaSeleccionada(agenda);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setAgendaSeleccionada(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-gray-900">Gestión de Agendas de Turnos</h2>
          <p className="text-gray-600">Configura horarios y turnos disponibles para cada prestador</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2" onClick={() => setAgendaSeleccionada(null)}>
              <Plus className="h-4 w-4" />
              <span>Nueva Agenda</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {agendaSeleccionada ? 'Editar' : 'Crear'} Agenda de Turnos
              </DialogTitle>
            </DialogHeader>
            <AgendaForm
              agenda={agendaSeleccionada || undefined}
              onClose={cerrarFormulario}
              onSave={(agenda) => {
                console.log('Guardando agenda:', agenda);
                cerrarFormulario();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filtrar Agendas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Prestador</label>
              <Select value={filtros.prestador || 'all'} onValueChange={(value) => setFiltros({ ...filtros, prestador: value === 'all' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los prestadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los prestadores</SelectItem>
                  {prestadores.filter(p => p.activo).map(prestador => (
                    <SelectItem key={prestador.id} value={prestador.id}>
                      {prestador.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2">Especialidad</label>
              <Select value={filtros.especialidad || 'all'} onValueChange={(value) => setFiltros({ ...filtros, especialidad: value === 'all' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  {especialidades.filter(e => e.activa).map(especialidad => (
                    <SelectItem key={especialidad.id} value={especialidad.id}>
                      {especialidad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Lista de agendas */}
      <div className="space-y-4">
        {agendasFiltradas.map((agenda) => (
          <Card key={agenda.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">
                      {getPrestadorNombre(agenda.prestadorId)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {getEspecialidadNombre(agenda.especialidadId)} • 
                      Creada: {new Date(agenda.fechaAlta).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {calcularTurnosPorSemana(agenda)} turnos/semana
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => editarAgenda(agenda)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Lugar de Atención
                  </h4>
                  <p className="text-gray-600">
                    {getDireccionTexto(agenda.prestadorId, agenda.direccionId)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Horarios
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {formatearHorarios(agenda.horarios)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <strong>Duración:</strong> {agenda.duracionTurnoMinutos} minutos
                    </p>
                    <p className="text-gray-600">
                      <strong>Estado:</strong> 
                      <Badge variant={agenda.activa ? 'success' : 'destructive'} className="ml-2">
                        {agenda.activa ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {agendasFiltradas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No se encontraron agendas</h3>
            <p className="text-gray-600">
              {Object.values(filtros).some(v => v) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando una nueva agenda de turnos'
              }
            </p>
          </CardContent>
        </Card>
      )}
      {/* Validaciones y alertas */}
      {agendasFiltradas.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-orange-800 mb-2">Validaciones Automáticas</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Las agendas se validan automáticamente contra horarios de atención del prestador</li>
              <li>• Se verifica que las especialidades correspondan al prestador</li>
              <li>• Los lugares de atención deben estar registrados en el prestador</li>
            </ul>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

export default AgendasSection;

