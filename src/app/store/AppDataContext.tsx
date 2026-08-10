import { createContext, useContext, useState } from "react";

export interface InmuebleRecord {
  id: string;
  inmobiliaria: string;
  metros: string;
  direccion: string;
  tipo: string;
  zona: string;
  ciudad?: string;
  estado: string;
}

export interface PersonaRecord {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
}

export interface ContratoRecord {
  contrato: string;
  inmobiliaria: string;
  direccion: string;
  inmueble: string;
  zona: string;
  inicio: string;
  fin: string;
  estado: "elaboracion" | "precontrato" | "rechazado" | "administracion" | "terminado";
  tipo: "comercial" | "vivienda";
  propietario?: string;
  inquilino?: string;
}

const INMUEBLES_SEED: InmuebleRecord[] = [
  { id: "6454", inmobiliaria: "Alquilando sas", metros: "-", direccion: "-", tipo: "-", zona: "-", estado: "Borrador" },
  { id: "6444", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Cra 3 #19- 29 santa marta", tipo: "-", zona: "Zona centro…", estado: "Borrador" },
  { id: "6363", inmobiliaria: "Alquilando sas", metros: "-", direccion: "Calle 80 # 23 - 20", tipo: "-", zona: "Zona centro", estado: "Borrador" },
  { id: "6356", inmobiliaria: "Alquilando sas", metros: "55", direccion: "Calle 147 # 8 - 55", tipo: "Apartamento", zona: "Zona norte", estado: "Borrador" },
];

const PROPIETARIOS_SEED: PersonaRecord[] = [
  { id: "p-1", tipoDocumento: "Cédula de ciudadanía", numeroDocumento: "79445210", nombre: "Jaime Alonso Agudelo", correo: "jaime.agudelo@correo.com", telefono: "3105557788", direccion: "Cl 63a # 50-55, Itagüí", ciudad: "Medellín" },
  { id: "p-2", tipoDocumento: "Cédula de ciudadanía", numeroDocumento: "52301874", nombre: "Marta Lucía Restrepo", correo: "marta.restrepo@correo.com", telefono: "3112223344", direccion: "Cr 15 # 88-40, Bogotá", ciudad: "Bogotá" },
];

const INQUILINOS_SEED: PersonaRecord[] = [
  { id: "i-1", tipoDocumento: "Cédula de ciudadanía", numeroDocumento: "1032423876", nombre: "Andrés Felipe Melo", correo: "andres.melo@gmail.com", telefono: "3186654421", direccion: "Cr 13 # 44-39, Bogotá", ciudad: "Bogotá" },
  { id: "i-2", tipoDocumento: "Cédula de ciudadanía", numeroDocumento: "43678219", nombre: "Camila Rincón", correo: "camila.rincon@alquilando.com", telefono: "3128516692", direccion: "Cl 90 # 15-20, Bogotá", ciudad: "Bogotá" },
];

const CONTRATOS_SEED: ContratoRecord[] = [
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "vivienda" },
  { contrato: "-", inmobiliaria: "Alquilando SAS", direccion: "-", inmueble: "-", zona: "-", inicio: "-", fin: "-", estado: "elaboracion", tipo: "comercial" },
];

let idCounter = 7000;
const nextId = () => String(idCounter++);

interface AppDataContextValue {
  inmuebles: InmuebleRecord[];
  addInmueble: (data: Omit<InmuebleRecord, "id">) => InmuebleRecord;
  updateInmueble: (id: string, data: Partial<Omit<InmuebleRecord, "id">>) => void;
  deleteInmueble: (id: string) => void;
  findInmueble: (query: string) => InmuebleRecord | undefined;

  propietarios: PersonaRecord[];
  addPropietario: (data: Omit<PersonaRecord, "id">) => PersonaRecord;

  inquilinos: PersonaRecord[];
  addInquilino: (data: Omit<PersonaRecord, "id">) => PersonaRecord;

  contratos: ContratoRecord[];
  addContrato: (data: ContratoRecord) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [inmuebles, setInmuebles] = useState<InmuebleRecord[]>(INMUEBLES_SEED);
  const [propietarios, setPropietarios] = useState<PersonaRecord[]>(PROPIETARIOS_SEED);
  const [inquilinos, setInquilinos] = useState<PersonaRecord[]>(INQUILINOS_SEED);
  const [contratos, setContratos] = useState<ContratoRecord[]>(CONTRATOS_SEED);

  const addInmueble = (data: Omit<InmuebleRecord, "id">) => {
    const nuevo: InmuebleRecord = { ...data, id: nextId() };
    setInmuebles((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const updateInmueble = (id: string, data: Partial<Omit<InmuebleRecord, "id">>) => {
    setInmuebles((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
  };

  const deleteInmueble = (id: string) => {
    setInmuebles((prev) => prev.filter((i) => i.id !== id));
  };

  const findInmueble = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return inmuebles.find(
      (i) => i.id.toLowerCase() === q || i.direccion.toLowerCase().includes(q)
    );
  };

  const addPropietario = (data: Omit<PersonaRecord, "id">) => {
    const nuevo: PersonaRecord = { ...data, id: nextId() };
    setPropietarios((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const addInquilino = (data: Omit<PersonaRecord, "id">) => {
    const nuevo: PersonaRecord = { ...data, id: nextId() };
    setInquilinos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const addContrato = (data: ContratoRecord) => setContratos((prev) => [data, ...prev]);

  return (
    <AppDataContext.Provider
      value={{
        inmuebles, addInmueble, updateInmueble, deleteInmueble, findInmueble,
        propietarios, addPropietario,
        inquilinos, addInquilino,
        contratos, addContrato,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData debe usarse dentro de <AppDataProvider>");
  return ctx;
}
