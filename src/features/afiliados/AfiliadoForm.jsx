import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { tiposDocumento, parentescos, planesMedicos, tiposTelefono, tiposEmail } from '../../data/mockData';

export function AfiliadoForm({ grupo, onSave, onClose }) {
  const [integrantes, setIntegrantes] = useState(
    grupo?.integrantes || [crearIntegranteVacio('01', 'TITULAR')]
  );

  function crearIntegranteVacio(numeroIntegrante, parentesco) {
    return {
      numeroIntegrante,
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      parentesco,
      telefonos: [],
      emails: [],
      direcciones: [crearDireccionVacia()],
      situacionesTerapeuticas: [],
      planMedico: '310',
      fechaAlta: new Date().toISOString().split('T')[0],
      activo: true
    };
  }

  function crearDireccionVacia() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      calle: '',
      numero: '',
      localidad: '',
      provincia: '',
      codigoPostal: '',
      pais: 'Argentina'
    };
  }

  function crearTelefonoVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      numero: '',
      tipo: 'MOVIL'
    };
  }

  function crearEmailVacio() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      direccion: '',
      tipo: 'PERSONAL'
    };
  }

  const agregarIntegrante = () => {
    const siguienteNumero = (integrantes.length + 1).toString().padStart(2, '0');
    setIntegrantes([
      ...integrantes,
      crearIntegranteVacio(siguienteNumero, 'HIJO')
    ]);
  };

  const eliminarIntegrante = (index) => {
    if (integrantes.length > 1) {
      const nuevosIntegrantes = integrantes.filter((_, i) => i !== index);
      setIntegrantes(nuevosIntegrantes.map((integrante, i) => ({
        ...integrante,
        numeroIntegrante: (i + 1).toString().padStart(2, '0')
      })));
    }
  };

  const actualizarIntegrante = (index, campo, valor) => {
    const nuevosIntegrantes = [...integrantes];
    nuevosIntegrantes[index] = { ...nuevosIntegrantes[index], [campo]: valor };
    setIntegrantes(nuevosIntegrantes);
  };

  const agregarTelefono = (integranteIndex) => {
    const nuevosIntegrantes = [...integrantes];
    nuevosIntegrantes[integranteIndex] = {
      ...nuevosIntegrantes[integranteIndex],
      telefonos: [...(nuevosIntegrantes[integranteIndex].telefonos || []), crearTelefonoVacio()]
    };
    setIntegrantes(nuevosIntegrantes);
  };

  const eliminarTelefono = (integranteIndex, telefonoIndex) => {
    const nuevosIntegrantes = [...integrantes];
    nuevosIntegrantes[integranteIndex] = {
      ...nuevosIntegrantes[integranteIndex],
      telefonos: nuevosIntegrantes[integranteIndex].telefonos?.filter((_, i) => i !== telefonoIndex) || []
    };
    setIntegrantes(nuevosIntegrantes);
  };

  const actualizarTelefono = (integranteIndex, telefonoIndex, campo, valor) => {
    const nuevosIntegrantes = [...integrantes];
    const telefonos = [...(nuevosIntegrantes[integranteIndex].telefonos || [])];
    telefonos[telefonoIndex] = { ...telefonos[telefonoIndex], [campo]: valor };
    nuevosIntegrantes[integranteIndex] = { ...nuevosIntegrantes[integranteIndex], telefonos };
    setIntegrantes(nuevosIntegrantes);
  };

  const agregarEmail = (integranteIndex) => {
    const nuevosIntegrantes = [...integrantes];
    nuevosIntegrantes[integranteIndex] = {
      ...nuevosIntegrantes[integranteIndex],
      emails: [...(nuevosIntegrantes[integranteIndex].emails || []), crearEmailVacio()]
    };
    setIntegrantes(nuevosIntegrantes);
  };

  const eliminarEmail = (integranteIndex, emailIndex) => {
    const nuevosIntegrantes = [...integrantes];
    nuevosIntegrantes[integranteIndex] = {
      ...nuevosIntegrantes[integranteIndex],
      emails: nuevosIntegrantes[integranteIndex].emails?.filter((_, i) => i !== emailIndex) || []
    };
    setIntegrantes(nuevosIntegrantes);
  };

  const actualizarEmail = (integranteIndex, emailIndex, campo, valor) => {
    const nuevosIntegrantes = [...integrantes];
    const emails = [...(nuevosIntegrantes[integranteIndex].emails || [])];
    emails[emailIndex] = { ...emails[emailIndex], [campo]: valor };
    nuevosIntegrantes[integranteIndex] = { ...nuevosIntegrantes[integranteIndex], emails };
    setIntegrantes(nuevosIntegrantes);
  };

  const actualizarDireccion = (integranteIndex, direccionIndex, campo, valor) => {
    const nuevosIntegrantes = [...integrantes];
    const direcciones = [...(nuevosIntegrantes[integranteIndex].direcciones || [])];
    direcciones[direccionIndex] = { ...direcciones[direccionIndex], [campo]: valor };
    nuevosIntegrantes[integranteIndex] = { ...nuevosIntegrantes[integranteIndex], direcciones };
    setIntegrantes(nuevosIntegrantes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (integrantes.length === 0) {
      alert('Debe tener al menos un integrante');
      return;
    }
    const grupoData = {
      id: grupo?.id || Math.random().toString(36).substr(2, 9),
      numeroAfiliado: grupo?.numeroAfiliado || '0000001',
      fechaAlta: grupo?.fechaAlta || new Date().toISOString().split('T')[0],
      integrantes: integrantes,
      activo: true
    };
    onSave(grupoData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg">
            {grupo ? 'Editar' : 'Crear'} Grupo Familiar
          </h3>
          <p className="text-sm text-gray-600">
            Complete la información de todos los integrantes del grupo familiar
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={agregarIntegrante}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Integrante</span>
        </Button>
      </div>
      <div className="space-y-6">
        {integrantes.map((integrante, integranteIndex) => (
          <Card key={integranteIndex}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  Integrante {integrante.numeroIntegrante} - {integrante.parentesco === 'TITULAR' ? 'Titular' : integrante.parentesco}
                </CardTitle>
                {integrantes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => eliminarIntegrante(integranteIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Datos personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`tipo-doc-${integranteIndex}`}>Tipo Documento</Label>
                  <Select
                    value={integrante.tipoDocumento}
                    onValueChange={(value) => actualizarIntegrante(integranteIndex, 'tipoDocumento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumento.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`num-doc-${integranteIndex}`}>N° Documento</Label>
                  <Input
                    id={`num-doc-${integranteIndex}`}
                    value={integrante.numeroDocumento}
                    onChange={(e) => actualizarIntegrante(integranteIndex, 'numeroDocumento', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`nombre-${integranteIndex}`}>Nombre</Label>
                  <Input
                    id={`nombre-${integranteIndex}`}
                    value={integrante.nombre}
                    onChange={(e) => actualizarIntegrante(integranteIndex, 'nombre', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`apellido-${integranteIndex}`}>Apellido</Label>
                  <Input
                    id={`apellido-${integranteIndex}`}
                    value={integrante.apellido}
                    onChange={(e) => actualizarIntegrante(integranteIndex, 'apellido', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`fecha-nac-${integranteIndex}`}>Fecha Nacimiento</Label>
                  <Input
                    id={`fecha-nac-${integranteIndex}`}
                    type="date"
                    value={integrante.fechaNacimiento}
                    onChange={(e) => actualizarIntegrante(integranteIndex, 'fechaNacimiento', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Parentesco</Label>
                  <Select
                    value={integrante.parentesco}
                    onValueChange={(value) => actualizarIntegrante(integranteIndex, 'parentesco', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {parentescos.map(parentesco => (
                        <SelectItem key={parentesco} value={parentesco}>
                          {parentesco === 'TITULAR' ? 'Titular' : 
                           parentesco === 'CONYUGE' ? 'Cónyuge' :
                           parentesco === 'HIJO' ? 'Hijo/a' : 'Familiar a cargo'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Plan Médico</Label>
                  <Select
                    value={integrante.planMedico}
                    onValueChange={(value) => actualizarIntegrante(integranteIndex, 'planMedico', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {planesMedicos.map(plan => (
                        <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`fecha-alta-${integranteIndex}`}>Fecha Alta</Label>
                  <Input
                    id={`fecha-alta-${integranteIndex}`}
                    type="date"
                    value={integrante.fechaAlta}
                    onChange={(e) => actualizarIntegrante(integranteIndex, 'fechaAlta', e.target.value)}
                    required
                  />
                </div>
              </div>
              <Separator />
              {/* Teléfonos */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Teléfonos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => agregarTelefono(integranteIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {integrante.telefonos?.map((telefono, telefonoIndex) => (
                    <div key={telefonoIndex} className="flex gap-2">
                      <Input
                        placeholder="Número"
                        value={telefono.numero}
                        onChange={(e) => actualizarTelefono(integranteIndex, telefonoIndex, 'numero', e.target.value)}
                        className="flex-1"
                      />
                      <Select
                        value={telefono.tipo}
                        onValueChange={(value) => actualizarTelefono(integranteIndex, telefonoIndex, 'tipo', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposTelefono.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarTelefono(integranteIndex, telefonoIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Emails */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Emails</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => agregarEmail(integranteIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                <div className="space-y-2">
                  {integrante.emails?.map((email, emailIndex) => (
                    <div key={emailIndex} className="flex gap-2">
                      <Input
                        placeholder="Dirección de email"
                        type="email"
                        value={email.direccion}
                        onChange={(e) => actualizarEmail(integranteIndex, emailIndex, 'direccion', e.target.value)}
                        className="flex-1"
                      />
                      <Select
                        value={email.tipo}
                        onValueChange={(value) => actualizarEmail(integranteIndex, emailIndex, 'tipo', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposEmail.map(tipo => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarEmail(integranteIndex, emailIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Dirección */}
              <div>
                <Label className="block mb-3">Dirección</Label>
                {integrante.direcciones?.map((direccion, direccionIndex) => (
                  <div key={direccionIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Calle"
                        value={direccion.calle}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'calle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Número"
                        value={direccion.numero}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'numero', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Localidad"
                        value={direccion.localidad}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'localidad', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Provincia"
                        value={direccion.provincia}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'provincia', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Código Postal"
                        value={direccion.codigoPostal}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'codigoPostal', e.target.value)}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="País"
                        value={direccion.pais}
                        onChange={(e) => actualizarDireccion(integranteIndex, direccionIndex, 'pais', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {grupo ? 'Actualizar' : 'Crear'} Grupo Familiar
        </Button>
      </div>
    </form>
  );
}
