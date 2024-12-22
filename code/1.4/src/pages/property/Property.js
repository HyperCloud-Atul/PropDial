import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'

// components
import PropertyComments from "./PropertyComments"
import PGPropertyDetails from "./PGPropertyDetails"

// styles
import './Property.css'

export default function Property() {
    const { id } = useParams()
    const { document, error } = useDocument("properties-propdial", id)

    if (error) {
        return <div className="error">{error}</div>
    }
    if (!document) {
        return <div className="loading">Loading...</div>
    }

    return (
        <>
            <div>Property Edit</div>
            <div className="property-details">
                <PGPropertyDetails property={document} />
                <PropertyComments property={document} />
            </div>
        </>
    )
}
