import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { timestamp } from "../../firebase/config";
import InactiveUserCard from "../../components/InactiveUserCard";

const AddNotification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { notificationid } = useParams();
  
  const [formError, setFormError] = useState(null);
  const { addDocument, response: addDocumentResponse } = useFirestore("notifications-propdial");
  const { updateDocument, response: updateDocumentResponse } = useFirestore("notifications-propdial");
  
  const [notificationFields, setNotificationFields] = useState({
    Type: "app updates",
    ShortDescription: "",
    Description: "",
    To: "all",
    status: "active",
    seenBy: [],  // Tracks which users have seen this notification
  });

  // Scroll to the top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const notification = {
      type: notificationFields.Type || "app updates",
      shortDescription: notificationFields.ShortDescription || "",
      description: notificationFields.Description || "",
      to: notificationFields.To || "all",
    };

    if (notificationid === "new") {
      // New Notification: Initialize seenBy array for tracking viewed users
      const newNotification = {
        ...notification,
        status: "active",
        postedBy: "propdial",
        seenBy: [], // no user has seen it yet
      };

      await addDocument(newNotification);

      if (addDocumentResponse.error) {
        navigate("/");
      } else {
        navigate("/notification");
      }
    } else {
      // Update Notification
      const updatedNotification = {
        ...notification,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user ? user.phoneNumber : "guest",
      };

      await updateDocument(notificationid, updatedNotification);

      if (updateDocumentResponse.error) {
        navigate("/");
      } else {
        navigate("/notification");
      }
    }
  };

  return (
    <>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg">
          <div className="page_spacing pg_min_height">
            <div className="pg_header">
              <h2 className="m22 mb-1">Add Notification</h2>
              <h4 className="r18 light_black">
                You can add all types of notification here
              </h4>
            </div>
            <div className="vg22"></div>
            <div className="add_notification_form regular_card">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form_field">
                      <label className="no-floating" htmlFor="">
                        Notification type
                      </label>
                      <div className="form_field_inner">
                        <select
                          value={notificationFields.Type}
                          onChange={(e) =>
                            setNotificationFields({
                              ...notificationFields,
                              Type: e.target.value,
                            })
                          }
                        >
                          <option value="" defaultValue>
                            Select notification type
                          </option>
                          <option value="App Updates">App Updates</option>
                          <option value="Discount">Discount</option>
                          <option value="Offer">Offer</option>
                        </select>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            notifications
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ff_gap"></div>
                  </div>
                  <div className="col-md-6">
                    <div className="form_field">
                      <label htmlFor="">Title</label>
                      <div className="form_field_inner">
                        <input
                          required
                          type="text"
                          maxLength={70}
                          placeholder="Heading for notification"
                          onChange={(e) =>
                            setNotificationFields({
                              ...notificationFields,
                              ShortDescription: e.target.value,
                            })
                          }
                          value={notificationFields.ShortDescription}
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            description
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ff_gap"></div>
                  </div>
                  <div className="col-md-12">
                    <div className="form_field">
                      <label htmlFor="">Description</label>
                      <div className="form_field_inner">
                        <textarea
                          required
                          placeholder="Write something about notification"
                          onChange={(e) =>
                            setNotificationFields({
                              ...notificationFields,
                              Description: e.target.value,
                            })
                          }
                          value={notificationFields.Description}
                        ></textarea>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">
                            description
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-md-4 text-center top_margin">
                    <div className="ff_gap"></div>
                    <button
                      type="submit"
                      className="theme_btn btn_fill no_icon full_width"
                    >
                      {notificationid === "new"
                        ? "Add Notification"
                        : "Update Notification"}
                    </button>
                    {formError && <p className="error">{formError}</p>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </>
  );
};

export default AddNotification;
