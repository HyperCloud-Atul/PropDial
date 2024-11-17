import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';

import './PGReferral.scss'

// component
import ScrollToTop from '../../components/ScrollToTop';
import InactiveUserCard from '../../components/InactiveUserCard';
import AddReferral from './AddReferral';

const PGReferral = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    if (!user) navigate("/login");

  return (
    <div>
    <ScrollToTop />
    {user && user.status === "active" ? (
      <div className="top_header_pg pg_bg pg_referral">
        <div className="page_spacing pg_min_height">
        <AddReferral/>

        </div>
      </div>
    ) : (
      <InactiveUserCard />
    )}
  </div>
  )
}

export default PGReferral
