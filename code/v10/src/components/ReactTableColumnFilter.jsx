import React from 'react'

export default function ReactTableColumnFilter({ column }) {

    const { filterValue, setFilter } = column

    return (
        <span>
            Search: {' '}
            <input
                value={filterValue || ''}
                onChange={e => setFilter(e.target.value)}
            ></input>
            <div className="vg22"></div>
        </span>
    )
}
