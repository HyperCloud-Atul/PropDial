import React, { useState, useEffect } from "react";
import { projectFirestore } from "../../firebase/config";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyTable from "../../components/property/PropertyTable";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const InactiveProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("properties-propdial")
      .where("isActiveInactiveReview", "==", "Inactive")
      .onSnapshot(
        (snapshot) => {
          const props = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProperties(props);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching real-time properties:", err);
          setError("Failed to fetch properties.");
          setLoading(false);
        }
      );

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // View mode state
  const [viewMode, setviewMode] = useState("card_view"); // Initial mode is grid with 3 columns
  const handleModeChange = (newViewMode) => {
    setviewMode(newViewMode);
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      {loading ? (
        <div className="page_loader">
          <ClipLoader color="var(--theme-green2)" loading={true} />
        </div>
      ) : (
        <div>
          <div className="pg_header d-flex justify-content-between">
            <div className="left">
              <h2 className="m22 text_orange text-center">
                Inactive Properties {properties.length}
              </h2>
            </div>
            <div className="right">
              <div className="new_inline">
                <div className="project-filter">
                  <nav>
                    <Link to="/allproperties/all">
                      <button className="pointer ">All</button>
                    </Link>
                    <Link to="/filtered-property?filter=inreview">
                      <button className="pointer ">Only In-Review</button>
                    </Link>
                    <Link to="/filtered-property?filter=inactive">
                      <button className="pointer active">Only Inactive</button>
                    </Link>
                  </nav>
                </div>
              </div>
              <div className="filters">
                <div className="button_filter diff_views">
                  <div
                    className={`bf_single ${
                      viewMode === "card_view" ? "active" : ""
                    }`}
                    onClick={() => handleModeChange("card_view")}
                  >
                    <span className="material-symbols-outlined">
                      calendar_view_month
                    </span>
                  </div>
                  <div
                    className={`bf_single ${
                      viewMode === "table_view" ? "active" : ""
                    }`}
                    onClick={() => handleModeChange("table_view")}
                  >
                    <span className="material-symbols-outlined">view_list</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="vg12"></div>
          <hr />
          <div className="vg22"></div>

          <div className="property_cards_parent">
            {viewMode === "card_view" && (
              <>
                {properties?.map((property) => (
                  <PropertyCard key={property.id} propertyid={property.id} />
                ))}
              </>
            )}
          </div>
          {viewMode === "table_view" && (
            <>
              {properties && (
                <PropertyTable properties={properties} user={user} />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default InactiveProperties;
