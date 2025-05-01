import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFirestore } from "../../hooks/useFirestore";

// component
import ImportExcel from "../../components/utils/ImportExcel";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";

import { useExcelImport } from "./useExcelImport";
import { Input } from "@mui/material";
const PGExportExcel = () => {
    const { user } = useAuthContext();
    const { collectionName } = useParams()
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    // const collectionName = "m_countries";
    // const collectionName = "m_states";
    // const collectionName = "m_localities";    

    const { addDocument, updateDocument, error } = useFirestore(collectionName);
    // const { addDocumentWithCustomDocId, updateDocument, error } = useFirestore(collectionName);
    const { isPending, error: download, documents } = useCollection(collectionName);

    // const { collectionName, setCollectionName } = useState();


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
        json.forEach(async element => {

            // let _locality = element.locality
            // let _localityList = _locality.split(';')
            // console.log(_localityList, _locality)
            record = {
                ...element,
                // locality: _locality === '' ? [] : _localityList,
                // country: 'India',
                createdAt: new Date(),
                createdBy: user && user.phoneNumber

            }
            console.log('record', record)
            setCount(count + 1);
            console.log(count)

            addDocument(record)
            // const _customDocId = record.docId.split(" ").join("_").toLowerCase()
            // await addDocumentWithCustomDocId(record, _customDocId);

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
            <div className="container">
                <div className="row no-gutters">
                    <div className="col-lg-6 col-md-6 col-sm-12">
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


                            </div>
                        </section>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <section>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <div>
                                <h6>Import Data into Firebase Collection </h6> <h1> {collectionName}</h1>
                                {/* <input placeholder="Enter Collection name" type="text"
                                    onChange={(e) =>
                                        setCollectionName(e.target.value)
                                    }
                                    value={collectionName}
                                /> */}
                                <ImportExcel setJSON={setJSON}></ImportExcel>

                                <h6> Total Record : {totalCount} </h6>
                                <h6> Record processed : {count} </h6>
                                <br></br><br></br>
                            </div>
                        </section>
                    </div>
                </div>
            </div >

            {/* Agent Excel import/export - End */}

        </>
    );
};

export default PGExportExcel;
