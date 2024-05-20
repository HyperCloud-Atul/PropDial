import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'

export default function ReactTableGlobalFilter({ filter, setFilter }) {

    const [value, setValue] = useState(filter)
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 200)

    return (
        <span>
            Search: {' '}
            <input
                value={value || ''}
                onChange={e => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
            ></input>
            <div className="vg22"></div>
        </span>
    )
}
