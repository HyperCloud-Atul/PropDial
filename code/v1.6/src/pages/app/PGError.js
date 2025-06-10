import React from 'react'
// styles
import './PGError.css'
export default function PGError() {
    return (
        <div style={{
            textAlign: 'center',
            paddingTop: '200px',
            fontSize: '30px'
        }}>
            <span className="material-symbols-outlined">
                error
            </span>
            <br></br>
            <span > Oops! Something went wrong.</span>
        </div>
    )
}
