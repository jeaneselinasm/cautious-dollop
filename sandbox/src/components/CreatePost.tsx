import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, type FormEvent } from "react"
import type { Post } from "../lib/types"
import { createPost } from "../utils/api"

const CreatePost = () => {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState("")

    const mutation = useMutation({
        mutationFn : (payload : Omit<Post, "id">) => createPost(payload),
        onSuccess : ()=>{
            queryClient.invalidateQueries({queryKey : ['posts']})
        }
    })

    const handleSubmit = (e : FormEvent) =>{
        e.preventDefault()
        mutation.mutate({title, body : "hello world", userId : 1})
        console.log('success')
        setTitle("")
    }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input type="text"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="border px-2 py-1 rounded w-64"
         />
         <button
         type="submit"
         className="bg-green-600 text-white px-3 py-1 rounded"
         disabled={mutation.isPending}
         >
            {mutation.isPending ? "Saving..." : "Add Post"}
         </button>
      </form>
    </div>
  )
}

export default CreatePost
