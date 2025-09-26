import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Trash2 } from 'lucide-react';
import { Edit } from 'lucide-react';
import { Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AfiliadoForm } from './AfiliadoForm';
import { gruposFamiliares } from '../../data/mockData.js';

import "./AfiliadosSection.css";
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export function AfiliadosSection() {
  const [filtros, setFiltros] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const gruposFiltrados = gruposFamiliares.filter(grupo => {
    if (!grupo.activo) return false;
    if (filtros.apellido) {
      const hayCoincidencia = grupo.integrantes.some(integrante =>
        integrante.apellido.toLowerCase().includes(filtros.apellido.toLowerCase())
      );
      if (!hayCoincidencia) return false;
    }
    if (filtros.numeroCredencial) {
      const [numeroAfiliado, numeroIntegrante] = filtros.numeroCredencial.split('-');
      if (numeroAfiliado && grupo.numeroAfiliado !== numeroAfiliado.padStart(7, '0')) return false;
      if (numeroIntegrante) {
        const hayIntegrante = grupo.integrantes.some(integrante =>
          integrante.numeroIntegrante === numeroIntegrante.padStart(2, '0')
        );
        if (!hayIntegrante) return false;
      }
    }
    return true;
  });

  const getParentescoLabel = (parentesco) => {
    const labels = {
      'TITULAR': 'Titular',
      'CONYUGE': 'Cónyuge',
      'HIJO': 'Hijo/a',
      'FAMILIAR_A_CARGO': 'Familiar a cargo'
    };
    return labels[parentesco] || parentesco;
  };

  const getPlanLabel = (plan) => plan;

  return (
    <div className="afiliados-section space-y-8">
      {/* Header con búsqueda y nuevo afiliado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Afiliados</h2>
          <p className="text-gray-500">Administra grupos familiares y sus integrantes</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Grupo Familiar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Grupo Familiar</DialogTitle>
            </DialogHeader>
            <AfiliadoForm
              onClose={() => setMostrarFormulario(false)}
              onSave={(grupo) => {
                console.log('Guardando grupo:', grupo);
                setMostrarFormulario(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Filtros */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <Search className="h-5 w-5" />
            <span>Buscar Afiliados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Apellido</label>
              <Input
                placeholder="Buscar por apellido..."
                value={filtros.apellido || ''}
                onChange={(e) => setFiltros({ ...filtros, apellido: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">N° Credencial</label>
              <Input
                placeholder="0000001-01"
                value={filtros.numeroCredencial || ''}
                onChange={(e) => setFiltros({ ...filtros, numeroCredencial: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Fecha de Nacimiento</label>
              <Input
                type="date"
                value={filtros.fechaNacimiento || ''}
                onChange={(e) => setFiltros({ ...filtros, fechaNacimiento: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Listado de grupos familiares */}
      <div className="space-y-6">
        {gruposFiltrados.map((grupo) => (
          <Card key={grupo.id} className="overflow-hidden w-full shadow-md border border-gray-200">
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Grupo Familiar N° {grupo.numeroAfiliado}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Alta: {new Date(grupo.fechaAlta).toLocaleDateString()} - 
                      {grupo.integrantes.length} integrante{grupo.integrantes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[600px] w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="font-semibold text-gray-700">Credencial</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                    <TableHead className="font-semibold text-gray-700">Documento</TableHead>
                    <TableHead className="font-semibold text-gray-700">Parentesco</TableHead>
                    <TableHead className="font-semibold text-gray-700">Plan</TableHead>
                    <TableHead className="font-semibold text-gray-700">Situaciones</TableHead>
                    <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo.integrantes.map((integrante) => (
                    <TableRow key={integrante.id}>
                      <TableCell className="font-mono">
                        {grupo.numeroAfiliado}-{integrante.numeroIntegrante}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {integrante.nombre} {integrante.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(integrante.fechaNacimiento).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {integrante.tipoDocumento} {integrante.numeroDocumento}
                      </TableCell>
                      <TableCell>
                        <Badge variant={integrante.parentesco === 'TITULAR' ? 'default' : 'secondary'}>
                          {getParentescoLabel(integrante.parentesco)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPlanLabel(integrante.planMedico)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {integrante.situacionesTerapeuticas.length > 0 ? (
                            integrante.situacionesTerapeuticas.map((sitId, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {sitId}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Ninguna</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={integrante.activo ? 'success' : 'destructive'}>
                          {integrante.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
      {gruposFiltrados.length === 0 && (
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron grupos familiares</h3>
            <p className="text-gray-500">
              {Object.values(filtros).some(v => v) 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando un nuevo grupo familiar'
              }
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  );
}

export default AfiliadosSection;

