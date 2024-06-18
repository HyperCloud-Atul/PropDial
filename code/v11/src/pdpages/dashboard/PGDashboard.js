import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import PhoneLogin from "../phonelogin/PhoneLogin";
import PGOwnerDashboard from "../roles/owner/PGOwnerDashboard";
import PGAdminDashboard from "../roles/admin/PGAdminDashboard";

const PGDaashboard = () => {
    // Scroll to the top of the page whenever the location changes start
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    // Scroll to the top of the page whenever the location changes end

    const { user } = useAuthContext();
    // console.log('user:', user)
    return (
        <>
            <div>
                {!user && <PhoneLogin />}
            </div>
            <div>
                {user && (user.role === 'owner') && <PGOwnerDashboard />}
            </div>
            {/* <div>
                {user && user.role === 'tenant' && <PGTenantDashboard />}
            </div> */}
            <div>
                {user && user.role === 'admin' && <PGAdminDashboard />}
            </div>

        </>
    );
};

export default PGDaashboard;
