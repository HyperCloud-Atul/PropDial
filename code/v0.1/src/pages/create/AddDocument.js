import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { projectStorage, timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useDocument } from '../../hooks/useDocument'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useImageUpload } from '../../hooks/useImageUpload'
import DatePicker from 'react-datepicker';
import Avatar from '../../components/Avatar'

// styles
import './AddBill.css'
import { el } from 'date-fns/locale'

export default function AddDocument(props) {
    const { state } = useLocation()
    const { propertyid } = state
    const navigate = useNavigate()
    const { addDocument, response } = useFirestore('documents')
    const { document: property, error: propertyerror } = useDocument('properties', propertyid)
    const { document: masterDataDocumentType, error: masterDataDocumentTypeerror } = useDocument('master', 'DOCUMENTTYPE')
    const { document: propertyDocuments, error: propertyDocumentserror } = useDocument('documents', propertyid)

    // const { user } = useAuthContext()
    const { documents } = useCollection('users')
    const [users, setUsers] = useState([])
    const [file, setFile] = useState(null)
    // // form field values  
    const [documentType, setDocumentType] = useState('ALL')
    const [documentName, setDocumentName] = useState('')
    const [status, setStatus] = useState('active')
    const [formError, setFormError] = useState(null)
    const [documentTypeOptionsSorted, setdocumentTypeOptionsSorted] = useState(null);

    let documentTypeOptions;
    if (masterDataDocumentType) {
        documentTypeOptions = masterDataDocumentType.data.map(documentTypeData => ({
            label: documentTypeData.toUpperCase(),
            value: documentTypeData
        }))
    }

    // create user values for react-select
    useEffect(() => {

        if (documents) {
            setUsers(documents.map(user => {
                var userDetails = user.displayName + '(' + user.role + ')';
                return { value: { ...user, id: user.id }, label: userDetails }
            }))
        }

        if (documentTypeOptions) {
            setdocumentTypeOptionsSorted(documentTypeOptions.sort((a, b) =>
                a.label.localeCompare(b.label)
            ));
        }

    }, [documents])

    // const handleFileSelect = (event) => {
    //     const file = event.target.files[0];
    //     uploadFile(file);
    // };

    const handleFileChange = (e) => {
        setFormError(null)
        let file = e.target.files[0]
        setFile(file)
        // console.log('File:', file)
        // console.log('File name:', file.name)
        // console.log('File Type:', file.type)
        // console.log('File Size:', file.size)

        // const compressedImage = await imgUpload(file, 300, 300);
        if (file.size > 52428800) {
            setFormError('The large file is not supported')
            return
        }

        if (file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/doc' ||
            file.type === 'application/docx' ||
            file.type === 'application/xls' ||
            file.type === 'application/xlsx' ||
            file.type === 'text/plain' ||
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats - officedocument.wordprocessingml.document' ||
            file.type === 'application / vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application / vnd.openxmlformats - officedocument.spreadsheetml.sheet'

        ) {
            setFormError(null)
            return
        }
        else {
            // Invalid file type, display an error message or handle accordingly
            setFormError('The file type is not permitted')
            return
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        let uploadedFileUrl = ''

        if (file) {
            let documentName = file.name
            const uploadPath = `propertyDocuments/${propertyid}/${documentName}`
            const uploadedFile = await projectStorage.ref(uploadPath).put(file)
            uploadedFileUrl = await uploadedFile.ref.getDownloadURL()
        }

        const propertyDocument = {
            propertyid,
            documentType: documentType.label,
            documentName,
            documenturl: uploadedFileUrl,
            status
        }

        await addDocument(propertyDocument)
        if (!response.error) {
            navigate('/')
        }
    }

    return (
        <div>
            <div className='page-title'>
                <span className="material-symbols-outlined">
                    photo_camera
                </span>
                <h1>Add Document </h1>
            </div>

            <div style={{ overflow: 'hidden' }}>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="row no-gutters">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div>
                                <h1 className="owner-heading">Document Type</h1>
                                <div className="">
                                    <Select className=''
                                        onChange={(option) => setDocumentType(option)}
                                        options={documentTypeOptionsSorted}
                                        value={documentType}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                outline: 'none',
                                                background: '#eee',
                                                borderBottom: ' 1px solid var(--blue-color)'
                                            }),
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <br />
                                <h1 className="owner-heading">Document Name</h1>
                                <input
                                    required
                                    type="text"
                                    maxLength={60}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    value={documentName}
                                />
                            </div>
                            <label>
                                <div className='form-field-title'>
                                    <span className="material-symbols-outlined">
                                        photo_camera
                                    </span>
                                    <h1>Document</h1>
                                    <input
                                        type="file"
                                        accept=".pdf, .doc, .docx, .xls, .xlsx"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {!formError && <button className="btn">Add Document</button>}
                        {formError && <p className="error">{formError}</p>}
                    </div>
                    <br />
                </form>
            </div >
        </div >
    )
}

