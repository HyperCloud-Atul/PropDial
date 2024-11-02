import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";

// component
import ImportExcel from "../../components/utils/ImportExcel";
import { useCollection } from "../../hooks/useCollection";

import { useExcelImport } from "./useExcelImport";
const PGExportExcel = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    const { addDocument, updateDocument, error } = useFirestore("agent-propdial");
    const { isPending, error: download, documents } = useCollection("agent-propdial");
    const { exportExcel } = useExcelImport()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate();

    const setJSON = (json) => {
        console.log("json: ", json)
        json.forEach(element => {
            // if (element.documentID === '')
            addDocument(element)
            // else{
            // updateDocument(element.documentID,{})
            // }

        });

    }
    function downloadExcle() {
        exportExcel(documents, 'user_propdial');
    }
    return (
        <>
            {/* Agent Excel import/export - Start */}
            <section>
                <div>
                    <h3>Agent Data Collection</h3>
                    <div>
                        <button onClick={downloadExcle}> Download Template for Agent</button>
                    </div>
                    <br></br>
                    <div>
                        <h6>Import Data into Firebase Collection</h6>
                        <ImportExcel setJSON={setJSON}></ImportExcel>
                    </div>

                </div>

            </section>
            {/* Agent Excel import/export - End */}
            <br></br>
        </>
    );
};

export default PGExportExcel;
