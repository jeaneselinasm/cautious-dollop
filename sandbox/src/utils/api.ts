import type { Post, User } from "../types/types";
import { API } from "./axios";

export async function getPosts() : Promise<Post[]>{
    const {data} = await API.get<Post[]>('/posts')
    return data
}

export async function getPost(id:number) : Promise<Post> {
    const {data} = await API.get<Post>(`/posts/${id}`)
    return data
}

export async function getUsers() : Promise<User[]>{
    const {data} = await API.get<User[]>('/users')
    return data
}

export async function getUser(id:number) : Promise<User> {
    const {data} = await API.get<User>(`/users/${id}`)
    return data
}

export async function createPost(newPost : Omit<Post, "id">) : Promise<Post> {
    const {data} = await API.post<Post>('/posts', newPost)
    return data
}