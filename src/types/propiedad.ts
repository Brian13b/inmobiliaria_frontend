export const TipoPropiedad = {
    Casa: 0,
    Departamento: 1,
    Terreno: 2,
    Local: 3,
    Oficina: 4
} as const;

export type TipoPropiedadValue = typeof TipoPropiedad[keyof typeof TipoPropiedad];

export interface ImagenPropiedad {
    id: number;
    url: string;
    propiedadId: number;
}

export interface Propiedad {
    id: number;
    titulo: string;
    descripcion: string;
    precio: number;
    moneda: string; // "USD" | "ARS"
    precioExpensas: number;
    
    // Ubicación
    direccion: string;
    barrio?: string;
    ciudad: string;
    latitud?: number;
    longitud?: number;

    // Medidas y Ambientes
    ambientes: number;
    dormitorios: number;
    baños: number;
    cocheras: number;
    superficieTotal: number;      // m2 del terreno/lote
    superficieCubierta: number;   // m2 construidos
    antiguedad: number;           // 0 para a estrenar

    // Servicios (Checklist)
    tieneAgua: boolean;
    tieneGas: boolean;
    tieneLuz: boolean;
    tieneInternet: boolean;
    tieneCloacas: boolean;
    tienePavimento: boolean;

    // Estado y Meta
    tipo: TipoPropiedadValue;
    estadoOperacion: string;      // "Venta" | "Alquiler"
    activa: boolean;
    esDestacada: boolean; 
    fechaCreacion: string;

    // Multimedia
    imagenes?: ImagenPropiedad[];
    imagenDestacada?: string;
}

// Helper para mostrar el texto del Enum de forma amigable
export const getTipoLabel = (tipo: number): string => {
    switch (tipo) {
        case TipoPropiedad.Casa: return "Casa";
        case TipoPropiedad.Departamento: return "Departamento";
        case TipoPropiedad.Terreno: return "Terreno";
        case TipoPropiedad.Local: return "Local";
        case TipoPropiedad.Oficina: return "Oficina";
        default: return "Propiedad";
    }
};