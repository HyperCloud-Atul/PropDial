import { useEffect, useState } from 'react'
import { projectAuth, projectAuthObj } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useUpdatePassword = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const updatepwd = async (oldpwd, newpwd) => {
        setError(null)
        setIsPending(false)

        try {

            const user = projectAuth.currentUser;

            // Reauthenticate the user with their old password
            const credential = projectAuthObj.EmailAuthProvider.credential(user.email, oldpwd);
            // console.log('credential in useUpdatePassword: ', credential)
            user.reauthenticateWithCredential(credential)
                .then(() => {
                    // Update the user's password with the new password
                    return user.updatePassword(newpwd);
                })
                .then(() => {
                    // console.log('Password updated successfully');
                    setError(null);
                })
                .catch((error) => {
                    // console.log('Error changing password:', error);
                    setError(error.message);
                });

            // update state
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        }
        catch (err) {
            if (!isCancelled) {
                setError(err.message)
                setIsPending(false)
            }
            setError(err.message)
            console.log(err.message)
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { updatepwd, error, isPending }
}