import React from 'react'

import { useState, useEffect } from "react";
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import {FaSearch} from "react-icons/fa"

import "./SearchBarAutoComplete.css"

const SearchBarAutoComplete = ({ dataList, getQuery, queryValue, placeholderText, enabled, setRedirectFlag }) => {
    // console.log('enabled:', enabled)
    // console.log('dataList:', dataList)
    // console.log('query value ', queryValue, 'enabled ::', enabled)
    const [items, setItems] = useState([])
    const [query, setQuery] = useState("")
    const [showList, setshowList] = useState(false);

    // const inputRef = useRef()

    // console.log('items:', items)

    useEffect(() => {
        setItems(dataList)
        // console.log('queryvalue:', queryValue)
        setQuery(queryValue)
        getQuery(queryValue);

    }, [dataList, queryValue])

    const filteredItems = items.filter(item => {
        return item.toLowerCase().includes(query ? query.toLowerCase() : '')
    })
    // console.log('filteredItems:', filteredItems)

    // function onSubmit(e) {
    //     e.preventDefault()
    //     const value = inputRef.current.value
    //     if (value === "") return;
    //     setItems(prev => {
    //         return [...prev, value]
    //     })

    //     inputRef.current.value = ""
    // }


    // function highlightSearch(text) {
    //     var inputText = '';//document.getElementById("inputText");
    //     var innerHTML = '';//inputText.innerHTML;
    //     // var index = innerHTML.indexOf(text);
    //     // if (index >= 0) {
    //     //     innerHTML = innerHTML.substring(0, index) + "<span className='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
    //     //     inputText.innerHTML = innerHTML;
    //     // }
    //     let final = "";
    //     let arr = [];
    //     let index = 0;
    //     var list = document.getElementById("result-list").childNodes;
    //     console.log('list', list.childNodes)
    //     list.forEach(element => {
    //         final = "";
    //         innerHTML = element.lastChild.innerHTML;
    //         // innerHTML = innerHTML.replace("<strong style='background:red'>", "").replace("</strong>", "");
    //         arr = innerHTML.split(text)
    //         for (index = 0; index < arr.length; index++) {
    //             if ((index + 1) !== arr.length) {
    //                 final = final + arr[index] + "<strong style='background:red'>" + text + "</strong>"

    //             } else {
    //                 final = final + arr[index];
    //             }
    //         }
    //         console.log('element.lastChild', element.lastChild);
    //         element.lastChild.innerHTML = final;
    //         // arr.forEach((ele) => {
    //         //     final = final + ele + "<strong>" + text + "</strong>"

    //         // })
    //         // console.log('final', final, "\n")
    //     });
    // }
    // function onChange(e) {
    //     const value = e.target.value
    //     setFilteredItems(
    //         items.filter(item => item.toLowerCase().includes(value.toLowerCase()))
    //     )
    // }

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

            {/* {showList && !enabled && <div id="result-list" className='results-list' >
                {filteredItems.map(item => (
                    <div onClick={(e) => {                        
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
            </div >} */}

            <div id="result-list" className='results-list'>
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
                        {/* {highlightMatches(sentence, searchText)} */}
                    </div>
                ))}
            </div>


            {/* <div>
                {filteredItems.map((sentence, index) => (
                    <p key={index}>
                        {highlightMatches(sentence, searchText)}
                    </p>
                ))}
            </div> */}

        </>
    )
}

export default SearchBarAutoComplete
