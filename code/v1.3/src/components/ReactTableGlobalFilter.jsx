import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export default function ReactTableGlobalFilter({ filter, setFilter }) {

    const [value, setValue] = useState(filter)
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 200)

    return (
        <div className="rt_global_search search_field">
            <input
                value={value || ''}
                onChange={e => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
                placeholder='Search'
            ></input>
            <div class="field_icon"><span class="material-symbols-outlined">search</span></div>
        </div>




    )
}
