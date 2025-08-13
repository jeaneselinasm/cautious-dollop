import { useQuery } from "@tanstack/react-query"
import type { Post } from "../types/types"
import { getPosts } from "../utils/api"


const Posts = () => {

    const {data, error, isLoading, refetch, isRefetching} = useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn : getPosts,
        select : (posts) => posts.slice(0,5)
    }
    
)
if(isLoading){
    return (
        <div>Is Loading ...</div>
    )
}

if(error){
    return(
        <div className="text-red-300">
            Failed to load the post
        </div>
    )
}
    


  return (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold"> Posts</h2>
            <button onClick={()=>refetch()}
                className="bg-slate-700 text-white px-2 py-1 rounded"
                >
                    {isRefetching ? 'Refreshing ..' : 'Refresh'}
            </button>
            <ul className="list-disc pl-6">
                 {data?.map((p) => (
          <li key={p.id}>{p.title}</li> 
        ))}
            </ul>
        </div>
    </div>
  )
}

export default Posts