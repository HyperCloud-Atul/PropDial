import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import './Filters.css';
// import { useNavigate } from 'react-router-dom'

// const filterList = ['all', 'admin', 'active', 'inactive'];
const defaultFilterList = ['ALL', 'ACTIVE', 'INACTIVE'];
const defaultFilterLength = 0;

export default function Filters({ changeFilter, filterList, filterLength }) {
    // const { user } = useAuthContext()
    let defaultFilterValue = filterList[0];
    const [currentFilter, setCurrentFilter] = useState(defaultFilterValue)

    // console.log('filterList:', filterList[0])

    if (!filterList)
        filterList = defaultFilterList;
    if (!filterLength)
        filterLength = defaultFilterLength;

    const handleClick = (newFilter) => {
        setCurrentFilter(newFilter)
        changeFilter(newFilter)
    }

    return (
        <div className="project-filter">
            <nav>
                {/* <p>Filter by: </p> */}
                {filterList.map((f) => (
                    <button key={f}
                        onClick={() => handleClick(f)}
                        className={currentFilter === f ? 'active' : ''}                    >
                        <span>{f}</span>
                        {/* {currentFilter === f ? <small>{filterLength}</small> : ''} */}
                        {/* {currentFilter === f &&
                        <div style={{
                            display:"none"
                        }} className='length_top'>{filterLength}</div> } */}
                        {/* {currentFilter === f ? <badge>3</badge> : ''} */}
                        {/* {console.log('current filter:', currentFilter, ' f:', f, ' filterLength:', filterLength)} */}
                    </button>
                ))}
            </nav>
        </div>
    )
}