import { useState, useEffect, useRef } from 'react'
import { projectFirestore, projectAuth, projectAuthObj } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { timestamp } from '../firebase/config'
import { useNavigate } from "react-router-dom";

export const useSignupPhone = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()
    let recaptchaVerifier = useRef(null);
    const [mobileNo, setMobileNo] = useState();
    const navigate = useNavigate();

    function setUpRecapcha(number) {
        // console.log('in setUpRecapcha', number);
        setMobileNo(number)
        // recaptchaVerifier = new projectAuthObj.RecaptchaVerifier('recapcha-container', {});
        recaptchaVerifier = new projectAuthObj.RecaptchaVerifier('recapcha-container', {
            'size': 'invisible',
            // 'callback': (response) => {
            //     // reCAPTCHA solved, allow signInWithPhoneNumber.
            //     handleSignIn();
            // }
        });

        // const recaptchaVerifier = new RecaptchaVerifier('recapcha-container', {}, auth);

        recaptchaVerifier.render();
        // recaptchaVerifier.clear();
        return projectAuth.signInWithPhoneNumber(number, recaptchaVerifier);
    }


    function resendOTP(number) {
        console.log('In resendOTP: ', number)
        console.log('recaptchaVerifier:', recaptchaVerifier)

        // return projectAuth.signInWithPhoneNumber(number, recaptchaVerifier);
    }
    // useEffect(() => {
    //     const unsubscrib = projectAuthObj.onAuthStateChanged((currentUser) => {
    //         // setUser({
    //         //     userInfo: currentUser,
    //         //     isLoggedIn: true,
    //         //     loading: false
    //         // });
    //         // // auth().setPersistence(auth.Auth.Persistence.LOCAL);
    //         // users.current = currentUser
    //         // // console.log('users : ', users);

    //         // navigate("/agentdashboard");

    //         // dispatch login action
    //         // dispatch({ type: 'LOGIN', payload: currentUser })
    //     });
    //     return () => {
    //         // auth().setPersistence(auth.Auth.Persistence.LOCAL)(() => {
    //         unsubscrib();
    //         // })

    //     }
    // }, [projectAuthObj]);



    return { setUpRecapcha, resendOTP, error, isPending }
}