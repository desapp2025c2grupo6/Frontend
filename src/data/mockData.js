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
        numeroDocumento: '12345657',
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

export const prestadores = [
  {
    id: '1',
    cuitCuil: '20123456789',
    nombreCompleto: 'Dra. Tita Merello',
    especialidades: ['1', '7'], // Cardiología, Medicina General
    esCentroMedico: false,
    telefonos: [
      { id: '4', numero: '1145678901', tipo: 'TRABAJO', principal: true, activo: true, fechaCreacion: '2024-01-10T00:00:00Z' }
    ],
    emails: [
      { id: '4', direccion: 'tita.merello@clinica.com', tipo: 'TRABAJO', principal: true, verificado: true, activo: true, fechaCreacion: '2024-01-10T00:00:00Z' }
    ],
    direcciones: [
      {
        id: '3',
        calle: 'Av. Vergara',
        numero: '1908',
        localidad: 'Hurlingham',
        provincia: 'Buenos Aires',
        codigoPostal: '1686',
        pais: 'Argentina',
        principal: true,
        activa: true,
        fechaCreacion: '2024-01-10T00:00:00Z'
      }
    ],
    horariosAtencion: {
      '3': [
        { id: '1', dia: 'LUNES', horaInicio: '09:00', horaFin: '12:00' },
        { id: '2', dia: 'MIERCOLES', horaInicio: '14:00', horaFin: '18:00' }
      ]
    },
    fechaAlta: '2024-01-10',
    estado: 'ACTIVO',
    fechaCreacion: '2024-01-10T00:00:00Z',
    creadoPor: 'ADMIN'
  },
  {
    id: '2',
    cuitCuil: '20987654321',
    nombreCompleto: 'Dr. Carlos López',
    especialidades: ['2', '9'], // Neurología, Psiquiatría
    esCentroMedico: false,
    telefonos: [
      { id: '5', numero: '1198765432', tipo: 'TRABAJO' }
    ],
    emails: [
      { id: '5', direccion: 'carlos.lopez@neurologico.com', tipo: 'TRABAJO' }
    ],
    direcciones: [
      {
        id: '4',
        calle: 'Av. Santa Fe',
        numero: '2345',
        localidad: 'CABA',
        provincia: 'Buenos Aires',
        codigoPostal: '1123',
        pais: 'Argentina'
      }
    ],
    horariosAtencion: {
      '4': [
        { id: '3', dia: 'MARTES', horaInicio: '08:00', horaFin: '12:00' },
        { id: '4', dia: 'JUEVES', horaInicio: '08:00', horaFin: '12:00' },
        { id: '5', dia: 'VIERNES', horaInicio: '14:00', horaFin: '17:00' }
      ]
    },
    fechaAlta: '2024-01-15',
    estado: 'ACTIVO',
    fechaCreacion: '2024-01-15T00:00:00Z',
    creadoPor: 'ADMIN'
  }
]

export const tiposDocumento = ['DNI', 'Pasaporte'];
export const parentescos = ['TITULAR', 'CONYUGE', 'HIJO', 'FAMILIAR_A_CARGO'];
export const planesMedicos = ['Plan A', 'Plan B'];
export const tiposTelefono = ['Celular', 'Fijo'];
export const tiposEmail = ['Personal', 'Laboral'];
export const especialidades = ['Cardiología', 'Pediatría'];
export const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
export const agendasTurnos = [];
