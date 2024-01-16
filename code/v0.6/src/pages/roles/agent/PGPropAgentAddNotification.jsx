import React from "react";
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useCollection } from '../../../hooks/useCollection'
import { useFirestore } from '../../../hooks/useFirestore'
import { timestamp, projectFirestore } from '../../../firebase/config'
import { useNavigate, useParams } from 'react-router-dom'
// import SearchBarAutoComplete from '../../search/SearchBarAutoComplete'

const PGPropAgentAddNotification = () => {

  const { notificationid } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  // Scroll to the top of the page whenever the location changes start
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  // Scroll to the top of the page whenever the location changes end

  const [formError, setFormError] = useState(null)

  // const { documents: dbUserDocuments, error: dbUserDocumentserror } =
  //   useCollection("users", ["role", "==", "propagent"]);

  // const [searchedUser, setSearchedUser] = useState('')

  // console.log('users:', dbUserDocuments)

  // const activeUserList =
  //   // user &&
  //   // user.uid &&
  //   dbUserDocuments &&
  //   dbUserDocuments.filter((item) => item.status === 'active');
  // console.log('activeUserList:', activeUserList)

  // 9 dots controls
  const [handleMoreOptionsClick, setHandleMoreOptionsClick] = useState(false);
  const openMoreAddOptions = () => {
    setHandleMoreOptionsClick(true);
  };
  const closeMoreAddOptions = () => {
    setHandleMoreOptionsClick(false);
  };
  // 9 dots controls

  const { addDocument, response: addDocumentResponse } = useFirestore('notifications')
  const { updateDocument, response: updateDocumentResponse } = useFirestore('notifications')

  const [notificationFields, setNotificationFields] = useState({
    Type: 'app updates',
    ShortDescription: '',
    Description: '',
    To: 'all'
  });

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    let errorFlag = false
    let errorMsg = 'Please select '
    // if (state.value === 'Select State') {
    //   errorMsg = errorMsg + 'state'
    //   errorFlag = true
    // }

    const notification = {
      type: notificationFields.Type ? notificationFields.Type : 'app updates',
      shortDescription: notificationFields.ShortDescription ? notificationFields.ShortDescription : '',
      description: notificationFields.Description ? notificationFields.Description : '',
      to: notificationFields.To ? notificationFields.To : 'all',
    }

    if (notificationid === 'new') {
      const newNotification = {
        ...notification,
        status: 'active',
        postedBy: 'propagent'
      }
      console.log('newNotification:', newNotification)
      if (!errorFlag) {
        await addDocument(newNotification)
        if (addDocumentResponse.error) {
          navigate('/')
        }
        else {
          navigate("/propagentnotification");
        }
      }
    }
    else if (notificationid !== 'new') {

      const updatedBy = {
        id: user.uid,
        displayName: user.displayName + '(' + user.role + ')',
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        emailID: user.email,
        photoURL: user.photoURL
      }

      const updatedNotification = {
        ...notification,
        updatedAt: timestamp.fromDate(new Date()),
        updatedBy
      }

      if (!errorFlag) {
        // await updateDocument(notificationid, updatedNotification)

        if (updateDocumentResponse.error) {
          navigate('/')
        }
        else {
          navigate("/propagentnotification");
        }
      }
    }
  }

  return (
    <div className="top_header_pg pa_bg">
      <div className="pa_inner_page">
        {/* 9 dots html  */}
        <>
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
              <Link to="/propagentaddnotification/new" className="more-add-options-icons">
                <h1>Add Notifications</h1>
                <span className="material-symbols-outlined">view_list</span>
              </Link>
              <Link
                to="/propagentadmindashboard"
                className="more-add-options-icons"
              >
                <h1>Approve Properties</h1>
                <span className="material-symbols-outlined">check_box</span>
              </Link>
              <Link to="/propagentusers" className="more-add-options-icons">
                <h1>Users</h1>
                <span className="material-symbols-outlined">group</span>
              </Link>
            </div>
          </div>
        </>
        {/* 9 dots html  */}
        <div className="pg_header">
          <h2 className="p_title">Add Notification</h2>
          <h4 className="p_subtitle">
            You can add all types of notification here
          </h4>
        </div>
        <div className="verticall_gap"></div>
        <div className="add_notification_form regular_card">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* <div className="col-md-6">
                <div className="fl_form_field">
                  <label className="no-floating" htmlFor="">
                    Search user
                  </label>                  
                  <input required type="text" />
                </div>
              </div> */}

              <div className="col-md-6">
                <div className="fl_form_field">
                  <label className="no-floating" htmlFor="">
                    Notification type
                  </label>
                  <select name="" id=""
                    value={notificationFields && notificationFields.Type}
                    onChange={(e) => setNotificationFields({
                      ...notificationFields,
                      Type: e.target.value
                    })}>
                    <option value="" defaultValue>
                      Select notification type
                    </option>
                    <option defaultValue={notificationFields && notificationFields.Type === 'App Updates' ? true : false}>App Updates</option>
                    <option defaultValue={notificationFields && notificationFields.Type === 'Discount' ? true : false}>Discount</option>
                    <option defaultValue={notificationFields && notificationFields.Type === 'Offer' ? true : false}>Offer</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="fl_form_field top_margin_767">
                  <label className="no-floating" htmlFor="">
                    Short Description
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={70}
                    placeholder="Heading for notification"
                    onChange={(e) => setNotificationFields({
                      ...notificationFields,
                      ShortDescription: e.target.value
                    })}
                    value={notificationFields && notificationFields.ShortDescription}
                  />
                </div>
              </div>


              <div className="col-md-12">
                <div className="fl_form_field top_margin">
                  <label className="no-floating" htmlFor="">
                    Description
                  </label>
                  <textarea
                    required
                    type="text"
                    maxLength={300}
                    placeholder="Write something about notification"
                    onChange={(e) => setNotificationFields({
                      ...notificationFields,
                      Description: e.target.value
                    })}
                    value={notificationFields && notificationFields.Description}>

                  </textarea>
                </div>
              </div>
              <div className="col-md-12 text-center top_margin">
                <button type="submit" className="theme_btn btn_fill no_icon" >
                  {notificationid === 'new' ? 'Add Notification' : 'Update Notification'}
                </button>
                {formError && <p className="error">{formError}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PGPropAgentAddNotification;
