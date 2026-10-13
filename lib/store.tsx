'use client'
import {createContext,useContext,useMemo,useState} from 'react'
import {citas as seedCitas,mascotas as seedMascotas,tratamientos as seedTratamientos,Cita,Mascota,Tratamiento,EstadoCita} from './mock-data'
type Store={mascotas:Mascota[];citas:Cita[];tratamientos:Tratamiento[];addMascota:(m:Mascota)=>void;addCita:(c:Cita)=>void;updateCita:(id:string,patch:Partial<Cita>)=>void;addTratamiento:(t:Tratamiento)=>void}
const Ctx=createContext<Store|null>(null)
export function StoreProvider({children}:{children:React.ReactNode}){const [mascotas,setMascotas]=useState(seedMascotas),[citas,setCitas]=useState(seedCitas),[tratamientos,setTratamientos]=useState(seedTratamientos);const value=useMemo(()=>({mascotas,citas,tratamientos,addMascota:(m:Mascota)=>setMascotas(x=>[...x,m]),addCita:(c:Cita)=>setCitas(x=>[...x,c]),updateCita:(id:string,patch:Partial<Cita>)=>setCitas(x=>x.map(c=>c.id_cita===id?{...c,...patch}:c)),addTratamiento:(t:Tratamiento)=>setTratamientos(x=>[...x,t])}),[mascotas,citas,tratamientos]);return <Ctx.Provider value={value}>{children}</Ctx.Provider>}
export const useStore=()=>{const c=useContext(Ctx);if(!c)throw new Error('StoreProvider required');return c}
