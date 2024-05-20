import React, { useMemo } from 'react'
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table'
import './ReactTable.css'
import ReactTableGlobalFilter from './ReactTableGlobalFilter'
import ReactTableColumnFilter from './ReactTableColumnFilter'

export default function ReactTable({ tableColumns, tableData }) {

    // const columns = useMemo(() => tableColumns, [])
    // const data = useMemo(() => tableData, [])

    // const tableInstance = useTable({
    //     columns: tableColumns,
    //     data: tableData
    // })

    const defaultColumn = useMemo(() => {
        return {
            Filter: ReactTableColumnFilter
        }
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns: tableColumns,
        data: tableData,
        defaultColumn
    }, useFilters, useGlobalFilter, usePagination)

    const { globalFilter } = state
    const { pageIndex, pageSize } = state

    return (
        <>
            <div>
                <ReactTableGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <div>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headergroup) => (
                            <tr {...headergroup.getFooterGroupProps()}>
                                {
                                    headergroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))
                                }

                            </tr>
                        ))}

                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            page.map((row) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map((cell) => {
                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <span>
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>

                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [5, 10, 25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))
                    }
                </select>

                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}> Next</button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
            </div >
        </>
    )
}

