import type { Post } from "../types/types";
import { API } from "./axios";

export async function getPosts() : Promise<Post[]>{
    const {data} = await API.get<Post[]>('/posts')
    return data
}

export async function getPost(id:number) : Promise<Post> {
    const {data} = await API.get<Post>(`/post/${id}`)
    return data
}