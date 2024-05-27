import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDocument } from "../hooks/useDocument";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { projectStorage } from "../firebase/config";
import { BarLoader, BeatLoader, ClimbingBoxLoader } from 'react-spinners';

const TenantDetails = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { tenantId } = useParams();
  const fileInputRef = useRef(null);

  const [editedFields, setEditedFields] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [imageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(false); // New state for loading
  const { updateDocument, deleteDocument } = useFirestore("tenants");

  const { document, error } = useDocument("tenants", tenantId);

  useEffect(() => {
    if (document) {
      setEditedFields(document);
      setImageURL(document.tenantImgUrl);
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
      setLoading(true); // Set loading to true before uploading
      const img = await storageRef.put(file);
      const imgUrl = await img.ref.getDownloadURL();
      setImageURL(imgUrl);
      await updateDocument(tenantId, { tenantImgUrl: imgUrl });
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false); // Set loading to false after uploading
    }
  };

  const deleteTenantPhoto = async () => {
    if (imageURL) {
      const storageRef = projectStorage.refFromURL(imageURL);
      try {
        await storageRef.delete();
        await updateDocument(tenantId, { tenantImgUrl: "" });
        setImageURL(null);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
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
    <div className="tenant_detail_pg">
      <div className="top_header_pg pg_bg">
        <div className="page_spacing">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="tc_single">
                  <div className="tcs_img_container relative">
                    {loading ? (

                      <div className="loader">
                        <BeatLoader color={'#FF5733'} loading={true} />
                      </div>
                    ) : (
                      <>
                        <img
                          src={imageURL || "/assets/img/upload_img_small.png"}
                        />
                        <label htmlFor="upload" className="upload_img">
                          <input type="file" onChange={changeTenantPhoto} ref={fileInputRef} id="upload" />
                        </label>


                        {imageURL && (
                          <span
                            className="material-symbols-outlined delete_icon"
                            onClick={deleteTenantPhoto}

                          >
                            delete_forever
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="tenant_detail ">
                    <h5 className="t_name">
                      {editingField === "name" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Name"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("name")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("name")}
                            >
                              Save
                            </span>

                          </div>
                        </div>
                      ) : (
                        <>
                          {document && document.name ? document && document.name : "Name"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("name")}
                            >
                              edit
                            </span>

                          )}
                        </>
                      )}
                    </h5>
                    <h6 className="t_number">

                      {editingField === "mobile" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.mobile || ""}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            placeholder="Mobile number"
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("mobile")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("mobile")}
                            >
                              Save
                            </span>

                          </div>

                        </div>
                      ) : (
                        <>
                          {document && document.mobile ? document && document.mobile : "Mobile number"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("mobile")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="wha_call_icon">
                    <Link
                      className="call_icon wc_single"
                      to=""
                      target="_blank"
                    >
                      <img
                        src="/assets/img/simple_call.png"
                        alt=""
                      />
                    </Link>
                    <Link
                      className="wha_icon wc_single"
                      to=""
                      target="_blank"
                    >
                      <img
                        src="/assets/img/whatsapp_simple.png"
                        alt=""
                      />
                    </Link>
                  </div>

                </div>
              </div>
              <div className="col-md-8">
                <div className="tc_single">
                  <div className="tcs_single">
                    <h5>
                      On Boarding Date
                    </h5>
                    <h6>
                      {editingField === "onBoardingDate" ? (
                        <div className="edit_field">
                          <input
                            type="date"
                            value={editedFields.onBoardingDate || ""}
                            onChange={(e) =>
                              handleInputChange("onBoardingDate", e.target.value)
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("onBoardingDate")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("onBoardingDate")}
                            >
                              Save
                            </span>

                          </div>
                        </div>
                      ) : (
                        <>
                          {document && document.onBoardingDate ? document && document.onBoardingDate : "Add onborading date"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("onBoardingDate")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>
                      Off Boarding Date
                    </h5>
                    <h6>
                      {editingField === "offBoardingDate" ? (
                        <div className="edit_field">
                          <input
                            type="date"
                            value={editedFields.offBoardingDate || ""}
                            onChange={(e) =>
                              handleInputChange("offBoardingDate", e.target.value)
                            }
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("offBoardingDate")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("offBoardingDate")}
                            >
                              Save
                            </span>

                          </div>
                        </div>
                      ) : (
                        <>
                          {document && document.offBoardingDate ? document && document.offBoardingDate : "Add off borading date"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("offBoardingDate")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>Status</h5>
                    <h6>
                      {editingField === "status" ? (
                        <div className="edit_field">
                          <div className='form_field'>
                            <div className='field_box theme_radio_new'>
                              <div className="theme_radio_container">
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    value="active"
                                    checked={editedFields.status === "active"}
                                    onChange={(e) => handleInputChange("status", e.target.value)}
                                    id="active"
                                  />
                                  <label htmlFor="active">Active</label>
                                </div>
                                <div className="radio_single">
                                  <input
                                    type="radio"
                                    value="inactive"
                                    checked={editedFields.status === "inactive"}
                                    onChange={(e) => handleInputChange("status", e.target.value)}
                                    id="inactive"
                                  />
                                  <label htmlFor="inactive">Inactive</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("status")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("status")}
                            >
                              Save
                            </span>
                          </div>

                        </div>
                      ) : (
                        <>
                          {document && document.status}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("status")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>
                      Email ID
                    </h5>
                    <h6>
                      {editingField === "emailID" ? (
                        <div className="edit_field">
                          <input
                            type="email"
                            value={editedFields.emailID || ""}
                            onChange={(e) => handleInputChange("emailID", e.target.value)}
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("emailID")}
                              style={{ marginLeft: "10px" }}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("emailID")}
                            >
                              Save
                            </span>

                          </div>
                        </div>
                      ) : (
                        <>
                          {document && document.emailID ? document && document.emailID : "Email ID here"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("emailID")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                  <div className="divider"></div>
                  <div className="tcs_single">
                    <h5>
                      Address
                    </h5>
                    <h6>
                      {editingField === "address" ? (
                        <div className="edit_field">
                          <input
                            type="text"
                            value={editedFields.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                          />
                          <div className="d-flex justify-content-between">
                            <span
                              className="cancel_btn"
                              onClick={() => handleCancelClick("address")}
                            >
                              Cancel
                            </span>
                            <span
                              className="save_btn"
                              onClick={() => handleSaveClick("address")}
                            >
                              Save
                            </span>

                          </div>
                        </div>
                      ) : (
                        <>
                          {document && document.address ? document && document.address : "Address here"}
                          {!editingField && user && user.role === "admin" && (
                            <span
                              className="material-symbols-outlined click_icon text_near_icon"
                              onClick={() => handleEditClick("address")}
                            >
                              edit
                            </span>
                          )}
                        </>
                      )}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            {!editingField && user && user.role === "admin" && (
              <>
                <div className="vg22"></div>
                <div className="divider"></div>
                <div className="vg10"></div>
                <div onClick={deleteTenant} className="delete_bottom">
                  <span className="material-symbols-outlined">delete</span>
                  <span>Delete Tenant</span>
                </div>
                <div className="vg22"></div></>
            )}
            {/* <div>
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
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("idNumber")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div>       */}


            {/* <div>
            Rent Start Date:
            {editingField === "rentStartDate" ? (
              <div>
                <input
                  type="date"
                  value={editedFields.rentStartDate || ""}
                  onChange={(e) =>
                    handleInputChange("rentStartDate", e.target.value)
                  }
                />
                <div className="d-flex">
                  <button
                    className="product_edit_save_btn"
                    onClick={() => handleSaveClick("rentStartDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_save_btn cancel-btn"
                    onClick={() => handleCancelClick("rentStartDate")}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {document && document.rentStartDate}
                {!editingField && user && user.role === "admin" && (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("rentStartDate")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div> */}
            {/* <div>
            Rent End Date:
            {editingField === "rentEndDate" ? (
              <div>
                <input
                  type="date"
                  value={editedFields.rentEndDate || ""}
                  onChange={(e) => handleInputChange("rentEndDate", e.target.value)}
                />
                <div className="d-flex">
                  <button
                    className="product_edit_save_btn"
                    onClick={() => handleSaveClick("rentEndDate")}
                  >
                    Save
                  </button>
                  <button
                    className="product_edit_save_btn cancel-btn"
                    onClick={() => handleCancelClick("rentEndDate")}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {document && document.rentEndDate}
                {!editingField && user && user.role === "admin" && (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleEditClick("rentEndDate")}
                  >
                    edit
                  </span>
                )}
              </>
            )}
          </div> */}
          </div>



        </div>
      </div>



    </div>
  );
};

export default TenantDetails;
