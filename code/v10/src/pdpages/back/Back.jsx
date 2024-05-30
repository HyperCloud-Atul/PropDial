import React from 'react'
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Back = ({ pageTitle }) => {
    // goback code
    const navigate = useNavigate(); // Use useNavigate hoo
    const handleGoBack = () => {
        navigate(-1); // Navigate back one step
    };
    // goback code
    return (
        <div className="back_with_title">
         <div className="left d-flex align-items-center pointer" onClick={handleGoBack}>
         <span class="material-symbols-outlined pointer" >
                arrow_back
            </span>
            <span className="r18">
                {pageTitle}
            </span>
         </div>
        </div>
    )
}

export default Back
