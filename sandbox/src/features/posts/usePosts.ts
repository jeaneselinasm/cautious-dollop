import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment, Post } from "../../lib/types";
import { createPost, fetchPosts, updatePost, deletePost, getPost, getCommentsByPostId } from "../../utils/api";

export function usePosts(page :number, limit =10){
    return useQuery<Post[], Error>({
        queryKey : ['posts', page, limit],
        queryFn : () => fetchPosts(page, limit),
        // keepPreviousData : true,
        staleTime : 1000*30
    })
}

export function usePost(id? : number){
    return useQuery<Post, Error>({
        queryKey : ['post', id],
        queryFn : () => getPost(id as number),
       enabled: typeof id === 'number' && Number.isFinite(id), // <- only run when valid
        staleTime : 1000*30

    })
}

export function useComment(postId?: number){
    return useQuery<Comment[], Error>({
        queryKey : ['comments', postId],
        queryFn : () => getCommentsByPostId(postId!),
        enabled : !!postId,
        staleTime : 1000 * 30
    })
}

export function useCreatePost(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn : (body : Omit<Post, "id">) => createPost(body), 
        onSuccess : ()=>{
            qc.invalidateQueries({queryKey : ['posts']})
        },
        // onError
    })
}

export function useUpdatePost() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn : ({ id, patch }: { id: number; patch: Partial<Omit<Post, "id">> }) =>
      updatePost(id, patch),

        // update for current page cache
    
        onMutate : async ({id, patch})=>{
            await qc.cancelQueries({queryKey : ['posts']})
            const prevSnapshots : Record<string, Post[] | undefined> = {}

            // snapshot & optimistically update all cached pages (simple approach)
            const queries = qc.getQueriesData<Post[]>({queryKey : ['posts']})

            queries.forEach(([key, old]) => {
                prevSnapshots[JSON.stringify(key)] = old
                if(!old) return
                qc.setQueriesData<Post[]>(key, old.map( p=> (p.id === id ? {...p, ...patch} : p) ))
            })
            return {prevSnapshots}
        },
        onError : (_err, _vars, ctx) =>{
            // rollback
            if(!ctx) return
            Object.entries(ctx.prevSnapshots).forEach(([key, value]) => {
                qc.setQueryData(JSON.parse(key), value)
             })
        },
        onSettled : () => {
            qc.invalidateQueries({queryKey : ['posts']})
        }

    })
}


export function useDeletePost(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn : (id:number)=> deletePost(id),
        onMutate : async (id:number) => {
            await qc.cancelQueries({queryKey : ['posts']})
            const prevSnapshots : Record<string, Post[]|undefined> = {}
            const queries = qc.getQueriesData<Post[]>({queryKey : ['posts']})
            queries.forEach(([key, old]) => {
                prevSnapshots[JSON.stringify(key)] = old
                if(!old) return
                qc.setQueryData<Post[]>(key, old.filter(p=> p.id !== id))
            })
            return {prevSnapshots}
        },
        onError : (_err, _id, ctx) => {
            if(!ctx) return
            Object.entries(ctx.prevSnapshots).forEach(([key, value])=>{
                qc.setQueryData(JSON.parse(key), value)
            })
        },
        onSettled : () =>{
            qc.invalidateQueries({queryKey : ['posts']})
        }

    })
    
}