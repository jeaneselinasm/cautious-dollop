import { useMemo, useState } from "react";
import { useUsers } from "../hooks/userQueries";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import type { User } from "../lib/types";

const UserTable = () => {
    const columns = useMemo<ColumnDef<User>[]>(() => [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "email", header: "Email" },
    ], []);

    // client-side pagination state
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

    // fetch all users once (client-side paging)
    const { data: users = [], isLoading, isError, isFetching } = useUsers();

    const table = useReactTable({
        data: users,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (isLoading) return <p>Loading ...</p>;
    if (isError) return <p>Error ...</p>;

    const total = users.length;
    const start = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
    const end = Math.min(total, (pagination.pageIndex + 1) * pagination.pageSize);

    return (
        <div className="space-y-3">
            <h1 className="text-blue-600 text-4xl font-bold">Users List</h1>

            <div className="text-md text-gray-600">
                {total > 0 ? `Showing ${start}–${end} of ${total}` : "No users"}
                {isFetching && <em className="ml-2 opacity-70">(loading…)</em>}
            </div>

            {/* Bordered card wrapper for the table */}
            <div className="rounded-lg border border-gray-300 shadow-sm overflow-hidden ">
                <table className="w-full table-auto">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(hg => (
                            <tr

                                key={hg.id}>
                                {hg.headers.map(h => (
                                    <th
                                        key={h.id}
                                        className="px-4 py-2 text-2xl font-bold text-gray-700 border-b border-gray-200 text-center"
                                    >
                                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    {/* Row borders + zebra striping: even rows bg-gray-100 */}
                    <tbody className="divide-y divide-gray-200 text-xl">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="odd:bg-white even:bg-gray-100">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2  text-gray-800">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {table.getRowModel().rows.length === 0 && (
                            <tr className="odd:bg-white even:bg-gray-100">
                                <td className="px-4 py-6 text-justify text-gray-500" colSpan={columns.length}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={pagination.pageIndex === 0}
                    className="px-3 py-1.5 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    « First
                </button>

                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1.5 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ‹ Prev
                </button>

                <span className="px-2 text-sm text-gray-700">
                    Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                    <strong>{table.getPageCount()}</strong>
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1.5 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next ›
                </button>

                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1.5 rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Last »
                </button>

                <select
                    className="ml-2 px-2 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
                    value={table.getState().pagination.pageSize}
                    onChange={e => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
                >
                    {[10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>Show {size}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserTable;
