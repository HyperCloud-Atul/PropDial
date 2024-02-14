import { useParams } from "react-router-dom";
import { useDocument } from "../../../hooks/useDocument";
import PGAddProperty from "../../../pdpages/property/PGAddProperty";

// components
// import PropertyComments from "./PropertyComments"
// import PGPropertyDetails from "./PGPropertyDetails"

// styles
// import './Property.css'

export default function PGPropertyEdit() {
  const { id } = useParams();
  const { document, error } = useDocument("properties", id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="property-details">
        {<PGAddProperty propertyid={id}></PGAddProperty>}
        {/* <PGPropertyDetails property={document} /> */}
        {/* <PropertyComments property={document} /> */}
      </div>
    </>
  );
}
