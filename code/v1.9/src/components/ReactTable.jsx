import React, { useMemo } from 'react'
import { useTable, useGlobalFilter, useFilters, usePagination, useSortBy  } from 'react-table'
import './ReactTable.scss'
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
    }, useFilters, useGlobalFilter, useSortBy, usePagination)

    const { globalFilter } = state
    const { pageIndex, pageSize } = state

    return (
        <>
            <div className="vg22"></div>
            <div className="filters">
                <div className='left'>
                    <ReactTableGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
                <div className="right">
                    <div className="button_filter diff_views">
                        <div className="bf_single">
                            <span className="material-symbols-outlined">calendar_view_month</span>
                        </div>
                        <div className="bf_single">
                            <span className="material-symbols-outlined">grid_view</span>
                        </div>
                        <div className="bf_single active">
                            <span className="material-symbols-outlined">view_list</span>
                        </div>
                    </div>
                    <div className="icon_dropdown">
                        <select name="months" id="months">
                            <option value="" disabled>Select Month</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="vg10"></div>
            <div className='react_table'>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headergroup) => (
                            <tr {...headergroup.getFooterGroupProps()}>
                                {
                                    headergroup.headers.map((column) => (
                               <th {...column.getHeaderProps(column.getSortByToggleProps())}>
  {column.render('Header')}
  {/* Sort indicator */}
  <span>
    {column.isSorted
      ? column.isSortedDesc
        ? ' 🔽'
        : ' 🔼'
      : ''}
  </span>
  <div>{column.canFilter ? column.render('Filter') : null}</div>
</th>

                                    ))
                                }

                            </tr>
                        ))}

                    </thead>
                    {/* <tbody {...getTableBodyProps()}>
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
                    </tbody> */}
                    <tbody {...getTableBodyProps()}>
  {page.map((row) => {
    prepareRow(row);

    const status = row.original?.status?.toLowerCase?.(); // safe check
    const rowClass =
      status === "inactive"
        ? "inactive-row"
        : status === "active"
        ? "active-row"
        : ""; // default: no class if no status

    return (
      <tr {...row.getRowProps({ className: rowClass })}>
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
        ))}
      </tr>
    );
  })}
</tbody>

                </table>
            </div>
            {tableData.length > 10 && (
                <div className='react_pagination'>
                    <div className="left">
                        <div className="items_on_page">
                            <span>
                                Items per page
                            </span>
                            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                                {
                                    [5, 10, 25, 50, 100].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="right">
                        <div className="previous_previous_first">
                            <span className={`material-symbols-outlined previous_first ${!canPreviousPage ? "disabled" : "pointer"}`} onClick={() => gotoPage(0)}>
                                skip_previous
                            </span>
                            <div className={`previous_click ${!canPreviousPage ? "disabled" : "pointer"}`} onClick={() => previousPage()}>
                                <div className="arrow">
                                    <span className="material-symbols-outlined">
                                        arrow_back_ios
                                    </span> <span className="material-symbols-outlined">
                                        arrow_back_ios
                                    </span>
                                </div>


                                <span>
                                    Previous
                                </span>
                            </div>
                        </div>
                        <div className="total_page">
                            <span className="active_page">
                                {pageIndex + 1}
                            </span>
                            <span className="tp_number">
                                of {pageOptions.length}
                            </span>
                        </div>
                        <div className="next_next_last">
                            <div className={`next_click ${!canNextPage ? "disabled" : "pointer"}`} onClick={() => nextPage()}>
                                <span>
                                    Next
                                </span>
                                <div className="arrow">
                                    <span className="material-symbols-outlined">
                                        arrow_forward_ios
                                    </span><span className="material-symbols-outlined">
                                        arrow_forward_ios
                                    </span>
                                </div>

                            </div>
                            <span className={`material-symbols-outlined next_last ${!canNextPage ? "disabled" : "pointer"}`} onClick={() => gotoPage(pageCount - 1)}>
                                skip_next
                            </span>
                        </div>
                    </div>



                </div >
            )}
        </>
    )
}

