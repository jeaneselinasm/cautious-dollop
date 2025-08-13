import { useQuery } from "@tanstack/react-query"
import type { User } from "../types/types"
import { getUsers } from "../utils/api"


export const Users = () => {
    
    const {data, error, isLoading, refetch, isRefetching } = useQuery<User[]>({
        queryKey : ['users'],
        queryFn : getUsers,
        select : (users) => users.slice(0,5)
    })
    if(isLoading){
        return (
            <div>Is Loading ...</div>
        )
    }

    if(error) {
        return(
            <div className="text-red-300">
                Failed to load the users
            </div>
        )
    }
  return (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Users</h2>
            <button onClick={()=>refetch()}
                className="bg-blue-400 px-2 py-1 rounded"
                >
                {isRefetching ? 'Refreshing data..' : 'Refresh'}
            </button>
            <ul className="list-disc pl-8">
                {data?.map((u)=>(
                    <li key={u.id}>
                        <span> {u.id} </span>
                        <span> {u.name} </span>
                        <span> {u.username} </span>
                        <span> {u.email} </span>
                    </li>

                   
                ))}

            </ul>
        </div>
    </div>
  )
}
