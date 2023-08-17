import React from 'react'
import { Link } from 'react-router-dom'

import './NavbarBottom.css'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

export default function NavbarBottom() {
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const showProfile = () => {
        navigate("/profile")
    }

    const showDashboard = () => {
        if (user && user.role === 'superadmin') {
            // console.log('in superadmin', user.role)
            navigate('/superadmindashboard')
        }

        if (user && user.role === 'admin') {
            // console.log('in admin', user.role)
            navigate('/admindashboard')
        }

        if (user && user.role === 'owner') {
            // console.log('in user', user.role)
            navigate('/ownerdashboard')
        }

        if (user && user.role === 'tenant') {
            // console.log('in user', user.role)
            navigate('/tenantdashboard')
        }
        if (user && user.role === 'executive') {
            // console.log('in user', user.role)
            navigate('/executivedashboard')
        }
    }

    const showSecondPage = () => {
        if (user && user.role === 'admin') {
            // console.log('in user', user.role)
            navigate('/adminproperties')
        }
        if (user && user.role === 'owner') {
            // console.log('in user', user.role)
            navigate('/customerproperties')
        }
    }

    const showThirdPage = () => {
        if (user && user.role === 'admin') {
            // console.log('in user', user.role)
            navigate('/adminproperties')
        }
        if (user && user.role === 'owner') {
            // console.log('in user', user.role)
            navigate('/ownerbills')
        }
    }

    const showFourthPage = () => {
        navigate('/more')
    }

    //Menus as per role
    let firstMenuIcon = ''
    let firstMenu = '' //This is for all user type
    let secondMenuIcon = ''
    let secondMenu = ''
    let thirdMenuIcon = ''
    let thirdMenu = ''
    let fourthMenu = ''
    let fourthMenuIcon = ''
    if (user && user.role !== 'user') {
        firstMenuIcon = 'home'
        firstMenu = 'Dashboard'
        fourthMenuIcon = 'apps'
        fourthMenu = 'More'
    }

    if (user && user.role === 'admin') {
        secondMenuIcon = 'analytics'
        secondMenu = 'Properties'
        thirdMenuIcon = 'confirmation_number';
        thirdMenu = 'Users'
    }
    if (user && user.role === 'owner') {
        secondMenuIcon = 'location_away'
        secondMenu = 'Properties'
        // thirdMenuIcon = 'support_agent';
        thirdMenuIcon = 'receipt_long';
        // thirdMenu = 'Tickets'
        thirdMenu = 'Bills'
    }
    if (user && user.role === 'tenant') {
        secondMenuIcon = 'receipt_long'
        secondMenu = 'Rent'
        thirdMenuIcon = 'support_agent';
        thirdMenu = 'Tickets'
    }
    if (user && user.role === 'executive') {
        secondMenuIcon = 'receipt_long'
        secondMenu = 'Bills'
        thirdMenuIcon = 'support_agent';
        thirdMenu = 'Tickets'
    }


    return (
        <div className="small navbar-mobile-bottom">
            <div className="navbar-mobile-bottom-menu" id="divBottomNavBar">
                <div className="navbar-mobile-bottom-menu-a"
                    style={{ display: 'flex', flexDirection: 'column' }} onClick={showDashboard} >
                    <span className="material-symbols-outlined">
                        {firstMenuIcon}
                    </span>
                    <small>{firstMenu}</small>
                </div>
                <div className="navbar-mobile-bottom-menu-a "
                    style={{ display: 'flex', flexDirection: 'column' }} onClick={showSecondPage}>
                    <span className="material-symbols-outlined">
                        {secondMenuIcon}
                    </span>
                    <small>{secondMenu}</small>
                </div>
                <a href="/">
                </a>
                <div className="navbar-mobile-bottom-menu-a "
                    style={{ display: 'flex', flexDirection: 'column' }} onClick={showThirdPage}>
                    <span className="material-symbols-outlined">
                        {thirdMenuIcon}
                    </span>
                    <small>{thirdMenu}</small>
                </div>
                <div className="navbar-mobile-bottom-menu-a"
                    style={{ display: 'flex', flexDirection: 'column' }} onClick={showFourthPage}>
                    <span className="material-symbols-outlined">
                        {fourthMenuIcon}
                    </span>
                    <small>{fourthMenu}</small>
                </div>
            </div>
            <Link to="/profile" className="new-user " >
                <span className="material-symbols-outlined">
                    person
                </span>
            </Link>
        </div>
    )
}
