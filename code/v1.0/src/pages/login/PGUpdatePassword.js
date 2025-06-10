import React from 'react'
import { useState } from 'react';
import { useUpdatePassword } from '../../hooks/useUpdatePassword';

export default function UpdatePassword() {
    const { updatepwd, isPending } = useUpdatePassword()
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [error, setError] = useState(null);

    const handleChangePassword = (event) => {
        event.preventDefault();
        updatepwd(oldPassword, newPassword);
    };


    return (
        <div>
            <form onSubmit={handleChangePassword} className="auth-form" style={{ maxWidth: '350px' }}>
                <div className='page-title'>
                    <h1>Change Password </h1>
                </div>
                <br />
                <label>
                    <div className='form-field-title'>
                        <span className="material-symbols-outlined">
                            lock
                        </span>
                        <h1>Old Password</h1>
                        <input
                            required
                            type="password"
                            onChange={(e) => setOldPassword(e.target.value)}
                            value={oldPassword}
                        />
                    </div>
                </label>
                <label>
                    <div className='form-field-title'>
                        <span className="material-symbols-outlined">
                            lock
                        </span>
                        <h1>New Password</h1>
                        <input
                            required
                            type="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={oldPassword}
                        />
                    </div>
                </label>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="btn">Change Password</button>
                </div>
                <br /><br />
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}
