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
    moneda: string;
    precioExpensas: number;
    
    direccion: string;
    barrio?: string;
    ciudad: string;
    latitud?: number;
    longitud?: number;

    ambientes: number;
    dormitorios: number;
    baños: number;
    cocheras: number;
    superficieTotal: number;
    superficieCubierta: number;
    antiguedad: number;

    tipo: TipoPropiedadValue;
    estadoOperacion: string;
    activa: boolean;
    fechaCreacion: string;

    imagenes?: ImagenPropiedad[];
    imagenDestacada?: string;
    esDestacada?: boolean; 
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