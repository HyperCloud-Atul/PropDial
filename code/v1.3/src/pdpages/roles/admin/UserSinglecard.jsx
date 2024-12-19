import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";
import UserRoleStatusModal from "./UserRoleStatusModal";
import ImageModal from "../../imageModal/ImageModal";

const UserSinglecard = ({ users }) => {
  //   modal code start
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (userObj) => {
    console.log("userObj: ", userObj)
    setSelectedUser(userObj);
    setShow(true);
  };
  console.log("In user single card");
  //   modal code end

  // image modal code start
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [imageModalTitle, setImageModalTitle] = useState("");
  // handleImageClick to accept a title parameter
  const handleImageClick = (imageUrl, modalTitle) => {
    if (imageUrl === "/assets/img/dummy_user.png") {
      setSelectedImageUrl("/assets/img/dummy_user.png"); // Set dummy image
      setImageModalTitle(
        <span
          style={{
            fontSize: "18px",
            color: "var(--theme-red)",
          }}
        >
          🚫 No photo uploaded yet!
        </span>
      ); // Set the fallback message
    } else {
      setSelectedImageUrl(imageUrl); // Set the actual image
      setImageModalTitle(modalTitle); // Set the actual modal title
    }
    setShowImageModal(true);
  };
  // image modal code end

  // update role and status
  const { user } = useAuthContext();
  const { updateDocument } = useFirestore("users-propdial");
  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    try {
      const updatedUser = {
        ...selectedUser,
        updatedAt: new Date(),
        updatedBy: user.uid,
      };

      await updateDocument(selectedUser.id, updatedUser);
      console.log("User role and status updated successfully");
      handleClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating user role and status:", error);
      // Handle error as needed
    }
  };

  const handleRoleChange = (newRole) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      rolePropDial: newRole,
    }));
  };

  const handleStatusChange = (newStatus) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      status: newStatus,
    }));
  };
  // update role and status

  return (
    <>
      {users &&
        users.map((userObj) => (
          <div
            className={`pu_single ${userObj.status === "inactive" && "inactive"}`}
          >
            <div className="tc_single relative item">
              <div className="left">
                <div className="tcs_img_container">
                  <img
                    src={userObj.photoURL || "/assets/img/dummy_user.png"}
                    alt="Preview"
                    onClick={() =>
                      handleImageClick(
                        userObj.photoURL || "/assets/img/dummy_user.png",
                        <>
                          Here's How{" "}
                          <span
                            style={{
                              fontWeight: "500",
                              color: "var(--theme-blue)",
                            }}
                          >
                            {userObj.fullName}
                          </span>{" "}
                          Looks
                        </>
                      )
                    } // Pass dynamic title
                    className="pointer"
                  />
                </div>
                <div className="tenant_detail">              
               
                  <Link to={`/profiledetails/${userObj.id}`}
                   className="t_name pointer"
                   // onClick={() => handleShow(userObj)} click to open popup don't delete it
                   >
                  {userObj.fullName}
                  <span className="material-symbols-outlined click_icon text_near_icon">
                      edit
                    </span>
                  </Link>
                  {userObj.phoneNumber && (
                    <h6 className="t_number">
                      {userObj.phoneNumber.replace(
                        /(\d{2})(\d{5})(\d{5})/,
                        "+$1 $2-$3"
                      )}
                    </h6>
                  )}
                  {userObj.email && (
                    <h6 className="t_number">{userObj.email}</h6>
                  )}
                  <h6 className="t_number">
                    {userObj.city}, {userObj.country}
                  </h6>
                </div>
              </div>
              <div className="wha_call_icon">
                <Link
                  className="call_icon wc_single"
                  to={`tel:+${userObj.phoneNumber}`}
                  target="_blank"
                >
                  <img src="/assets/img/simple_call.png" alt="" />
                </Link>
                <Link
                  className="wha_icon wc_single"
                  to={`https://wa.me/+${userObj.phoneNumber}`}
                  target="_blank"
                >
                  <img src="/assets/img/whatsapp_simple.png" alt="" />
                </Link>
              </div>
              {userObj.status === "inactive" && (
                <div className="inactive_tag">
                  Inactive
                </div>
              )}
            </div>
            <div className="dates">
              <div className="date_single">
                <strong>On-Boarded</strong>:{" "}
                <span>{format(userObj.createdAt.toDate(), "dd-MMM-yy")}</span>
              </div>
              <div className="date_single">
                <strong>Last-Login</strong>:{" "}
                <span>
                  {format(
                    userObj.lastLoginTimestamp.toDate(),
                    "dd-MMM-yy hh:mm a"
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      <UserRoleStatusModal
        show={show}
        handleClose={handleClose}
        selectedUser={selectedUser}
        handleRoleChange={handleRoleChange}
        handleStatusChange={handleStatusChange}
        handleSaveChanges={handleSaveChanges}
      />
      <ImageModal
        show={showImageModal}
        handleClose={() => setShowImageModal(false)}
        imageUrl={selectedImageUrl}
        imageModalTitle={imageModalTitle} // Pass the dynamic title as a prop
      />
    </>
  );
};

export default UserSinglecard;
