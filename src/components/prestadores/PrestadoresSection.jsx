import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Stethoscope, Building2, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl text-gray-900">Gestión de Prestadores</h2>
          <p className="text-gray-600">Administra profesionales y centros médicos</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Prestadores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block mb-2">CUIT/CUIL</label>
              <Input
                placeholder="20123456789"
                value={filtros.cuitCuil || ''}
                onChange={(e) => setFiltros({ ...filtros, cuitCuil: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Nombre</label>
              <Input
                placeholder="Buscar por nombre..."
                value={filtros.nombre || ''}
                onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Código Postal</label>
              <Input
                placeholder="1043"
                value={filtros.codigoPostal || ''}
                onChange={(e) => setFiltros({ ...filtros, codigoPostal: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Especialidad</label>
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
            <div>
              <label className="block mb-2">Día de Atención</label>
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
          </div>
        </CardContent>
      </Card>
      {/* Lista de prestadores */}
      <div className="grid gap-6">
        {prestadoresFiltrados.map((prestador) => (
          <Card key={prestador.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {prestador.esCentroMedico ? (
                      <Building2 className="h-6 w-6 text-blue-600" />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg">{prestador.nombreCompleto}</CardTitle>
                      <Badge variant={prestador.esCentroMedico ? 'default' : 'secondary'}>
                        {prestador.esCentroMedico ? 'Centro Médico' : 'Profesional'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">CUIT/CUIL: {prestador.cuitCuil}</p>
                    {/* Especialidades */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prestador.especialidades.map((espId) => (
                        <Badge key={espId} variant="outline" className="text-xs">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          {getEspecialidadNombre(espId)}
                        </Badge>
                      ))}
                    </div>
                    {/* Información de contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Lugares de Atención</h4>
                        {prestador.direcciones.slice(0,2).map((direccion, index) => (
                          <div key={index} className="text-gray-600">
                            {direccion.calle} {direccion.numero}, {direccion.localidad} ({direccion.codigoPostal})
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Horarios de Atención</h4>
                        <p className="text-gray-600">
                          {getHorariosResumen(prestador)}
                          {Object.values(prestador.horariosAtencion).flat().length > 3 && (
                            <span className="text-gray-500"> y más...</span>
                          )}
                        </p>
                        <div className="mt-2">
                          <h4 className="font-medium text-gray-900 mb-1">Contacto</h4>
                          {prestador.telefonos.length > 0 && (
                            <p className="text-gray-600">{prestador.telefonos[0].numero}</p>
                          )}
                          {prestador.emails.length > 0 && (
                            <p className="text-gray-600">{prestador.emails[0].direccion}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      {prestadoresFiltrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No se encontraron prestadores</h3>
            <p className="text-gray-600">
              {Object.values(filtros).some(v => v) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza registrando un nuevo prestador'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
