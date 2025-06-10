import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

import PhoneLogin from "../phonelogin/PhoneLogin_reCaptchaV2";
import PGOwnerDashboard from "../roles/owner/PGOwnerDashboard";
import PGAdminDashboard from "../roles/admin/PGAdminDashboard";
import PGManagerDashboard from "../roles/manager/PGManagerDashboard";

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
                {user && (user.role.toLowerCase() === 'owner') && <PGOwnerDashboard />}
            </div>
            {/* <div>
                {user && user.role.toLowerCase() === 'tenant' && <PGTenantDashboard />}
            </div> */}
            <div>
                {user && user.role.toLowerCase() === 'manager' && <PGManagerDashboard />}
            </div>
            <div>
                {user && (user.role.toLowerCase() === 'admin' || user.role === 'superAdmin') && <PGAdminDashboard />}
            </div>

        </>
    );
};

export default PGDaashboard;
