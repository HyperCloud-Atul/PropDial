import { useCollection } from '../../../hooks/useCollection'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useLogout } from '../../../hooks/useLogout'

// components
import Filters from '../../../components/Filters'
import UserList from '../../../components/UserList'

// styles
import './PGSuperAdminDashboard.css'

export default function SuperAdminDashboard() {
    const { logout, isPending } = useLogout()
    const { user } = useAuthContext()
    const { documents, error } = useCollection('users')
    const [filter, setFilter] = useState('all')
    // const navigate = useNavigate();

    useEffect(() => {
        let flag = user && user.roles && user.roles.includes('superadmin');
        if (!flag) {
            logout()
        }
    }, [user])


    const changeFilter = (newFilter) => {
        setFilter(newFilter)
    }

    const users = documents ? documents.filter(document => {
        switch (filter) {
            case 'all':
                return true
            case 'admin':
                return document.roles.includes(filter)
            case 'active':
            case 'inactive':
                return document.status === filter
            default:
                return true
        }
    }) : null

    return (
        <div>
            <h2 className="page-title">User List</h2>
            {error && <p className="error">{error}</p>}
            {documents && <Filters changeFilter={changeFilter} />}
            {users && <UserList users={users} />}
        </div>
    )
}
