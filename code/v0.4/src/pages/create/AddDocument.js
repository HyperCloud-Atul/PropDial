import { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { projectStorage, timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useDocument } from "../../hooks/useDocument";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useImageUpload } from "../../hooks/useImageUpload";
import DatePicker from "react-datepicker";
import Avatar from "../../Components/Avatar";

// styles
import "./AddBill.css";
import { el } from "date-fns/locale";

export default function AddDocument(props) {
  const { state } = useLocation();
  const { propertyid } = state;
  const navigate = useNavigate();
  const { addDocument, response } = useFirestore("documents");
  // const { document, error } = useDocument('properties', propertyid)
  const { document: property, error: propertyerror } = useDocument(
    "properties",
    propertyid
  );
  const {
    document: masterDataDocumentType,
    error: masterDataDocumentTypeerror,
  } = useDocument("master", "DOCUMENTTYPE");
  const { document: propertyDocuments, error: propertyDocumentserror } =
    useDocument("documents", ["propertyid", "==", propertyid]);

  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { imgUpload, isImgCompressPending, imgCompressedFile } =
    useImageUpload();
  // const [toggleFlag, setToggleFlag] = useState(false)

  // form field values
  const [documentType, setDocumentType] = useState("ALL");
  const [documentName, setDocumentName] = useState("");
  const [status, setStatus] = useState("active");
  const [formError, setFormError] = useState(null);
  const [documentTypeOptionsSorted, setdocumentTypeOptionsSorted] =
    useState(null);

  let documentTypeOptions;
  if (masterDataDocumentType) {
    documentTypeOptions = masterDataDocumentType.data.map(
      (documentTypeData) => ({
        label: documentTypeData.toUpperCase(),
        value: documentTypeData,
      })
    );
  }

  // create user values for react-select
  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => {
          var userDetails = user.displayName + "(" + user.role + ")";
          // console.log('userDetails:', userDetails)
          return { value: { ...user, id: user.id }, label: userDetails };
        })
      );
    }

    if (documentTypeOptions) {
      setdocumentTypeOptionsSorted(
        documentTypeOptions.sort((a, b) => a.label.localeCompare(b.label))
      );
    }
  }, [documents]);

  const handleFileChange = async (e) => {
    setThumbnail(null);
    let file = e.target.files[0];
    // console.log('file original selected:', file)
    // console.log('file size original selected:', file.size)
    // const image = await resizeFile(file);
    // const newImageFile = dataURIToBlob(image);

    const compressedImage = await imgUpload(file, 300, 300);
    // console.log('imgCom compressed in Signup.js', compressedImage);
    // console.log('imgCom size after compressed in Signup.js', compressedImage.size);

    if (!compressedImage) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!compressedImage.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    // if (newImageFile.size > 20000000) {
    //   setThumbnailError('Image file size must be less than 20mb')
    //   return
    // }

    setThumbnailError(null);
    setThumbnail(compressedImage);
    console.log("thumbnail updated");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    let imgUrl = "";
    if (thumbnail) {
      // console.log('thumbnail in useSignup 2:', thumbnail)
      let documentName = propertyDocuments.length + 1 + ".png";
      const uploadPath = `propertyDocuments/${propertyid}/${documentName}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      imgUrl = await img.ref.getDownloadURL();
    }

    const propertyDocument = {
      propertyid,
      documentType: documentType.label,
      documentName,
      documenturl: imgUrl,
      status,
    };

    await addDocument(propertyDocument);
    if (!response.error) {
      navigate("/");
    }
  };

  return (
    <div>
      <div className="page-title">
        <span className="material-symbols-outlined">photo_camera</span>
        <h1>Add Document </h1>
      </div>

      <div style={{ overflow: "hidden" }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="row no-gutters">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div>
                <h1 className="owner-heading">Document Type</h1>
                <div className="">
                  <Select
                    className=""
                    onChange={(option) => setDocumentType(option)}
                    options={documentTypeOptionsSorted}
                    value={documentType}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        outline: "none",
                        background: "#eee",
                        borderBottom: " 1px solid var(--theme-blue)",
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
                <div className="form-field-title">
                  <span className="material-symbols-outlined">
                    photo_camera
                  </span>
                  <h1>Document Photo</h1>
                  <input type="file" onChange={handleFileChange} />
                </div>

             
             
              </label>
            </div>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="btn">Add Document</button>
            {formError && <p className="error">{formError}</p>}
          </div>
          <br />
        </form>
      </div>
    </div>
  );
}
