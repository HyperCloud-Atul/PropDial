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
            <span class="material-symbols-outlined pointer" onClick={handleGoBack}>
                arrow_back
            </span>
            <span className="m22">
                {pageTitle}
            </span>
        </div>
    )
}

export default Back
