import { useComment, usePost } from "./usePosts"

interface detailsType {
    id: number
    onClose: () => void
}
const PostDetails = ({
    id,
    onClose
}: detailsType) => {

    const { data: post, isLoading, error } = usePost(id)
    const { data: comments, isLoading: loadingComments, } = useComment(id)

    return (

        <div className="mt-4 border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Post #{post?.id}</h3>
                <button onClick={onClose} className="px-2 py-1 border rounded">Close</button>
            </div>

            <p className="mt-2 font-medium">{post?.title}</p>
            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{post?.body}</p>

            <div className="mt-4">
                <h4 className="font-medium">Comments</h4>
                {loadingComments ? (
                    <p className="text-gray-500">Loading comments…</p>
                ) : !comments?.length ? (
                    <p className="text-gray-500">No comments</p>
                ) : (
                    <ul className="list-disc list-inside space-y-1">
                        {comments.map(c => (
                            <li key={c.id}>
                                <span className="font-medium">{c.email}</span>: {c.body}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Optional: a debug view that won't crash */}
            {/* <pre className="mt-4 bg-gray-50 p-2 rounded">{JSON.stringify(post, null, 2)}</pre> */}
        </div>
    )
}

export default PostDetails
