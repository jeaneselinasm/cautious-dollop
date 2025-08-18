import type { Comment, Post, User } from "../lib/types";
import { API } from "./axios";

export async function getPosts() : Promise<Post[]>{
    const {data} = await API.get<Post[]>('/posts')
    return data
}

export async function fetchPosts(page = 1, limit =10) : Promise<Post[]>{
    const {data} = await API.get<Post[]>('/posts', {
        params : {_page : page, _limit : 10}
    })
    return data
}

export async function getPost(id:number) : Promise<Post> {
    const {data} = await API.get<Post>(`/posts/${id}`)
    return data
}
export async function createPost(newPost : Omit<Post, "id">) : Promise<Post> {
    const {data} = await API.post<Post>('/posts', newPost)
    return data
}

export async function updatePost(id:number, payload : Partial<Omit<Post, "id">>):Promise<Post> {
    const {data} = await API.patch<Post>(`/posts/${id}`, payload)
    return data
}

export async function deletePost(id:number) {
    await API.delete(`/posts/${id}`)
    return {id}
}

export async function getUsers() : Promise<User[]>{
    const {data} = await API.get<User[]>('/users')
    return data
}

export async function getUser(id:number) : Promise<User> {
    const {data} = await API.get<User>(`/users/${id}`)
    return data
}


export async function getCommentsByPostId(id : number) : Promise<Comment[]> {
    const {data} = await API.get<Comment[]>(`/posts/${id}/comments`) 
    return data   
}