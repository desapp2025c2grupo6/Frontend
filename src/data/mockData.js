// Datos de ejemplo para desarrollo
export const gruposFamiliares = [
  {
    id: 1,
    numeroAfiliado: '0000001',
    fechaAlta: '2022-01-01',
    activo: true,
    integrantes: [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-05-10',
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678',
        parentesco: 'TITULAR',
        planMedico: 'Plan A',
        situacionesTerapeuticas: [],
        activo: true,
        numeroIntegrante: '01'
      },
      {
        id: 2,
        nombre: 'Jose',
        apellido: 'Pérez',
        fechaNacimiento: '2000-05-10',
        tipoDocumento: 'DNI',
        numeroDocumento: '123456558',
        parentesco: 'HIJO',
        planMedico: 'Plan A',
        situacionesTerapeuticas: [],
        activo: true,
        numeroIntegrante: '01'
      }
    ]
  },
  {
    id: 2,
    numeroAfiliado: '0000002',
    fechaAlta: '2022-01-01',
    activo: true,
    integrantes: [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-05-10',
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678',
        parentesco: 'TITULAR',
        planMedico: 'Plan A',
        situacionesTerapeuticas: [],
        activo: true,
        numeroIntegrante: '01'
      }
    ]
  }

];

export const tiposDocumento = ['DNI', 'Pasaporte'];
export const parentescos = ['TITULAR', 'CONYUGE', 'HIJO', 'FAMILIAR_A_CARGO'];
export const planesMedicos = ['Plan A', 'Plan B'];
export const tiposTelefono = ['Celular', 'Fijo'];
export const tiposEmail = ['Personal', 'Laboral'];
export const prestadores = ['Prestador 1', 'Prestador 2'];
export const especialidades = ['Cardiología', 'Pediatría'];
export const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const agendasTurnos = [];
