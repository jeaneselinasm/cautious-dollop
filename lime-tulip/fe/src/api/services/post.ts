import {  useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../lib/types";
import { API } from "../api";
import { Routes } from "../route";

export async function getPosts() : Promise<Post[]>{
    const {data} = await API.get<Post[]>(Routes.posts)
    return data
}

export async function getPost(id:number) : Promise<Post>{
    const {data} = await API.get<Post>(`${Routes.posts}/${id}`)
    return data
}

export async function createPost(data : {title : string, authorId:number }){
    const res = await API.post<Post>(`${Routes.posts}`, data)
    return res.data
}

export async function updatePost(id : number, data : {title : string}) : Promise<Post>{
    const res = await API.patch<Post>(`${Routes.posts}/${id}`, data)
    return res.data
}

export async function deletePost(id:number) : Promise<Post> {
    const {data} = await API.delete<Post>(`${Routes.posts}/${id}`)
    return data
}