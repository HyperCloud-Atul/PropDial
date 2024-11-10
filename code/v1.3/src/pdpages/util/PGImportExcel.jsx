import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";

// component
import ImportExcel from "../../components/utils/ImportExcel";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useExcelImport } from "./useExcelImport";
const PGExportExcel = () => {
    const { user } = useAuthContext();
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    const { addDocument, updateDocument, error } = useFirestore("agent-propdial");
    const { isPending, error: download, documents } = useCollection("agent-propdial");
    const { exportExcel } = useExcelImport()
    const [count, setCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const agentDataTemplate = [{
        agentName: '',
        agentCompnayName: '',
        agentPhone: '',
        agentEmail: '',
        state: '',
        city: '',
        locality: ''
    }]
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end
    const navigate = useNavigate();

    const setJSON = (json) => {
        console.log("json: ", json, user)
        let record = {};
        setTotalCount(json.length);
        console.log('_totalCount', json.length)
        json.forEach(element => {

            // let _locality = element.locality
            // let _localityList = _locality.split(';')
            // console.log(_localityList, _locality)
            record = {
                ...element,
                // locality: _locality === '' ? [] : _localityList,
                country: 'India',
                createdAt: new Date(),
                createdBy: user && user.uid

            }
            console.log('record', record)
            setCount(count + 1);
            console.log(count)
            // if (element.documentID === '')
            addDocument(record)
            // else{
            // updateDocument(element.documentID,{})
            // }

        });
        console.log('upload completed !!')

    }
    function downloadExcle() {
        // let singleRow = [documents[0]];
        exportExcel(documents, 'Agentdetails_Excel');
    }
    function downloadTemplate() {
        let singleRow = [documents[0]];
        exportExcel(agentDataTemplate, 'template');
    }
    return (
        <>
            {/* Agent Excel import/export - Start */}
            <section>
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h3>Agent Data Collection</h3>
                    <div>
                        <button onClick={downloadTemplate}> Download Template for Agent</button>
                    </div>
                    <div>
                        <button onClick={downloadExcle}> Export Data for Agent</button>
                    </div>
                    <br></br>
                    <div>
                        <h6>Import Data into Firebase Collection123</h6>
                        <ImportExcel setJSON={setJSON}></ImportExcel>
                        <h6> Total Record : {totalCount} </h6>
                        <h6> Record processed : {count} </h6>
                    </div>

                </div>

            </section>
            {/* Agent Excel import/export - End */}
            <br></br>
        </>
    );
};

export default PGExportExcel;
