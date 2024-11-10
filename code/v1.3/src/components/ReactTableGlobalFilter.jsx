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
            <div className="field_icon"><span className="material-symbols-outlined">search</span></div>
        </div>




    )
}
