import React from 'react'

import { useState, useRef, useEffect } from "react";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import {FaSearch} from "react-icons/fa"

import "./SearchBarAutoComplete.css"

const SearchBarAutoComplete = ({ dataList, getQuery, queryValue, placeholderText, enabled }) => {
    // console.log('enabled:', enabled)
    // console.log('dataList:', dataList)
    // console.log('query value ', queryValue, 'enabled ::', enabled)
    const [items, setItems] = useState([])
    const [query, setQuery] = useState("")
    const [showList, setshowList] = useState(false);
    const inputRef = useRef()

    // console.log('items:', items)

    useEffect(() => {
        setItems(dataList)
        // console.log('queryvalue:', queryValue)
        setQuery(queryValue)
        getQuery(queryValue);
    }, [dataList])

    const filteredItems = items.filter(item => {
        return item.toLowerCase().includes(query ? query.toLowerCase() : '')
    })
    // console.log('filteredItems:', filteredItems)

    function onSubmit(e) {
        e.preventDefault()
        const value = inputRef.current.value
        if (value === "") return;
        setItems(prev => {
            return [...prev, value]
        })
        // setFilteredItems(prev => {
        //     return [...prev, value]
        // })
        inputRef.current.value = ""
    }

    // function onChange(e) {
    //     const value = e.target.value
    //     setFilteredItems(
    //         items.filter(item => item.toLowerCase().includes(value.toLowerCase()))
    //     )
    // }
    return (
        <>
            {/* <faSearch></faSearch> */}
            <div className='search-select'>
                <span className="material-symbols-outlined">
                    search
                </span>
                <input readOnly={enabled} className='input-wrapper' type='search' placeholder={placeholderText + '...'} value={query} onChange={e => {
                    setQuery(e.target.value)
                    getQuery(e.target.value)
                    setshowList(true)
                }}
                    onFocus={e => {
                        setshowList(true)
                    }}
                // onBlur={e => {
                //     setQuery(e.target.value)
                //     getQuery(e.target.value)
                //     setshowList(false)
                // }}
                >
                </input>
            </div>

            {showList && !enabled && <div className='results-list' >
                {filteredItems.map(item => (
                    <div onClick={(e) => {
                        // console.log(e.target.innerHTML);
                        // alert(e.target.innerHTML)
                        setQuery(e.target.innerHTML)
                        getQuery(e.target.innerHTML)
                        setshowList(false)
                    }}>
                        <span className="material-symbols-outlined">
                            arrow_forward_ios
                        </span>
                        <div className='results-list-item'>{item}</div>
                    </div>
                ))}
            </div >}

            {/* <br></br><br></br>
            <form onSubmit={onSubmit} >
                New Item: <input ref={inputRef} type='text'></input>
                <button type='submit' >Add</button>
            </form>
            <h3>Items:</h3> */}

        </>
    )
}

export default SearchBarAutoComplete
