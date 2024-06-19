import { useState } from 'react';
import './Filters.scss';

const defaultFilterList = ['ALL', 'ACTIVE', 'INACTIVE'];
const defaultFilterLength = 0;

export default function Filters({ changeFilter, filterList, filterLength }) {
    const [currentFilter, setCurrentFilter] = useState(filterList[0]);

    const handleClick = (newFilter) => {
        setCurrentFilter(newFilter);
        changeFilter(newFilter);
    };

    const initialFilters = filterList.slice(0, 5);
    const extraFilters = filterList.slice(5);

    return (
        <div className="project-filter">
            <nav>
                {initialFilters.map((f) => (
                    <button
                        key={f}
                        onClick={() => handleClick(f)}
                        className={currentFilter === f ? 'active' : ''}
                    >
                        <span>{f}</span>
                    </button>
                ))}
                {extraFilters.length > 0 && (
                    <select
                        onChange={(e) => handleClick(e.target.value)}
                        value={currentFilter}
                        className={`filter-dropdown ${extraFilters.includes(currentFilter) ? 'active' : ''}`}
                    >
                        <option value="" selected disabled>More</option>
                        {extraFilters.map((f) => (
                            <option
                                key={f}
                                value={f}
                                className={currentFilter === f ? 'active' : ''}
                            >
                                {f}
                            </option>
                        ))}
                    </select>
                )}
            </nav>
        </div>
    );
}
