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
      <div className="afiliados-header-bar">
        <div className="afiliados-header-titles">
          <h2 className="afiliados-title">Gestión de Afiliados</h2>
          <p className="afiliados-subtitle">Administre los grupos familiares y sus integrantes</p>
        </div>
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogTrigger asChild>
            <Button className="afiliados-nuevo-btn" variant="default">
              <Plus style={{ width: 18, height: 18, marginRight: 8 }} />
              Nuevo Grupo Familiar
            </Button>
          </DialogTrigger>
          <DialogContent className="afiliados-dialog-content">
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
      <div className="afiliados-search-card">
        <div className="afiliados-search-header">
          <Search className="afiliados-search-icon" />
          <span className="afiliados-search-title">Buscar Afiliados</span>
        </div>
        <form className="afiliados-search-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="afiliados-search-field">
            <label className="afiliados-search-label">Apellido</label>
            <Input
              className="afiliados-search-input"
              placeholder="Buscar por apellido..."
              value={filtros.apellido || ''}
              onChange={(e) => setFiltros({ ...filtros, apellido: e.target.value })}
            />
          </div>
          <div className="afiliados-search-field">
            <label className="afiliados-search-label">N° Credencial</label>
            <Input
              className="afiliados-search-input"
              placeholder="0000001-01"
              value={filtros.numeroCredencial || ''}
              onChange={(e) => setFiltros({ ...filtros, numeroCredencial: e.target.value })}
            />
          </div>
          <div className="afiliados-search-field">
            <label className="afiliados-search-label">Fecha de Nacimiento</label>
            <Input
              className="afiliados-search-input afiliados-search-date"
              type="text"
              inputMode="numeric"
              pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
              placeholder="dd/mm/aaaa"
              maxLength={10}
              value={filtros.fechaNacimiento || ''}
              onChange={e => {
                // Solo permitir formato dd/mm/aaaa
                let v = e.target.value.replace(/[^0-9/]/g, '');
                if (v.length === 2 || v.length === 5) {
                  if (e.nativeEvent.inputType !== 'deleteContentBackward') v += '/';
                }
                setFiltros({ ...filtros, fechaNacimiento: v.slice(0, 10) });
              }}
            />
          </div>
        </form>
      </div>
      {/* Listado de grupos familiares */}
      <div className="afiliados-listado-grupos">
        {gruposFiltrados.map((grupo) => (
          <Card key={grupo.id} className="grupo-card">
            <CardHeader className="grupo-header-bar">
              <div className="grupo-header-row">
                <div className="grupo-header-row-main">
                  <Users style={{ marginRight: 8, color: '#18181b', width: '1.5em', height: '1.5em' }} />
                  <div>
                    <div className="grupo-header-title">
                      Grupo Familiar N° {grupo.numeroAfiliado}
                    </div>
                    <div className="grupo-header-subtitle">
                      Alta: {new Date(grupo.fechaAlta).toLocaleDateString()} - {grupo.integrantes.length} integrante{grupo.integrantes.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="grupo-header-actions">
                  <Button className="grupo-action-btn grupo-action-edit" variant="outline">
                    <Edit style={{ width: 18, height: 18 }} />
                  </Button>
                  <Button className="grupo-action-btn grupo-action-delete" variant="outline">
                    <Trash2 style={{ width: 18, height: 18 }} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grupo-card-content">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="grupo-table-th">Credencial</TableHead>
                    <TableHead className="grupo-table-th">Nombre</TableHead>
                    <TableHead className="grupo-table-th">Documento</TableHead>
                    <TableHead className="grupo-table-th">Parentesco</TableHead>
                    <TableHead className="grupo-table-th">Plan</TableHead>
                    <TableHead className="grupo-table-th">Situaciones</TableHead>
                    <TableHead className="grupo-table-th">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo.integrantes.map((integrante) => (
                    <TableRow key={integrante.id}>
                      <TableCell className="grupo-table-td-mono">
                        {grupo.numeroAfiliado}-{integrante.numeroIntegrante}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="grupo-table-nombre">
                            {integrante.nombre} {integrante.apellido}
                          </div>
                          <div className="grupo-table-fecha">
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
                        <div className="grupo-table-situaciones">
                          {integrante.situacionesTerapeuticas.length > 0 ? (
                            integrante.situacionesTerapeuticas.map((sitId, index) => (
                              <Badge key={index} variant="outline" className="grupo-table-situacion-badge">
                                {sitId}
                              </Badge>
                            ))
                          ) : (
                            <span className="grupo-table-situacion-vacia">Ninguna</span>
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
        <div className="afiliados-vacio-card">
          <Users className="afiliados-vacio-icon" />
          <h3 className="afiliados-vacio-title">No se encontraron grupos familiares</h3>
          <p className="afiliados-vacio-desc">
            {Object.values(filtros).some(v => v) 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza creando un nuevo grupo familiar'}
          </p>
        </div>
      )}

    </div>
  );
}

export default AfiliadosSection;