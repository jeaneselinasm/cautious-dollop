import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import type { Post, User } from "../lib/types"
import { getPosts, getUser } from "../utils/api"


const PostWithAuthor = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const postsQuery = useQuery<Post[]>({
    queryKey : ['posts'],
    queryFn : getPosts
  })

  const userQuery = useQuery<User>({
    queryKey : ['user', selectedId],
    enabled : selectedId != null, 
    queryFn : async () => {
      const post = postsQuery.data!.find((p)=> p.id === selectedId)!
      return getUser(post.userId)
    }
  })

  if(postsQuery.isLoading) return <p>Loading Posts ..</p>
  if(postsQuery.error) return <p className="text-red-500">Error Loading Posts</p>





  return (
    <div className="space-y-3">
      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        <option value="" disabled>
          Select a post
        </option>
        {postsQuery.data!.slice(1, 20).map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      {userQuery.isLoading && <p>Loading author…</p>}
      {userQuery.data && (
        <p className="text-sm text-slate-700">
          <span className="font-medium">Author:</span> {userQuery.data.username}
        </p>
      )}
    </div>
  )
}

export default PostWithAuthor
