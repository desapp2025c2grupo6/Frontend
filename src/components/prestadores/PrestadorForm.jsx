import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { 
  especialidades,
  tiposTelefono, 
  tiposEmail,
  diasSemana
} from '../../data/mockData';

export function PrestadorForm({ prestador, onSave, onClose }) {
  const [formData, setFormData] = useState(
    prestador || {
      cuitCuil: '',
      nombreCompleto: '',
      matriculaProfesional: '',
      especialidades: [],
      esCentroMedico: false,
      telefonos: [],
      emails: [],
      direcciones: [crearDireccionVacia()],
      horariosAtencion: {},
      fechaAlta: new Date().toISOString().split('T')[0],
      estado: 'ACTIVO'
    }
  );

  function crearDireccionVacia() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      calle: '',
      numero: '',
      localidad: '',
      provincia: '',
      codigoPostal: '',
      pais: 'Argentina',
      principal: true,
      activa: true,
      fechaCreacion: new Date().toISOString()
    };
  }

  function crearTelefonoVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      numero: '',
      tipo: 'MOVIL',
      principal: false,
      activo: true,
      fechaCreacion: new Date().toISOString()
    };
  }

  function crearEmailVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      direccion: '',
      tipo: 'PERSONAL',
      principal: false,
      verificado: false,
      activo: true,
      fechaCreacion: new Date().toISOString()
    };
  }

  function crearHorarioVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      dia: 'LUNES',
      horaInicio: '09:00',
      horaFin: '17:00',
      activo: true,
      fechaCreacion: new Date().toISOString()
    };
  }

  const actualizarCampo = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const agregarTelefono = () => {
    setFormData({
      ...formData,
      telefonos: [...formData.telefonos, crearTelefonoVacio()]
    });
  };

  const actualizarTelefono = (index, campo, valor) => {
    const nuevosTelefonos = [...formData.telefonos];
    nuevosTelefonos[index][campo] = valor;
    setFormData({ ...formData, telefonos: nuevosTelefonos });
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = formData.telefonos.filter((_, i) => i !== index);
    setFormData({ ...formData, telefonos: nuevosTelefonos });
  };

  const agregarEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, crearEmailVacio()]
    });
  };

  const actualizarEmail = (index, campo, valor) => {
    const nuevosEmails = [...formData.emails];
    nuevosEmails[index][campo] = valor;
    setFormData({ ...formData, emails: nuevosEmails });
  };

  const eliminarEmail = (index) => {
    const nuevosEmails = formData.emails.filter((_, i) => i !== index);
    setFormData({ ...formData, emails: nuevosEmails });
  };

  const actualizarDireccion = (index, campo, valor) => {
    const nuevasDirecciones = [...formData.direcciones];
    nuevasDirecciones[index][campo] = valor;
    setFormData({ ...formData, direcciones: nuevasDirecciones });
  };

  const agregarHorarioAtencion = (direccionId) => {
    const nuevosHorarios = { ...formData.horariosAtencion };
    if (!nuevosHorarios[direccionId]) {
      nuevosHorarios[direccionId] = [];
    }
    nuevosHorarios[direccionId].push(crearHorarioVacio());
    setFormData({ ...formData, horariosAtencion: nuevosHorarios });
  };

  const actualizarHorarioAtencion = (direccionId, index, campo, valor) => {
    const nuevosHorarios = { ...formData.horariosAtencion };
    if (nuevosHorarios[direccionId]) {
      nuevosHorarios[direccionId][index][campo] = valor;
      setFormData({ ...formData, horariosAtencion: nuevosHorarios });
    }
  }; 

  const eliminarHorarioAtencion = (direccionId, index) => {
    const nuevosHorarios = { ...formData.horariosAtencion };
    if (nuevosHorarios[direccionId]) {
      nuevosHorarios[direccionId].splice(index, 1);
      setFormData({ ...formData, horariosAtencion: nuevosHorarios });
    }
  };

  const toggleEspecialidad = (especialidadId) => {
    const nuevasEspecialidades = formData.especialidades.includes(especialidadId)
      ? formData.especialidades.filter(id => id !== especialidadId)
      : [...formData.especialidades, especialidadId];
    
    actualizarCampo('especialidades', nuevasEspecialidades);
  };

  const handleSave = () => {
    const prestadorCompleto = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      fechaCreacion: new Date().toISOString(),
      creadoPor: 'user'
    };

    onSave(prestadorCompleto);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-foreground">
            {prestador ? 'Editar Prestador' : 'Nuevo Prestador'}
          </h2>
          <p className="text-muted-foreground">
            Complete la información del prestador médico
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>CUIT/CUIL *</Label>
              <Input
                value={formData.cuitCuil}
                onChange={(e) => actualizarCampo('cuitCuil', e.target.value)}
                placeholder="20-12345678-9"
              />
            </div>
            <div>
              <Label>Nombre Completo *</Label>
              <Input
                value={formData.nombreCompleto}
                onChange={(e) => actualizarCampo('nombreCompleto', e.target.value)}
                placeholder="Dr. Juan Pérez"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Matrícula Profesional</Label>
              <Input
                value={formData.matriculaProfesional || ''}
                onChange={(e) => actualizarCampo('matriculaProfesional', e.target.value)}
                placeholder="MP 12345"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="esCentroMedico"
                checked={formData.esCentroMedico}
                onCheckedChange={(checked) => actualizarCampo('esCentroMedico', checked)}
              />
              <Label htmlFor="esCentroMedico">Es Centro Médico</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {especialidades.map((especialidad) => (
              <div key={especialidad.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`esp-${especialidad.id}`}
                  checked={formData.especialidades.includes(especialidad.id)}
                  onCheckedChange={() => toggleEspecialidad(especialidad.id)}
                />
                <Label htmlFor={`esp-${especialidad.id}`} className="text-sm">
                  {especialidad.nombre}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teléfonos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Teléfonos</CardTitle>
            <Button variant="outline" size="sm" onClick={agregarTelefono}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Teléfono
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.telefonos.map((telefono, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Número</Label>
                <Input
                  value={telefono.numero}
                  onChange={(e) => actualizarTelefono(index, 'numero', e.target.value)}
                  placeholder="011-4444-5555"
                />
              </div>
              <div className="flex-1">
                <Label>Tipo</Label>
                <Select 
                  value={telefono.tipo} 
                  onValueChange={(value) => actualizarTelefono(index, 'tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposTelefono.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={telefono.principal}
                  onCheckedChange={(checked) => actualizarTelefono(index, 'principal', checked)}
                />
                <Label className="text-sm">Principal</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => eliminarTelefono(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Emails */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Emails</CardTitle>
            <Button variant="outline" size="sm" onClick={agregarEmail}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Email
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.emails.map((email, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Dirección de Email</Label>
                <Input
                  type="email"
                  value={email.direccion}
                  onChange={(e) => actualizarEmail(index, 'direccion', e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </div>
              <div className="flex-1">
                <Label>Tipo</Label>
                <Select 
                  value={email.tipo} 
                  onValueChange={(value) => actualizarEmail(index, 'tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEmail.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={email.principal}
                  onCheckedChange={(checked) => actualizarEmail(index, 'principal', checked)}
                />
                <Label className="text-sm">Principal</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => eliminarEmail(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Direcciones y Horarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lugares de Atención</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.direcciones.map((direccion, direccionIndex) => (
            <div key={direccionIndex} className="space-y-4 p-4 border border-border rounded-lg">
              <h4 className="text-foreground">Dirección {direccionIndex + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Calle</Label>
                  <Input
                    value={direccion.calle}
                    onChange={(e) => actualizarDireccion(direccionIndex, 'calle', e.target.value)}
                    placeholder="Av. Corrientes"
                  />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input
                    value={direccion.numero}
                    onChange={(e) => actualizarDireccion(direccionIndex, 'numero', e.target.value)}
                    placeholder="1234"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Localidad</Label>
                  <Input
                    value={direccion.localidad}
                    onChange={(e) => actualizarDireccion(direccionIndex, 'localidad', e.target.value)}
                    placeholder="CABA"
                  />
                </div>
                <div>
                  <Label>Provincia</Label>
                  <Input
                    value={direccion.provincia}
                    onChange={(e) => actualizarDireccion(direccionIndex, 'provincia', e.target.value)}
                    placeholder="Buenos Aires"
                  />
                </div>
                <div>
                  <Label>Código Postal</Label>
                  <Input
                    value={direccion.codigoPostal}
                    onChange={(e) => actualizarDireccion(direccionIndex, 'codigoPostal', e.target.value)}
                    placeholder="1043"
                  />
                </div>
              </div>

              <Separator />

              {/* Horarios de atención para esta dirección */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-foreground">Horarios de Atención</h5>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => agregarHorarioAtencion(direccion.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Horario
                  </Button>
                </div>

                {formData.horariosAtencion[direccion.id]?.map((horario, horarioIndex) => (
                  <div key={horarioIndex} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Día</Label>
                      <Select 
                        value={horario.dia} 
                        onValueChange={(value) => 
                          actualizarHorarioAtencion(direccion.id, horarioIndex, 'dia', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {diasSemana.map(dia => (
                            <SelectItem key={dia.value} value={dia.value}>
                              {dia.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label>Hora Inicio</Label>
                      <Input
                        type="time"
                        value={horario.horaInicio}
                        onChange={(e) => 
                          actualizarHorarioAtencion(direccion.id, horarioIndex, 'horaInicio', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Hora Fin</Label>
                      <Input
                        type="time"
                        value={horario.horaFin}
                        onChange={(e) => 
                          actualizarHorarioAtencion(direccion.id, horarioIndex, 'horaFin', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={horario.activo}
                        onCheckedChange={(checked) => 
                          actualizarHorarioAtencion(direccion.id, horarioIndex, 'activo', checked)
                        }
                      />
                      <Label className="text-sm">Activo</Label>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => eliminarHorarioAtencion(direccion.id, horarioIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Guardar Prestador
        </Button>
      </div>
    </div>
  );
}
//export { PrestadorForm };
