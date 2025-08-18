import { useMemo, useState } from "react";
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from "./usePosts";
import type { Post } from "../../lib/types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import PostDetails from "./PostDetails";
export default function PostsTable({ onSelect }: { onSelect: (id: number) => void }) {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data = [], isLoading, isFetching } = usePosts(page, pageSize)


  const createMutation = useCreatePost(page, pageSize)
  const updateMutation = useUpdatePost(page, pageSize)
  const deleteMutation = useDeletePost(page, pageSize)

  // local UI state for  editing

  const [editingId, setEditingId] = useState<number | null>()
  const [draftTitle, setDraftTitle] = useState<string>("")

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // const columns = useMemo<ColumnDef<Post>[]>(() => [
  //   { accessorKey: 'id', header: 'ID' },
  //   { accessorKey: 'title', header: 'Title' },
  //   {
  //     id: 'actions',
  //     header: 'Actions',
  //     cell: ({ row }) => (
  //       <div className="flex gap-2">
  //         <button
  //           onClick={() => console.log('edit', row.original)}
  //           className="px-2 py-1 border rounded"
  //         >Edit</button>
  //         <button
  //           onClick={() => console.log('Delete', row.original.id)}
  //           className="px-2 py-1 border rounded text-red-600"
  //         >Delete</button>
  //         <button
  //           onClick={() => onSelect(row.original.id)}
  //           className="px-2 py-1 rounded bg-gray-100"
  //         >
  //           Details
  //         </button>
  //       </div>
  //     ),
  //   },
  // ], [onSelect])

  const columns = useMemo<ColumnDef<Post>[]>(() => [
    { accessorKey: 'id', header: 'ID' },
    {
      accessorKey: 'title', header: 'Title',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return isEditing ? (
          <input
            className="w-full border rounded px-2 py-1"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
          />
        ) : (
          row.original.title
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isEditing = editingId === row.original.id
        return (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    if (!draftTitle.trim()) return;
                    updateMutation.mutate({ id: row.original.id, patch: { title: draftTitle.trim() } });
                    setEditingId(null);
                    setDraftTitle("");
                  }}
                  className="px-2 py-1 border rounded text-green-700"
                  disabled={updateMutation.isPending}
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingId(null); setDraftTitle(""); }}
                  className="px-2 py-1 border rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => { setEditingId(row.original.id); setDraftTitle(row.original.title); }}
                className="px-2 py-1 border rounded"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteMutation.mutate(row.original.id)}
              className="px-2 py-1 border rounded text-red-600 disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>

            <button
              onClick={() => { setSelectedId(row.original.id); onSelect?.(row.original.id); }}
              className="px-2 py-1 rounded bg-gray-100"
            >
              Details
            </button>
          </div>
        )
      }
    }

  ], [onSelect, editingId, draftTitle, updateMutation.isPending, deleteMutation.isPending])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  // create form
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")

  const handleCreate = () => {
    if (!newTitle.trim()) return
    createMutation.mutate(
      { title: newTitle.trim(), body: newBody.trim() || '-', userId: 1 },
      {
        onSuccess: () => {
          setNewTitle('')
          setNewBody('')
        }
      }
    )
  }

  return (
    // <div className="bg-white rounded-xl shadow p-4">
    //   <div className="flex items-center justify-between mb-3">
    //     <h2 className="text-lg font-medium ">Posts (page {page}) </h2>
    //     {isFetching && <span className="text-sm text-gray-500"> refreshing.. </span>}
    //   </div>

    //   <table className="w-full text-justify border-collapse">
    //     <thead className="bg-gray-100">
    //       {table.getHeaderGroups().map(hg => (
    //         <tr key={hg.id}>
    //           {hg.headers.map(header => (
    //             <th key={header.id} className="px-3 py-2 border-b">
    //               {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    //             </th>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //     <tbody>
    //       {isLoading ? (
    //         <tr><td className="p-4" colSpan={columns.length}>Loading…</td></tr>
    //       ) : data.length === 0 ? (
    //         <tr><td className="p-4" colSpan={columns.length}>No data</td></tr>
    //       ) : (
    //         table.getRowModel().rows.map(row => (
    //           <tr key={row.id} className="hover:bg-gray-50">
    //             {row.getVisibleCells().map(cell => (
    //               <td key={cell.id} className="px-3 py-2 border-b">
    //                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //               </td>
    //             ))}
    //           </tr>
    //         ))
    //       )}
    //     </tbody>
    //   </table>

    //   <div className="flex items-center gap-2 mt-4">
    //     <button
    //       className="px-3 py-1 border rounded disabled:opacity-50"
    //       onClick={() => setPage(p => Math.max(1, p - 1))}
    //       disabled={page === 1}
    //     >
    //       Prev
    //     </button>
    //     <button
    //       className="px-3 py-1 border rounded"
    //       onClick={() => setPage(p => p + 1)}
    //     >
    //       Next
    //     </button>
    //   </div>

    // </div>
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Posts (page {page})</h2>
        {isFetching && <span className="text-sm text-gray-500">refreshing…</span>}
      </div>

      {/* Create */}
      <div className="mb-4 grid gap-2 md:grid-cols-3">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New post title"
          className="border rounded px-2 py-1"
        />
        <input
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="New post body"
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating…' : 'Create'}
        </button>
      </div>

      <table className="w-full text-justify border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id} className="px-3 py-2 border-b">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td className="p-4" colSpan={columns.length}>Loading…</td></tr>
          ) : data.length === 0 ? (
            <tr><td className="p-4" colSpan={columns.length}>No data</td></tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
      {/* Details panel */}

      {typeof selectedId === 'number' && (
        <PostDetails
          key={selectedId}               // reset contents between selections
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
