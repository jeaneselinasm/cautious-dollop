
import type {User} from "../../lib/types"
import { API } from "../api"
import { Routes } from "../route"




export async function getUsers(){
const {data} = await API<User[]>(`${Routes.users}`, {
        // params: { _sort: "id", _order: "asc" },
      })
return data
}

export async function getUser(id:number) : Promise<User>{
    const {data} = await API.get<User>(`${Routes.users}/${id}`)
    return data
}

export async function updateUser(id :number,data : {email:string}) : Promise<User>{
    const res = await API.patch<User>(`${Routes.users}/${id}`, data)
    return res.data
}

export async function deleteUser(id:number) : Promise<User> {
    const {data} = await API.delete<User>(`${Routes.users}/${id}`)
    return data
}

