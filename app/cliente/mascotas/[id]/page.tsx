import {PetDetail} from '@/components/detail-screen';export default async function Page({params}:{params:Promise<{id:string}>}){return <PetDetail id={(await params).id}/> }
