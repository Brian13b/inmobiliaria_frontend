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
    barrio: string;
    ciudad: string;
    latitud?: number;
    longitud?: number;

    // Medidas y Cantidades
    ambientes: number;
    dormitorios: number;
    baños: number;
    cocheras: number;
    superficieTotal: number;      
    superficieCubierta: number;   
    antiguedad: number;           

    // Ficha Técnica (Enums de C#)
    estado: number;               // 0: Excelente, 1: Muy Bueno, etc.
    orientacion: number;          // 0: Norte, 1: Sur, etc.
    disposicion: number;          // 0: Frente, 1: Contrafrente, etc.

    // Servicios (Checklist)
    tieneAgua: boolean;
    tieneGasNatural: boolean;
    tieneGasEnvasado: boolean;
    tieneLuz: boolean;
    tieneInternet: boolean;
    tieneCloacas: boolean;
    tienePavimento: boolean;
    tieneCalefon: boolean;
    tieneAscensor: boolean;
    tieneTelefono: boolean;
    tieneSeguridad: boolean;

    // Comodidades / Ambientes (Checklist)
    tienePatio: boolean;
    tienePatioSeco: boolean;
    tieneBalcon: boolean;
    tieneCocina: boolean;
    tieneCocinaComedor: boolean;
    tieneLiving: boolean;
    tieneLivingComedor: boolean;
    tieneLavadero: boolean;
    tieneLavaderoSectorizado: boolean;

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