import { useState, useEffect } from 'react';


const defaultFilterList = ['ALL', 'ACTIVE', 'INACTIVE'];
const defaultFilterLength = 0;

export default function UserFilters({ changeFilter, filterList, filterLength, roleCounts, formatCount    }) {
    const [currentFilter, setCurrentFilter] = useState(filterList[0]);
    const [maxVisibleFilters, setMaxVisibleFilters] = useState(5);

    useEffect(() => {
        const updateMaxVisibleFilters = () => {
            if (window.innerWidth < 767) {
                setMaxVisibleFilters(3);
            } else {
                setMaxVisibleFilters(5);
            }
        };

        updateMaxVisibleFilters();
        window.addEventListener('resize', updateMaxVisibleFilters);
        return () => window.removeEventListener('resize', updateMaxVisibleFilters);
    }, []);

    const handleClick = (newFilter) => {
        setCurrentFilter(newFilter);
        changeFilter(newFilter);
    };

    const initialFilters = filterList.slice(0, maxVisibleFilters);
    const extraFilters = filterList.slice(maxVisibleFilters);

    return (
        <div className="project-filter">
            <nav>
                {initialFilters.map((f) => (
                    <button
                        key={f}
                        onClick={() => handleClick(f)}
                        className={currentFilter === f ? 'active' : ''}
                    >
                        <span>{f} ({formatCount(roleCounts[f] || 0)})
</span>
                    </button>
                ))}
                {extraFilters.length > 0 && (
                    <select
                        onChange={(e) => handleClick(e.target.value)}
                        value={currentFilter}
                        className={`filter-dropdown ${extraFilters.includes(currentFilter) ? 'active' : ''}`}
                    >
                        <option value="" selected>More</option>
                        {extraFilters.map((f) => (
                            <option
                                key={f}
                                value={f}
                                className={currentFilter === f ? 'active' : ''}
                            >
                            {f} ({formatCount(roleCounts[f] || 0)})

                            </option>
                        ))}
                    </select>
                )}
            </nav>
        </div>
    );
}
