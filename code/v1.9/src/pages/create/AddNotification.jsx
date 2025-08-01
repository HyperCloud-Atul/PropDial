import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { timestamp, projectFirestore } from "../../firebase/config";
import { useNavigate, useParams } from "react-router-dom";
import InactiveUserCard from "../../components/InactiveUserCard";
const AddNotification = () => {
  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const { notificationid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [formError, setFormError] = useState(null);
  const { addDocument, response: addDocumentResponse } =
    useFirestore("notifications-propdial");
  const { updateDocument, response: updateDocumentResponse } =
    useFirestore("notifications-propdial");

  const [notificationFields, setNotificationFields] = useState({
    Type: "app updates",
    ShortDescription: "",
    Description: "",
    To: "all",
    status: "active",
    seenBy: [],  // Tracks which users have seen this notification
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    let errorFlag = false;
    let errorMsg = "Please select ";
    // if (state.value === 'Select State') {
    //   errorMsg = errorMsg + 'state'
    //   errorFlag = true
    // }

    const notification = {
      type: notificationFields.Type ? notificationFields.Type : "app updates",
      shortDescription: notificationFields.ShortDescription
        ? notificationFields.ShortDescription
        : "",
      description: notificationFields.Description
        ? notificationFields.Description
        : "",
      to: notificationFields.To ? notificationFields.To : "all",
    };
    console.log("Notificationid:", notificationid);
    if (notificationid === "new") {
      const newNotification = {
        ...notification,
        status: "active",
        postedBy: "propdial",
        viewedBy: [],
      };
      console.log("newNotification:", newNotification);
      if (!errorFlag) {
        await addDocument(newNotification);
        if (addDocumentResponse.error) {
          navigate("/");
        } else {
          navigate("/notification");
        }
      }
    } else if (notificationid !== "new") {

      const updatedNotification = {
        ...notification,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy: user.phoneNumber,
      };

      if (!errorFlag) {
        // await updateDocument(notificationid, updatedNotification)

        if (updateDocumentResponse.error) {
          navigate("/");
        } else {
          navigate("/notification");
        }
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
                          name=""
                          id=""
                          value={notificationFields && notificationFields.Type}
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
                          <option
                            defaultValue={
                              notificationFields &&
                                notificationFields.Type === "App Updates"
                                ? true
                                : false
                            }
                          >
                            App Updates
                          </option>
                          <option
                            defaultValue={
                              notificationFields &&
                                notificationFields.Type === "Discount"
                                ? true
                                : false
                            }
                          >
                            Discount
                          </option>
                          <option
                            defaultValue={
                              notificationFields &&
                                notificationFields.Type === "Offer"
                                ? true
                                : false
                            }
                          >
                            Offer
                          </option>
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
                          value={
                            notificationFields &&
                            notificationFields.ShortDescription
                          }
                        />
                        <div className="field_icon">
                          <span className="material-symbols-outlined">description</span>
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
                          type="text"
                          // maxLength={300}
                          placeholder="Write something about notification"
                          onChange={(e) =>
                            setNotificationFields({
                              ...notificationFields,
                              Description: e.target.value,
                            })
                          }
                          value={
                            notificationFields && notificationFields.Description
                          }
                        ></textarea>
                        <div className="field_icon">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-8"></div>
                  <div className="col-md-4 text-center top_margin">
                    <div className="ff_gap"></div>
                    <button type="submit" className="theme_btn btn_fill no_icon full_width">
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
