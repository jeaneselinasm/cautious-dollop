import { useQueries, type UseQueryResult } from "@tanstack/react-query"
import { getPosts, getUsers } from "../utils/api"
import type { Post, User } from "../types/types"


const Parallel = () => {
    const results = useQueries({
        queries : [
            {queryKey : ['posts'], queryFn : getPosts},
            {queryKey : ['users'], queryFn : getUsers}
        ]
    }) as [UseQueryResult<Post[]>, UseQueryResult<User[]>]

    const [postsResult, usersResult] = results

    if(postsResult.isLoading || usersResult.isLoading) return <p>Loading Data..</p>
    if(postsResult.error || usersResult.error) return <p className="text-red-500">Error Fetching Data</p>

    const posts = postsResult.data!.slice(0,3)
    const users = usersResult.data!
  return (
     <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="font-semibold mb-2">Posts</h3>
      <ul className="list-disc pl-6">
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="font-semibold mb-2">Users</h3>
      <ul className="list-disc pl-6">
        {users.map((u) => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Parallel
