import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../lib/types";
import { deleteUser, getUser, getUsers, updateUser } from "../api/services/user";


export function useUsers() {
  return useQuery<User[], Error>({
    queryKey : ['users', 'all'],
    queryFn : () => getUsers(),
    select : (data) => [...data].sort((a,b)=> Number(a.id) - Number(b.id)),
    staleTime : 30_000
  });
}

export function useUser(id?:number){
    return  useQuery<User, Error>({
        queryKey : ['user', id],
        queryFn : () => getUser(id as number),
        staleTime : 1000*30
    })
}

export function useUpdateUser(id:number,){
    const qc = useQueryClient()   
    return useMutation({
        mutationFn : (data : {
        email : string
        }) => updateUser(id, data),
        onSuccess : () => {
            qc.invalidateQueries({queryKey : ['users']})
        }
    })
}

export function useDeleteUser(id : number) {
    const qc= useQueryClient()
    return useMutation({
        mutationFn : () => deleteUser(id),
        onSuccess :  () =>{
            qc.invalidateQueries({queryKey : ['users']})
        }
    })
}