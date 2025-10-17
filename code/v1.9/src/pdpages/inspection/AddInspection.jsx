import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";

// import component 
import FullInspection from "./fullInspection/FullInspection";
import RegularInspection from "./regularInspection/RegularInspection";
import ScrollToTop from "../../components/ScrollToTop";
const AddInspection = () => {
  const { inspectionId } = useParams();
   const { document: inspectionDocument, error: inspectionDocumentError } =
     useDocument("inspections", inspectionId);


  return (
    <div className="pg_min_height">
      <ScrollToTop />
      <div className="top_header_pg pg_bg add_inspection_pg">
        <div className="page_spacing pg_min_height">
  {inspectionDocument?.inspectionType === "Regular" ? (
  <RegularInspection
    inspectionId={inspectionId}
    inspectionDocument={inspectionDocument}
  />
) : inspectionDocument?.inspectionType === "Full" ? (
  <FullInspection
    inspectionId={inspectionId}
    inspectionDocument={inspectionDocument}
  />
) : (
  <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "500" }}>
    We are back to coming soon regarding this inspection type.
  </p>
)}

        </div>
      </div>
    </div>
  );
};

export default AddInspection;