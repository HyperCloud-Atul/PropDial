import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { timestamp } from '../firebase/config'
import { el } from 'date-fns/locale'

export const useLogin = () => {
  // const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    // console.log('isCancelled in login: ', isCancelled)
    try {
      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not process the login')
      }

      // update online status
      const documentRef = projectFirestore.collection('users').doc(res.user.uid)
      await documentRef.update({
        online: true,
        lastLoginTimestamp: timestamp.fromDate(new Date())
      })

      const unsubscribe = await documentRef.onSnapshot(snapshot => {
        // need to make sure the doc exists & has data
        if (snapshot.data()) {
          let role = snapshot.data().role;
          let online = snapshot.data().online;
          let displayName = snapshot.data().displayName;
          let fullName = snapshot.data().fullName;
          let phoneNumber = snapshot.data().phoneNumber;
          let city = snapshot.data().city;
          let address = snapshot.data().address;
          let photoURL = snapshot.data().photoURL;
          let status = snapshot.data().status;
          let createdAt = snapshot.data().createdAt;
          let lastLoginTimestamp = snapshot.data().lastLoginTimestamp;

          let userData = {
            ...res.user,
            role,
            online,
            displayName,
            fullName,
            phoneNumber,
            city,
            address,
            photoURL,
            status,
            createdAt,
            lastLoginTimestamp
          }

          dispatch({ type: 'LOGIN', payload: userData })

          // if (!isCancelled) {
          setIsPending(false)
          setError(null)
          // }
        }
        else {
          // setError('No such document exists')
        }
      }, err => {
        console.log(err.message)
        // setError('failed to get document')
      })
    }
    catch (err) {
      // if (isCancelled) {
      setError(err.message)
      setIsPending(false)
      // }
    }
  }

  useEffect(() => {
    // return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}