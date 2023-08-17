import { useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useLocation } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import Filters from '../../components/Filters'
import PhotoList from '../../components/PhotoList'

// styles
import './Property.css'
import PropertyStickyHeader from '../../components/PropertyStickyHeader'

const propertyPhotoFilter = ['ORIGINAL', 'INSPECTION', 'OTHER'];

export default function PGPropertyPhotos() {
    const { state } = useLocation()
    const { propertyid } = state
    // const { updateDocument, response } = useFirestore('properties')
    const [filter, setFilter] = useState('ORIGINAL')
    // const { documents: billsdocuments, error: billserror } = useCollection('bills', ['propertyid', '==', propertyid])
    const { documents: photosdocuments, error: photoserror } = useCollection('photos', ['propertyid', '==', propertyid])
    // const { documents: propertydocuments, error: propertydocumentserror } = useCollection('documents', ['propertyid', '==', propertyid])
    const { document: property, error: propertyError } = useDocument('properties', propertyid)

    // console.log('property document:', propertyDocument)
    // console.log('bill document:', billsdocuments)
    // console.log('photos document:', photosdocuments)

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const photos = photosdocuments ? photosdocuments.filter(document => {
        let filteredProperty = false
        switch (filter) {
            case 'ORIGINAL':
                // document.taggedUsersList.forEach(u => {
                if (document.photoType.toUpperCase() === 'ORIGINAL') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            case 'INSPECTION':
                // document.taggedUsersList.forEach(u => {
                if (document.photoType.toUpperCase() === 'INSPECTION') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            case 'OTHER':
                // document.taggedUsersList.forEach(u => {
                if (document.photoType.toUpperCase() === 'OTHER') {
                    filteredProperty = true
                }
                // })
                return filteredProperty
            default:
                return true
        }
    }) : null

    return (
        <>
            <div>
                {property && <PropertyStickyHeader property={property} />}
                <br></br>
                <h2 className="page-title">Photos</h2>

                {photosdocuments && <Filters changeFilter={changeFilter} filterList={propertyPhotoFilter} filterLength={photos.length} />}

                {photos && <PhotoList photos={photos} />}
            </div>

        </>
    )
}