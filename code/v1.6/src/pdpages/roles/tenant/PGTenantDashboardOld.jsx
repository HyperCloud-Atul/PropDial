import React, { useCallback, useEffect, useState } from "react";

import { useAuthContext } from "../../../hooks/useAuthContext";
import InactiveUserCard from "../../../components/InactiveUserCard";
import PropertyCard from "../../../components/property/PropertyCard";
import { useCollection } from "../../../hooks/useCollection";
import { projectFirestore } from "../../../firebase/config";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const PGTenantDashboard = () => {
  const { user } = useAuthContext();
  console.log(user);

  const [propertydetail, setPropertydetail] = useState({});

  const fetchDocument = useCallback(async () => {
    const docs = await projectFirestore
      .collection("tenants")
      .where("mobile", "==", user.phoneNumber)
      .where("status", "==", "active")
      .where("isCurrentProperty", "==", true)
      .get();
    const property = docs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (property.length > 0) {
      setPropertydetail(property[0]);
    }
  }, [user.phoneNumber]);

  useEffect(() => {
    if (user) fetchDocument();
  }, [user, fetchDocument]);

  console.log(propertydetail);

  return (
    <div>
      {user && user.status === "active" ? (
        <div className="top_header_pg pg_bg propagent_dashboard">
          <div className="page_spacing">
            <div className="pg_header">
              <h2 className="m22 mb-1">Tenant Dashboard</h2>
              <h4 className="r18 light_black">
                Welcome <b> {user.displayName} </b>to Propdial
              </h4>
            </div>
            <div className="vg22"></div>
            <div className="pg_body">
              <div className="propagent_dashboard_inner">
                <h2 style={{ fontSize: "28px" }}>Your Current Residence</h2>
              </div>
              <div className="vg12"></div>
              <section className="property_cards_parent">
                {propertydetail?.propertyId && (
                  <PropertyCard propertyid={propertydetail.propertyId} />
                )}
              </section>

              <div className="theme_tab prop_doc_tab">
                <Tabs>
                  <TabList className="tabs">
                    <Tab className="pointer">Past Property</Tab>
                    <Tab className="pointer">Documents</Tab>
                    <Tab className="pointer">Payment History</Tab>
                  </TabList>
                  <TabPanel>
                    <div className="blog_sect">
                      {/* <div className="row">
                        {filteredTenantDocLength === 0 && (
                          <h5 className="m20 text_red mt-4">No data found</h5>
                        )}
                        {filteredTenantDocuments.map((doc, index) => (
                          <div className="col-lg-4 col-sm-6 " key={index}>
                            <div className="item card-container">
                              <div
                                className="card-image relative w-100"
                                style={{
                                  aspectRatio: "3/2",
                                }}
                              >
                                {uploadingDocId !== doc.id && (
                                  <label
                                    htmlFor={`upload_img_${doc.id}`}
                                    className="upload_img click_text by_text"
                                  >
                                    Upload PDF or Img
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleFileChange(e, doc.id)
                                      }
                                      ref={fileInputRef}
                                      id={`upload_img_${doc.id}`}
                                    />
                                  </label>
                                )}
                                {uploadingDocId === doc.id ? (
                                  <div
                                    className="loader d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <BeatLoader
                                      color={"#FF5733"}
                                      loading={true}
                                    />
                                  </div>
                                ) : doc.mediaType === "pdf" ? (
                                  <iframe
                                    title="PDF Viewer"
                                    src={doc.documentUrl}
                                    style={{
                                      width: "100%",
                                      aspectRatio: "3/2",
                                    }}
                                  ></iframe>
                                ) : (
                                  <img
                                    src={
                                      doc.documentUrl ||
                                      "/assets/img/image_small_placeholder.png"
                                    }
                                    alt="Document"
                                  />
                                )}
                              </div>
                              <div className="card-body">
                                <h3>{doc.idType}</h3>
                                <p className="card-subtitle">{doc.idNumber}</p>
                                {user && user.role === "superAdmin" && (
                                  <div className="card-author">
                                    <div
                                      onClick={() =>
                                        deleteTenantDocument(doc.id)
                                      }
                                      className="learn-more pointer"
                                    >
                                      Delete
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div> */}
                      No Data Found
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="blog_sect">
                      {/* <div className="row">
                        {filteredPoliceVerificationDocLength === 0 && (
                          <h5 className="m20 text_red mt-4">No data found</h5>
                        )}
                        {filteredPoliceVerificationDocuments.map(
                          (doc, index) => (
                            <div className="col-lg-4 col-sm-6 " key={index}>
                              <div className="item card-container">
                                <div
                                  className="card-image relative w-100"
                                  style={{
                                    aspectRatio: "3/2",
                                  }}
                                >
                                  {uploadingDocId !== doc.id && (
                                    <label
                                      htmlFor={`upload_img_${doc.id}`}
                                      className="upload_img click_text by_text"
                                    >
                                      Upload PDF or Img
                                      <input
                                        type="file"
                                        onChange={(e) =>
                                          handleFileChange(e, doc.id)
                                        }
                                        ref={fileInputRef}
                                        id={`upload_img_${doc.id}`}
                                      />
                                    </label>
                                  )}
                                  {uploadingDocId === doc.id ? (
                                    <div
                                      className="loader d-flex justify-content-center align-items-center"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    >
                                      <BeatLoader
                                        color={"#FF5733"}
                                        loading={true}
                                      />
                                    </div>
                                  ) : doc.mediaType === "pdf" ? (
                                    <iframe
                                      title="PDF Viewer"
                                      src={doc.documentUrl}
                                      style={{
                                        width: "100%",
                                        aspectRatio: "3/2",
                                      }}
                                    ></iframe>
                                  ) : (
                                    <img
                                      src={
                                        doc.documentUrl ||
                                        "/assets/img/image_small_placeholder.png"
                                      }
                                      alt="Document"
                                    />
                                  )}
                                </div>
                                <div className="card-body">
                                  <h3>{doc.idType}</h3>
                                  <p className="card-subtitle">
                                    {doc.idNumber}
                                  </p>
                                  {user && user.role === "superAdmin" && (
                                    <div className="card-author">
                                      <div
                                        onClick={() =>
                                          deleteTenantDocument(doc.id)
                                        }
                                        className="learn-more pointer"
                                      >
                                        Delete
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div> */}
                      No Data Found
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="blog_sect">
                      {/* <div className="row">
                        {filteredRentAgreementDocLength === 0 && (
                          <h5 className="m20 text_red mt-4">No data found</h5>
                        )}
                        {filteredRentAgreementDocuments.map((doc, index) => (
                          <div className="col-lg-4 col-sm-6 " key={index}>
                            <div className="item card-container">
                              <div
                                className="card-image relative w-100"
                                style={{
                                  aspectRatio: "3/2",
                                }}
                              >
                                {uploadingDocId !== doc.id && (
                                  <label
                                    htmlFor={`upload_img_${doc.id}`}
                                    className="upload_img click_text by_text"
                                  >
                                    Upload PDF or Img
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleFileChange(e, doc.id)
                                      }
                                      ref={fileInputRef}
                                      id={`upload_img_${doc.id}`}
                                    />
                                  </label>
                                )}
                                {uploadingDocId === doc.id ? (
                                  <div
                                    className="loader d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <BeatLoader
                                      color={"#FF5733"}
                                      loading={true}
                                    />
                                  </div>
                                ) : doc.mediaType === "pdf" ? (
                                  <iframe
                                    title="PDF Viewer"
                                    src={doc.documentUrl}
                                    style={{
                                      width: "100%",
                                      aspectRatio: "3/2",
                                    }}
                                  ></iframe>
                                ) : (
                                  <img
                                    src={
                                      doc.documentUrl ||
                                      "/assets/img/image_small_placeholder.png"
                                    }
                                    alt="Document"
                                  />
                                )}
                              </div>
                              <div className="card-body">
                                <h3>{doc.idType}</h3>
                                <p className="card-subtitle">{doc.idNumber}</p>
                                {user && user.role === "superAdmin" && (
                                  <div className="card-author">
                                    <div
                                      onClick={() =>
                                        deleteTenantDocument(doc.id)
                                      }
                                      className="learn-more pointer"
                                    >
                                      Delete
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div> */}
                      No Data Found
                    </div>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <InactiveUserCard />
      )}
    </div>
  );
};

export default PGTenantDashboard;
