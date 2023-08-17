import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useLocation } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import Filters from '../../components/Filters'
import PropertyStickyHeader from '../../components/PropertyStickyHeader'
import PhotoList from '../../components/PhotoList'

// styles
import './Property.css'
import DocumentList from '../../components/DocumentList'

const propertyDocsFilter = ['PROPPERTY DOCS', 'PROPDIAL DOCS', 'UTILITY BILLS', 'MAINTENANCE BILLS'];

export default function PGPropertyDocuments() {
    const { state } = useLocation()
    const { propertyid } = state
    // const { updateDocument, response } = useFirestore('properties')
    const [filter, setFilter] = useState()
    const { documents: propertydocuments, error: propertydocumentserror } = useCollection('documents', ['propertyid', '==', propertyid])
    const { document: property, error: propertyError } = useDocument('properties', propertyid)

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const docs = propertydocuments ? propertydocuments.filter(document => {
        let filteredProperty = false
        switch (filter) {
            case 'PROPPERTY DOCS':
                // document.taggedUsersList.forEach(u => {
                if (document.documentType.toUpperCase() === 'PROPERTY DOCS') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            case 'PROPDIAL DOCS':
                // document.taggedUsersList.forEach(u => {
                if (document.documentType.toUpperCase() === 'PROPDIAL DOCS') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            case 'UTILITY BILLS':
                // document.taggedUsersList.forEach(u => {
                if (document.documentType.toUpperCase() === 'UTILITY BILLS') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            case 'MAINTENANCE BILLS':
                // document.taggedUsersList.forEach(u => {
                if (document.documentType.toUpperCase() === 'MAINTENANCE BILLS') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            default:
                return filteredProperty
        }
    }) : null

    return (
        <>
            <div>
                {property && <PropertyStickyHeader property={property} />}
                <br></br>
                <h2 className="page-title">Documents</h2>

                {propertydocuments && <Filters changeFilter={changeFilter} filterList={propertyDocsFilter} filterLength={docs.length} />}

                {docs && <DocumentList docs={docs} />}
            </div>

        </>
    )
}