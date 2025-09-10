import { useEffect, useState } from 'react'
import { projectFunctions } from '../firebase/config';
import { useDocument } from './useDocument';

export const useSendEmail = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [isSendEmailPending, setIsPending] = useState(false)
    const { document, error } = useDocument('settings', 'SETTINGS')

    const sendMyEmail = async (toList, ccList, bccList, subject, body) => {
        // setError(null)
        setIsPending(true)

        try {

            var params = {
                from: 'atul@hyperclouddigital.com',
                pwd: 'grygbudwtyovrleb',
                // from: document.EMAIL.from,
                // pwd: document.EMAIL.serverPwd,
                toList: toList,
                ccList: ccList,
                bccList: bccList,
                subject: subject,
                body: body,
                // attachFileName: 'manu.jpg',
                // attachFilePath: 'https://firebasestorage.googleapis.com/v0/b/propdial-dev-aa266.appspot.com/o/thumbnails%2F1BeFgheTiZPsvWM9C0qP4LgLpIZ2%2Fmanu.jpg?alt=media&token=9ab7ddd0-0894-49d1-b8ac-32f7dae28176',
            }

            // const emailStatus = projectFunctions.httpsCallable('sendAppEmail');
const emailStatus = projectFunctions.httpsCallable('sendEmails');
            // const sendEmailFunction = projectFunctions.httpsCallable(functions, "sendEmails");

            emailStatus(params).then(async (result) => {
                console.log('Email Status : ', result);
            })
        }
        catch (err) {
            if (!isCancelled) {
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { sendMyEmail, isSendEmailPending }
}