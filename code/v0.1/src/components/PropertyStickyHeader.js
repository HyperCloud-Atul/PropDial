// import React from 'react'
import { useState } from 'react'
import Avatar from './Avatar';

export default function PropertyStickyHeader({ property }) {

    const [toggleFlag, setToggleFlag] = useState(false)
    const toggleBtnClick = () => {
        setToggleFlag(!toggleFlag);
    };

    return (
        <div>
            {property &&
                <div className={toggleFlag ? "property-details-sticky-div sticky-top open" : "property-details-sticky-div sticky-top"}>
                    <div className="primary-details"
                        onClick={toggleBtnClick}>
                        <div>
                            <h1>{property.unitNumber}</h1>
                            <h2>{property.society}</h2>
                        </div>
                        <div>
                            <h1>{property.locality}</h1>
                            <h2>{property.city}</h2>
                        </div>
                    </div>

                    <div className="property-sticky-arrow" onClick={toggleBtnClick}>
                        <span className="material-symbols-outlined">
                            expand_more
                        </span>
                    </div>

                    <div className="secondary-details">
                        <div className="secondary-details-content">
                            {property.taggedUsersList.map((ele) => {
                                return (
                                    ele.role === 'owner' ?
                                        <div className='secondary-details-content-inner'>
                                            <div>
                                                <span><Avatar src={ele.photoURL} /></span>
                                            </div>
                                            <b style={{ textAlign: 'right' }}>
                                                <h1>{ele.displayName}</h1>
                                                <h2>{ele.type}</h2>
                                            </b>
                                        </div> : ''
                                )

                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
