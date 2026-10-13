import {PlanDetail} from '@/components/detail-screen';export default async function Page({params}:{params:Promise<{id:string}>}){return <PlanDetail id={(await params).id}/> }
