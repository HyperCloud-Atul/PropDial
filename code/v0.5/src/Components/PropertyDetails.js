import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import Avatar from '../components/Avatar'
// import AddBill from '../pages/create/AddBill'
import { useNavigate } from 'react-router-dom'

// styles
import './PropertyList.css'

export default function PropertyDetails({ property }) {
    // console.log('properties: ', properties)
    const { user } = useAuthContext()

    const navigate = useNavigate();


    return (
        <div className='row no-gutters'>
            Property Details
        </div >
    )
}

