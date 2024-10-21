import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import { useDocument } from '../hooks/useDocument';
import { format, isSameDay } from "date-fns";
import { projectStorage, projectFirestore } from "../firebase/config";
import {
    BarLoader,
    BeatLoader,
    BounceLoader,
    CircleLoader,
    ClimbingBoxLoader,
    ClipLoader,
    ClockLoader,
    DotLoader,
    FadeLoader,
    GridLoader,
    HashLoader,
    MoonLoader,
    PacmanLoader,
    PropagateLoader,
    PuffLoader,
    PulseLoader,
    RingLoader,
    RiseLoader,
    RotateLoader,
    ScaleLoader,
    SyncLoader
} from "react-spinners";
import QuickAccessMenu from "../pdpages/quickAccessMenu/QuickAccessMenu";
import SureDelete from "../pdpages/sureDelete/SureDelete";

const PropertyInspectionDocuments = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes start
    const { propertyId } = useParams();
    const navigate = useNavigate();

    const { addDocument, updateDocument, deleteDocument, error } = useFirestore("propertyinspections");
    const { documents: inspections, errors: inspectionsError } = useCollection("propertyinspections",
        ["propertyId", "==", propertyId],
        ["createdAt", "desc"]);

    console.log("inspections: ", inspections)

    const todaydt = new Date();
    const formattedTodayDate = format(todaydt, 'd MMM, yyyy');
    console.log('formattedTodayDate: ', formattedTodayDate)

    const [inspectionDate, setInspectionDate] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [filterDate, setFilterDate] = useState("");
    const [inspectionSortedDates, setInspectionSortedDates] = useState("");
    const [uniqueDates, setUniqueDates] = useState([]);
    const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);
    const [showNextInspectionDateForm, setNextInsectionDateForm] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [documentFile, setDocumentFile] = useState(null);
    const [uploadingDocId, setUploadingDocId] = useState(null);
    const [uploadingDocTag, setUploadingDocTag] = useState(null);
    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [inspectionId, setInspectionId] = useState(null);
    const [isInspectionDelete, setIsInspectionDelete] = useState(false);

    const [isUploading, setIsUploading] = useState(false); // New state for the loader   
    const [uploadingDocName, setUploadingDocName] = useState(null);

    const handleChangeInspectionDate = (event) => {
        // console.log("handleChangeInspectionDate: ", event.target.value)
        const selectedInspectiondt = new Date(event.target.value)
        console.log("selectedInspectiondt: ", selectedInspectiondt)
        const formateddt = format(selectedInspectiondt, "dd MMMM, yyyy")
        console.log("formateddt selectedInspectiondt: ", formateddt)
        // setInspectionDate(event.target.value);
        setInspectionDate(formateddt);
    }
    const handleChangeFilterDate = (event) => {

        console.log('event.target.value: ', event.target.value)

        setFilterDate(event.target.value);
    }
    const handleChangeDocumentName = (event) => setDocumentName(event.target.value);

    // const handleFileChange = (event) => setDocumentFile(event.target.files[0]);

    const handleFileChange = (event, docId, docName, docTag) => {
        console.log('docId: ', docId)
        console.log('docName: ', docName)

        const file = event.target.files[0];
        if (file) {
            setDocumentFile(file);
            setUploadingDocId(docId);
            setUploadingDocTag(docTag);
            setUploadingDocName(docName)
        }
    };

    useEffect(() => {
        if (uploadingDocId && documentFile) {
            uploadDocumentImage();
        }
    }, [uploadingDocId, documentFile]);

    useEffect(() => {
        if (inspections) {
            // const dates = [...new Set(inspections.map(doc => doc.inspectionDate))].sort((a, b) => new Date(b) - new Date(a));
            const dates = [...new Set(inspections.map(doc => doc.inspectionDate))];
            console.log('dates: ', dates)
            setInspectionSortedDates(dates)

            dates.length > 1 ? setInspectionDate(dates[dates.length - 1]) : setInspectionDate(dates[0])

            // setUniqueDates(dates);
            setFilterDate(prevFilterDate => (dates.includes(prevFilterDate) ? dates[0] : prevFilterDate || ""));

        }
    }, [inspections]);

    //Today's date
    // const todayDate = new Date()
    // console.log('todays Date:', todayDate)
    // const filteredInspections = inspections ? inspections.filter(doc => doc.nextInspectionDate !== "") : [];

    const filteredInspections = inspections ? inspections.filter(doc => doc.inspectionDate === filterDate) : [];
    // const filteredInspections = inspections ? inspections.filter(doc => isSameDay((new Date(inspections && inspections[0].inspectionDate.seconds * 1000)), (new Date(filterDate.seconds * 1000)))) : [];

    console.log("filteredInspections: ", filteredInspections)

    const getFileType = (file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return fileExtension === "pdf" ? "pdf" : "image";
    };

    const addInspection = async () => {
        if (!inspectionDate) {
            alert("Inspection date is required!");
            return;
        }
        try {
            setIsAdding(true);
            await addDocument({
                inspectionDate,
                propertyId,
            });
            setInspectionDate("");
            setIsAdding(false);
            setFilterDate(inspectionDate); // Set filterDate to the new inspection date
        } catch (error) {
            console.error("Error adding inspection:", error);
            setIsAdding(false);
        }
    };

    const addDocumentToInspection = async () => {
        if (!documentName) {
            alert("Document name is required!");
            return;
        }

        const selectedInspection = inspections.find(doc => doc.inspectionDate === filterDate);
        console.log('selectedInspection: ', selectedInspection)

        if (!selectedInspection) {
            alert("No inspection found for the selected date!");
            return;
        }

        try {
            await updateDocument(selectedInspection.id, {
                documents: [
                    ...(selectedInspection.documents || []),
                    { name: documentName, url: "", mediaType: "", tag: documentName + new Date(), addedDate: new Date(), inspectionDate: selectedInspection.inspectionDate }
                ]
            });
            setDocumentName("");
            setShowAddDocumentForm(false);
        } catch (error) {
            console.error("Error adding document to inspection:", error);
        }
    };

    const uploadDocumentImage = async () => {
        if (!documentFile) {
            alert("Please select a file to upload!");
            return;
        }
        try {
            const fileType = getFileType(documentFile);
            const storageRef = projectStorage.ref(`inspectionDocs/${uploadingDocId}/${documentFile.name}`);
            await storageRef.put(documentFile);

            const fileURL = await storageRef.getDownloadURL();
            console.log('file storage URL: ', fileURL)
            let updatedDocuments;
            const docRef = projectFirestore.collection('inspection').doc(uploadingDocId); // Replace 'user-id' with the actual document ID
            const doc = await docRef.get();
            if (doc.exists) {
                console.log('doc Data: ', doc.data())
                updatedDocuments = doc.data().documents.map(doc =>
                    doc.tag === uploadingDocTag ? { ...doc, url: fileURL, mediaType: fileType } : doc
                );
            }
            console.log('updatedDocuments: ', updatedDocuments)
            await updateDocument(uploadingDocId, {
                documents: updatedDocuments,
            });

            setDocumentFile(null);
            setUploadingDocId(null);
            setUploadingDocName(null);
            setUploadingDocTag(null);
            // fileInputRef .current.value = "";
        } catch (error) {
            console.error("Error uploading document image:", error);
            setUploadingDocId(null);
            setUploadingDocName(null);
            setUploadingDocTag(null);
        }
    };

    const confirmDeleteInspection = (docId) => {
        setInspectionId(docId);
        setIsInspectionDelete(true);
        setShowModal(true);
    };

    const deleteInspection = async () => {
        if (!inspectionId) return;

        try {
            await deleteDocument(inspectionId);
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting inspection:", error);
        }
    };

    const deleteDocumentFromInspection = async () => {
        if (!inspectionId || !docToDelete) return;

        try {
            const selectedInspection = inspections.find(doc => doc.id === inspectionId);
            const updatedDocuments = selectedInspection.documents.filter(doc => doc !== docToDelete);

            await updateDocument(inspectionId, {
                documents: updatedDocuments,
            });
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting document from inspection:", error);
        }
    };

    const handleShowModal = (docId, document) => {
        setInspectionId(docId);
        setDocToDelete(document);
        setIsInspectionDelete(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDocToDelete(null);
        setInspectionId(null);
        setIsInspectionDelete(false);
    };




    // 9 dots controls
    const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
    const openMoreAddOptions = () => {
        setHandleMoreOptionsClick(true);
    };
    const closeMoreAddOptions = () => {
        setHandleMoreOptionsClick(false);
    };
    // 9 dots controls


    // data of quick access menu  start  
    const menuItems = [
        { name: 'Dashboard', link: '/dashboard', icon: '/assets/img/icons/qa_dashboard.png' },
        { name: 'Property', link: '/propertydetails/' + propertyId, icon: '/assets/img/icons/qa_property.png' },
    ];
    // data of quick access menu  end




    return (
        <div className="top_header_pg pg_bg property_docs_pg">
            <div className="page_spacing">
                {/* 9 dots html  */}
                <div
                    onClick={openMoreAddOptions}
                    className="property-list-add-property"
                >
                    <span className="material-symbols-outlined">apps</span>
                </div>
                <div
                    className={
                        handleMoreOptionsClick
                            ? "more-add-options-div open"
                            : "more-add-options-div"
                    }
                    onClick={closeMoreAddOptions}
                    id="moreAddOptions"
                >
                    <div className="more-add-options-inner-div">
                        <div className="more-add-options-icons">
                            <h1>Close</h1>
                            <span className="material-symbols-outlined">close</span>
                        </div>

                        <Link to="" className="more-add-options-icons">
                            <h1>Property Image</h1>
                            <span className="material-symbols-outlined">location_city</span>
                        </Link>

                        <Link to="" className="more-add-options-icons">
                            <h1>Property Document</h1>
                            <span className="material-symbols-outlined">
                                holiday_village
                            </span>
                        </Link>

                        <Link to="" className="more-add-options-icons">
                            <h1>Property Report</h1>
                            <span className="material-symbols-outlined">home</span>
                        </Link>
                        <Link to="" className="more-add-options-icons">
                            <h1>Property Bills</h1>
                            <span className="material-symbols-outlined">home</span>
                        </Link>
                    </div>
                </div>
                <QuickAccessMenu menuItems={menuItems} />
                <hr />
                <div className="pg_header d-flex align-items-center justify-content-between">
                    <div className="left">
                        <h2 className="m22 mb-1">Property Inspection Documents</h2>
                        <h4 className="r16 light_black">
                            Date wise all porperty inspection document are here
                        </h4>
                    </div>
                    <div className="right">

                    </div>
                </div>
                <div className="vg22"></div>
                <div className="add_select_date">



                    <section className="my_big_card selected_date">
                        <div>Inspection Due Date:
                            <h2 class="card_title mb-0">{inspectionDate} {inspectionSortedDates[0]} </h2>
                            {/* <h2 class="card_title mb-0">{filterDate && format((new Date(
                                filterDate.seconds * 1000
                            )), "dd MMMM, yyyy")}</h2> */}
                            {/* {filteredInspections && filteredInspections.map((doc) => (
                                <h2 class="card_title mb-0" key={doc.id}>
                                    {new Date(doc.inspectionDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).replace(/ /g, '-')}
                                </h2>
                            ))} */}
                            <div className="vg12"></div>
                            {(new Date(inspectionDate) >= (new Date(formattedTodayDate))) && (new Date(inspectionSortedDates[0]) <= (new Date(formattedTodayDate))) && (<button className="theme_btn btn_fill" onClick={() => {
                                setShowAddDocumentForm(true)
                                setNextInsectionDateForm(false)
                            }} >
                                Add Document
                            </button>)}
                            {(new Date(inspectionDate) <= (new Date(formattedTodayDate))) &&
                                (new Date(inspectionSortedDates[0]) <= (new Date(formattedTodayDate)))
                                && (<button className="theme_btn btn_fill" onClick={() => {
                                    setNextInsectionDateForm(true)
                                    setShowAddDocumentForm(false)

                                }} >
                                    Set Next Inspection Date
                                </button>)}
                        </div>
                    </section>
                    {showAddDocumentForm && (
                        <section className="my_big_card">
                            <h2 class="card_title">Add document</h2>
                            <div className="inner">
                                <input
                                    type="text"
                                    id="documentName"
                                    value={documentName}
                                    onChange={handleChangeDocumentName}
                                    placeholder="Document name"
                                />
                                <button className="theme_btn btn_fill" onClick={addDocumentToInspection} >
                                    Add Document
                                </button>
                            </div>
                        </section>
                    )}
                    {showNextInspectionDateForm && (<section className="my_big_card">
                        <h2 class="card_title">Add Next Inspection date</h2>
                        <div className="inner">
                            <input
                                type="date"
                                id="inspectionDate"
                                value={inspectionDate}
                                onChange={handleChangeInspectionDate}
                            />
                            <button className="theme_btn btn_fill" onClick={addInspection} disabled={isAdding}>
                                {isAdding ? "Adding..." : "Add Inspection"}
                            </button>
                        </div>
                    </section>)}
                </div>
                <div>
                    Next Inspection Date: {inspectionSortedDates.length > 1 ? inspectionSortedDates[0] : "Not Available"}
                </div>

                <hr></hr>
                <div>
                    {/* <section className="my_big_card"> */}
                    <h2 class="card_title">Inspections Documents</h2>
                    <div className="inner">
                        <select id="filterDate" value={filterDate} onChange={handleChangeFilterDate}>
                            {inspections && inspections.map(doc => (
                                <option key={doc.inspectionDate} value={doc.inspectionDate}>
                                    {doc.inspectionDate}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* </section> */}
                </div>

                <div className="blog_sect">
                    <div className="">
                        {filteredInspections && filteredInspections.map((doc) => (
                            <div key={doc.id} className="row">
                                {doc.documents && doc.documents.map((document, index) => (
                                    <div key={index} className="col-md-4">
                                        <div className="item card-container">
                                            <div className="card-image relative">

                                                {uploadingDocId === doc.id && uploadingDocTag === document.tag ? (
                                                    ""
                                                ) : (
                                                    <label
                                                        htmlFor={`upload_img_${document.tag}`}
                                                        className="upload_img click_text by_text"
                                                    >
                                                        Upload image or pdf
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileChange(e, doc.id, document.name, document.tag)}
                                                            ref={fileInputRef}
                                                            id={`upload_img_${document.tag}`}
                                                        // name={document.name}
                                                        />
                                                    </label>
                                                )}

                                                {uploadingDocId === doc.id && uploadingDocTag === document.tag ? (
                                                    <div
                                                        className="loader d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}>
                                                        <BeatLoader color={"#FF5733"} loading={true} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {document.mediaType && document.mediaType === "pdf" ? (
                                                            <iframe
                                                                title="PDF Viewer"
                                                                src={document.url}
                                                                style={{ width: "100%", aspectRatio: "3/2" }}
                                                            ></iframe>
                                                        ) : (
                                                            <img
                                                                src={document.url}
                                                                alt="Document"
                                                                style={{ width: "100%", aspectRatio: "3/2" }}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div className="card-body">
                                                <h3>{document.name}</h3>
                                                <h6>Document Added Timestamp: <br></br>  {format((new Date(
                                                    document.addedDate.seconds * 1000
                                                )), "dd MMMM, yyyy HH:mm a")}</h6>
                                                <h6>against Inspection Date: {document.inspectionDate} </h6>

                                                <div className="card-author">
                                                    <div onClick={() => handleShowModal(doc.id, document)} className="learn-more pointer">
                                                        Delete
                                                    </div>
                                                    <SureDelete
                                                        show={showModal && docToDelete === document && !isInspectionDelete}
                                                        handleClose={handleCloseModal}
                                                        handleDelete={deleteDocumentFromInspection}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {inspectionsError && <p>Error loading inspections: {inspectionsError}</p>}
                    </div>
                </div>

                <div className="delete_document">
                    {filteredInspections && filteredInspections.map((doc) => (
                        <React.Fragment key={doc.id}>
                            <div className="vg22"></div>
                            <div className="divider"></div>
                            <div className="vg10"></div>
                            <div className="delete_bottom" onClick={() => confirmDeleteInspection(doc.id)}>
                                <span className="material-symbols-outlined">delete</span>
                                <span>Delete (all document of date {new Date(doc.inspectionDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).replace(/ /g, '-')} )</span>
                            </div>
                            <div className="vg22"></div>
                        </React.Fragment>
                    ))}
                </div>

                <SureDelete
                    show={showModal && isInspectionDelete}
                    handleClose={handleCloseModal}
                    handleDelete={deleteInspection}
                />

            </div>
        </div>



    );
};

export default PropertyInspectionDocuments;
