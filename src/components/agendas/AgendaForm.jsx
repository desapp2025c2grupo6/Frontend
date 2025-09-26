import { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { prestadores, especialidades, diasSemana } from '../../data/mockData';

export function AgendaForm({ agenda, onSave, onClose }) {
  const [formData, setFormData] = useState({
    prestadorId: agenda?.prestadorId || '',
    especialidadId: agenda?.especialidadId || '',
    direccionId: agenda?.direccionId || '',
    horarios: agenda?.horarios || [],
    duracionTurnoMinutos: agenda?.duracionTurnoMinutos || 30,
    fechaAlta: agenda?.fechaAlta || new Date().toISOString().split('T')[0],
    activa: agenda?.activa !== undefined ? agenda.activa : true
  });
  const [prestadorSeleccionado, setPrestadorSeleccionado] = useState(null);
  const [validaciones, setValidaciones] = useState([]);

  useEffect(() => {
    if (formData.prestadorId) {
      const prestador = prestadores.find(p => p.id === formData.prestadorId);
      setPrestadorSeleccionado(prestador);
      if (prestador) {
        if (formData.especialidadId && !prestador.especialidades.includes(formData.especialidadId)) {
          setFormData(prev => ({ ...prev, especialidadId: '' }));
        }
        if (formData.direccionId && !prestador.direcciones.some(d => d.id === formData.direccionId)) {
          setFormData(prev => ({ ...prev, direccionId: '' }));
        }
      }
    } else {
      setPrestadorSeleccionado(null);
    }
  }, [formData.prestadorId]);

  useEffect(() => {
    validarHorarios();
  }, [formData.horarios, formData.direccionId, prestadorSeleccionado]);

  function crearHorarioVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      dia: 'LUNES',
      horaInicio: '08:00',
      horaFin: '17:00'
    };
  }

  const actualizarCampo = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const agregarHorario = () => {
    actualizarCampo('horarios', [...(formData.horarios || []), crearHorarioVacio()]);
  };

  const eliminarHorario = (index) => {
    const nuevosHorarios = (formData.horarios || []).filter((_, i) => i !== index);
    actualizarCampo('horarios', nuevosHorarios);
  };

  const actualizarHorario = (index, campo, valor) => {
    const nuevosHorarios = [...(formData.horarios || [])];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [campo]: valor };
    actualizarCampo('horarios', nuevosHorarios);
  };

  const validarHorarios = () => {
    const errores = [];
    if (!prestadorSeleccionado || !formData.direccionId) {
      setValidaciones(errores);
      return;
    }
    const horariosAtencionPrestador = prestadorSeleccionado.horariosAtencion[formData.direccionId] || [];
    formData.horarios?.forEach((horarioAgenda, index) => {
      const horarioValido = horariosAtencionPrestador.some((horarioAtencion) => {
        if (horarioAtencion.dia !== horarioAgenda.dia) return false;
        const inicioAtencion = new Date(`2024-01-01T${horarioAtencion.horaInicio}`);
        const finAtencion = new Date(`2024-01-01T${horarioAtencion.horaFin}`);
        const inicioAgenda = new Date(`2024-01-01T${horarioAgenda.horaInicio}`);
        const finAgenda = new Date(`2024-01-01T${horarioAgenda.horaFin}`);
        return inicioAgenda >= inicioAtencion && finAgenda <= finAtencion;
      });
      if (!horarioValido) {
        errores.push(`Horario ${index + 1}: ${horarioAgenda.dia} ${horarioAgenda.horaInicio}-${horarioAgenda.horaFin} no está dentro de los horarios de atención del prestador`);
      }
    });
    setValidaciones(errores);
  };

  const especialidadesDisponibles = prestadorSeleccionado
    ? especialidades.filter(e => prestadorSeleccionado.especialidades.includes(e.id))
    : [];
  const direccionesDisponibles = prestadorSeleccionado?.direcciones || [];
  const horariosAtencionDisponibles = prestadorSeleccionado && formData.direccionId
    ? prestadorSeleccionado.horariosAtencion[formData.direccionId] || []
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.prestadorId || !formData.especialidadId || !formData.direccionId) {
      alert('Complete todos los campos obligatorios');
      return;
    }
    if (!formData.horarios || formData.horarios.length === 0) {
      alert('Agregue al menos un horario');
      return;
    }
    if (validaciones.length > 0) {
      alert('Corrija los errores de validación antes de guardar');
      return;
    }
    const agendaData = {
      ...formData,
      id: agenda?.id || Math.random().toString(36).substr(2, 9),
    };
    onSave(agendaData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg">
          {agenda ? 'Editar' : 'Crear'} Agenda de Turnos
        </h3>
        <p className="text-sm text-gray-600">
          Configure los horarios de atención y duración de turnos
        </p>
      </div>
      {/* Selección de prestador y especialidad */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prestador">Prestador *</Label>
              <Select
                value={formData.prestadorId}
                onValueChange={(value) => actualizarCampo('prestadorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prestador" />
                </SelectTrigger>
                <SelectContent>
                  {prestadores.filter(p => p.activo).map(prestador => (
                    <SelectItem key={prestador.id} value={prestador.id}>
                      {prestador.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="especialidad">Especialidad *</Label>
              <Select
                value={formData.especialidadId}
                onValueChange={(value) => actualizarCampo('especialidadId', value)}
                disabled={!prestadorSeleccionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidadesDisponibles.map(especialidad => (
                    <SelectItem key={especialidad.id} value={especialidad.id}>
                      {especialidad.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="direccion">Lugar de Atención *</Label>
              <Select
                value={formData.direccionId}
                onValueChange={(value) => actualizarCampo('direccionId', value)}
                disabled={!prestadorSeleccionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar lugar" />
                </SelectTrigger>
                <SelectContent>
                  {direccionesDisponibles.map(direccion => (
                    <SelectItem key={direccion.id} value={direccion.id}>
                      {direccion.calle} {direccion.numero}, {direccion.localidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duracion">Duración Turno (minutos) *</Label>
              <Select
                value={formData.duracionTurnoMinutos?.toString()}
                onValueChange={(value) => actualizarCampo('duracionTurnoMinutos', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="20">20 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">60 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha-alta">Fecha Alta</Label>
              <Input
                id="fecha-alta"
                type="date"
                value={formData.fechaAlta}
                onChange={(e) => actualizarCampo('fechaAlta', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Horarios de atención del prestador */}
      {horariosAtencionDisponibles.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Horarios de Atención del Prestador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {horariosAtencionDisponibles.map((horario, index) => (
                <div key={index} className="text-blue-700">
                  {horario.dia.charAt(0) + horario.dia.slice(1).toLowerCase()}: {horario.horaInicio} - {horario.horaFin}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Horarios de la agenda */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Horarios de Turnos</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={agregarHorario}
              disabled={!formData.direccionId}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar Horario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.horarios?.map((horario, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-sm font-medium w-8">{index + 1}.</span>
              <Select
                value={horario.dia}
                onValueChange={(value) => actualizarHorario(index, 'dia', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {diasSemana.map(dia => (
                    <SelectItem key={dia} value={dia}>
                      {dia.charAt(0) + dia.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={horario.horaInicio}
                onChange={(e) => actualizarHorario(index, 'horaInicio', e.target.value)}
                className="w-32"
              />
              <span className="text-sm">a</span>
              <Input
                type="time"
                value={horario.horaFin}
                onChange={(e) => actualizarHorario(index, 'horaFin', e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => eliminarHorario(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.horarios?.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay horarios configurados. Agregue al menos uno.
            </p>
          )}
        </CardContent>
      </Card>
      {/* Validaciones */}
      {validaciones.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">Errores de validación:</div>
            <ul className="list-disc list-inside space-y-1">
              {validaciones.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {/* Información de turnos */}
      {formData.horarios && formData.horarios.length > 0 && formData.duracionTurnoMinutos && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <h4 className="font-medium text-green-800 mb-2">Resumen de Turnos</h4>
            <div className="text-sm text-green-700">
              <p>Turnos por semana: {
                Math.floor(
                  formData.horarios.reduce((total, horario) => {
                    const inicio = new Date(`2024-01-01T${horario.horaInicio}`);
                    const fin = new Date(`2024-01-01T${horario.horaFin}`);
                    const minutos = (fin.getTime() - inicio.getTime()) / (1000 * 60);
                    return total + minutos;
                  }, 0) / formData.duracionTurnoMinutos
                )
              }</p>
              <p>Duración por turno: {formData.duracionTurnoMinutos} minutos</p>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={validaciones.length > 0}>
          {agenda ? 'Actualizar' : 'Crear'} Agenda
        </Button>
      </div>
    </form>
  );
}
