export interface User {
    id: number;
    usuario: string;
    estado: 'ACTIVO' | 'INACTIVO';
    sector: number;
  }