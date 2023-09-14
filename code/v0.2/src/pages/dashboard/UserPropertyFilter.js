import { useState } from 'react';
import './UserPropertyFilter.css';

const filterList = ['all', 'admin', 'active', 'inactive'];

export default function UserPropertyFilter({ changeFilter }) {
    const [currentFilter, setCurrentFilter] = useState('all')

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
                        className={currentFilter === f ? 'active' : ''}
                    >
                        <span>{f}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}