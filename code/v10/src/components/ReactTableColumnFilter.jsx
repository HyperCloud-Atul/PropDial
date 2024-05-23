import React from 'react'

export default function ReactTableColumnFilter({ column }) {

    const { filterValue, setFilter } = column

    return (
      <div className="filters">
          <div className="rt_global_search search_field mt-1">
            <input
                value={filterValue || ''}
                onChange={e => setFilter(e.target.value)}
                placeholder='Search'
            ></input>
            <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
        </div>
      </div>

    )
}
