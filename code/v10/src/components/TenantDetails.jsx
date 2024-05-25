import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { useDocument } from "../hooks/useDocument";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { projectStorage } from "../firebase/config";
const TenantDetails = () => {
  // Scroll to the top of the page whenever the location changes
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tenantId } = useParams();
  const fileInputRef = useRef(null); // Create a ref for the file input

  const [editedFields, setEditedFields] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [imageURL, setImageURL] = useState();
  const { updateDocument, deleteDocument } = useFirestore("tenants");

  const { document, error } = useDocument("tenants", tenantId);

  useEffect(() => {
    if (document) {
      setEditedFields(document);
    }
  }, [document]);

  const handleEditClick = (fieldName) => {
    setEditingField(fieldName);
  };
  const deleteTenant = async () => {
    try {
      await deleteDocument(tenantId);
      navigate("/properties");
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };
  const handleSaveClick = async (fieldName) => {
    try {
      await updateDocument(tenantId, { [fieldName]: editedFields[fieldName] });
      setEditingField(null);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };
  const changeTenantPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPath = `tenantPhoto/${tenantId}/${file.name}`;
    const storageRef = projectStorage.ref(uploadPath);

    try {
      const img = await storageRef.put(file);
      const imgUrl = await img.ref.getDownloadURL();
      setImageURL(imgUrl);
      await updateDocument(tenantId, { tenantImgUrl: imgUrl });
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleCancelClick = (fieldName) => {
    setEditedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: document[fieldName],
    }));
    setEditingField(null);
  };
  const handleInputChange = (fieldName, value) => {
    setEditedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  return (
    <div>
      <div style={{ marginTop: "100px" }}>
        <img
          src={imageURL || (document && document.tenantImgUrl)}
          style={{ width: "200px", height: "auto" }}
        />
        <input type="file" onChange={changeTenantPhoto} ref={fileInputRef} />
      </div>
      <div>
        Name:
        {editingField === "name" ? (
          <div>
            <input
              type="text"
              value={editedFields.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("name")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("name")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.name}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("name")}
              />
            )}
          </>
        )}
      </div>
      <div>
        Address:
        {editingField === "address" ? (
          <div>
            <input
              type="text"
              value={editedFields.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("address")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("address")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.address}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("address")}
              />
            )}
          </>
        )}
      </div>
      <div>
        ID Number:
        {editingField === "idNumber" ? (
          <div>
            <input
              type="text"
              value={editedFields.idNumber || ""}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("idNumber")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("idNumber")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.idNumber}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("idNumber")}
              />
            )}
          </>
        )}
      </div>
      <div>
        Mobile:
        {editingField === "mobile" ? (
          <div>
            <input
              type="text"
              value={editedFields.mobile || ""}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("mobile")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("mobile")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.mobile}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("mobile")}
              />
            )}
          </>
        )}
      </div>
      <div>
        Onboarding Date:
        {editingField === "onBoardingDate" ? (
          <div>
            <input
              type="date"
              value={editedFields.onBoardingDate || ""}
              onChange={(e) =>
                handleInputChange("onBoardingDate", e.target.value)
              }
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("onBoardingDate")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("onBoardingDate")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.onBoardingDate}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("onBoardingDate")}
              />
            )}
          </>
        )}
      </div>
      <div>
        Offboarding Date:
        {editingField === "offBoardingDate" ? (
          <div>
            <input
              type="date"
              value={editedFields.offBoardingDate || ""}
              onChange={(e) =>
                handleInputChange("offBoardingDate", e.target.value)
              }
            />
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("offBoardingDate")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("offBoardingDate")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.offBoardingDate}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("offBoardingDate")}
              />
            )}
          </>
        )}
      </div>
      <div>
        Status:
        {editingField === "status" ? (
          <div>
            <select
              value={editedFields.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="d-flex">
              <button
                className="product_edit_save_btn"
                onClick={() => handleSaveClick("status")}
              >
                Save
              </button>
              <button
                className="product_edit_save_btn cancel-btn"
                onClick={() => handleCancelClick("status")}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {document && document.status}
            {!editingField && user && user.role === "admin" && (
              <FaEdit
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "var(--pink)",
                }}
                onClick={() => handleEditClick("status")}
              />
            )}
          </>
        )}
      </div>
      <div onClick={deleteTenant}>
        {" "}
        <span className="material-symbols-outlined">delete</span>
      </div>{" "}
    </div>
  );
};

export default TenantDetails;
