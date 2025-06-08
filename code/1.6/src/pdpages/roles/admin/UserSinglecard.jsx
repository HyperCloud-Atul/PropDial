import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useFirestore } from "../../../hooks/useFirestore";
import { useAuthContext } from "../../../hooks/useAuthContext";
import UserRoleStatusModal from "./UserRoleStatusModal";
import ImageModal from "../../imageModal/ImageModal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import formatCountry from "../../../utils/formatCountry";
import UserCardItem from "./UserCardItem";
const UserSinglecard = ({ users }) => {
  //   modal code start
  const [selectedUser, setSelectedUser] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (userObj) => {
    console.log("userObj: ", userObj);
    setSelectedUser(userObj);
    setShow(true);
  };
  // console.log("In user single card");
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
        updatedBy: user.phoneNumber,
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
     {users && users.map((userObj) => <UserCardItem key={userObj.id} userObj={userObj} handleImageClick={handleImageClick} />)}

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
