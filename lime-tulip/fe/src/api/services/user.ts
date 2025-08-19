
import type {User} from "../../lib/types"
import { API } from "../api"
import { Routes } from "../route"


export async function getUsers() : Promise<User[]> {
    const {data} = await API.get<User[]>(Routes.users)
    return data
}

export async function getUser(id:number) : Promise<User>{
    const {data} = await API.get<User>(`${Routes.users}/${id}`)
    return data
}

export async function updateUser(id :number,email:string) : Promise<User>{
    const {data} = await API.patch<User>(`${Routes.users}/${id}`, email)
    return data
}

export async function deleteUser(id:number) : Promise<User> {
    const {data} = await API.delete<User>(`${Routes.users}/${id}`)
    return data
}