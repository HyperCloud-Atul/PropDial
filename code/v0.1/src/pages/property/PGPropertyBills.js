import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'
import { useDocument } from '../../hooks/useDocument'

// components
import Filters from '../../components/Filters'
import BillList from '../../components/BillList'
import PropertyStickyHeader from '../../components/PropertyStickyHeader'

// styles
// import './UserDashboard.css'

const billsFilter = ['PENDING', 'PMS', 'BROKERAGE', 'MAINTENANCE', 'INACTIVE'];

export default function PGPropertyBills() {
    const { state } = useLocation()
    const { propertyid } = state
    const { user } = useAuthContext()
    const { documents: billsdocuments, error: billserror } = useCollection('bills', ['propertyid', '==', propertyid])
    const { document: property, error: propertyError } = useDocument('properties', propertyid)

    const [filter, setFilter] = useState('PENDING')

    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const bills = billsdocuments ? billsdocuments.filter(document => {
        let filteredProperty = false
        switch (filter) {
            case 'PENDING':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.status.toUpperCase() === 'PENDING') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'PMS':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.billType.toUpperCase() === 'PMS') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'BROKERAGE':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.billType.toUpperCase() === 'BROKERAGE') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'MAINTENANCE':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.billType.toUpperCase() === 'MAINTENANCE') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            case 'INACTIVE':
                document.taggedUsersList.forEach(u => {
                    if (u.id === user.uid && document.status.toUpperCase() === 'INACTIVE') {
                        filteredProperty = true
                    }
                })
                return filteredProperty
            default:
                return true
        }
    }) : null



    return (
        <div>
            {property && <PropertyStickyHeader property={property} />}
            <br></br>
            <h2 className="page-title">Bills</h2>
            <div>
                {billserror && <p className="error">{billserror}</p>}

                {billsdocuments && <Filters changeFilter={changeFilter} filterList={billsFilter} filterLength={bills.length} />}

                {bills && <BillList bills={bills} />}
            </div>
        </div>
    )
}
