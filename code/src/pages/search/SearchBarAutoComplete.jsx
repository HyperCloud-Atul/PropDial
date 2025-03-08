import React from 'react'

import { useState, useEffect } from "react";
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import {FaSearch} from "react-icons/fa"

import "./SearchBarAutoComplete.css"

const SearchBarAutoComplete = ({ dataList, getQuery, queryValue, placeholderText, enabled, setRedirectFlag }) => {
    // console.log('enabled:', enabled)
    console.log('dataList:', dataList)
    // console.log('getQuery:', getQuery)
    console.log('query value ', queryValue)
    // console.log('setRedirectFlag ', setRedirectFlag)

    const [items, setItems] = useState([])
    const [query, setQuery] = useState("")
    const [showList, setshowList] = useState(false);

    // const inputRef = useRef()

    console.log('items:', items)
    console.log('queryValue: ', queryValue)

    useEffect(() => {
        setItems(dataList)
        // console.log('queryvalue:', queryValue)
        setQuery(queryValue)
        getQuery(queryValue);

    }, [dataList, queryValue])

    //City-Locality-Society
    let cityList = [];
    let localityList = [];
    // let filteredItems = items
    const filteredItems = items && items.filter(item => {
        return item && item.toLowerCase().includes(query ? query.toLowerCase() : '')
    })

    console.log("filteredItems: ", filteredItems)

    let itemDetails = []
    filteredItems && filteredItems.forEach(element => {
        itemDetails = element.split('-')
        if (!cityList.includes(itemDetails[0])) {
            cityList.push(itemDetails[0])
        }
        if (!localityList.includes(itemDetails[0] + '-' + itemDetails[1])) {
            localityList.push(itemDetails[0] + '-' + itemDetails[1])
        }
    });
    cityList.sort();
    localityList.sort();
    for (let index = localityList.length - 1; index >= 0; index--) {
        const element = localityList[index];
        filteredItems && filteredItems.unshift(element);
    }
    for (let index = cityList.length - 1; index >= 0; index--) {
        const element = cityList[index];
        filteredItems && filteredItems.unshift(element);
    }
    // console.log('filteredItems:', filteredItems)

    const [searchText, setSearchText] = useState('');

    const highlightMatches = (text, search) => {
        if (!search.trim()) {
            return text;
        }

        const regex = new RegExp(`(${search})`, 'gi');

        return text.split(regex).map((part, index) =>
            regex.test(part) ? <span style={{ fontWeight: 'bolder', color: 'Red' }} key={index}>{part}</span> : part

        );
    };

    const highlightSearch = (text) => {
        setSearchText(text);
    };

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
                    highlightSearch(e.target.value)

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

            {query !== '' && <div id="result-list" className='results-list'>
                {filteredItems.map((sentence, index) => (
                    <div key={index} onClick={(e) => {
                        setQuery(e.target.innerHTML.replaceAll('<span style="font-weight: bolder; color: red;">', '').replaceAll('<span className="material-symbols-outlined">arrow_forward_ios', '').replaceAll('</span>', ''))

                        getQuery(e.target.innerHTML.replaceAll('<span style="font-weight: bolder; color: red;">', '').replaceAll('</span>', ''))

                        setRedirectFlag(true, e.target.innerHTML.replaceAll('<span style="font-weight: bolder; color: red;">', '').replaceAll('</span>', ''))
                        setshowList(false)
                    }}>
                        <span className="material-symbols-outlined">
                            arrow_forward_ios
                        </span>
                        <div className='results-list-item'>{highlightMatches(sentence, searchText)}</div>

                    </div>
                ))}
            </div>}

        </>
    )
}

export default SearchBarAutoComplete
