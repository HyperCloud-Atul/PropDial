import { useState, useEffect } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { timestamp } from '../firebase/config'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    try {
      // login
      const res = await projectAuth.signInWithEmailAndPassword(email, password)

      // update online status
      const documentRef = projectFirestore.collection('users').doc(res.user.uid)
      await documentRef.update({
        online: true,
        lastLoginTimestamp: timestamp.fromDate(new Date())
      })

      // console.log('Roles:', documentRef.get())
      let roles = [];
      const unsubscribe = await documentRef.onSnapshot(snapshot => {
        // need to make sure the doc exists & has data
        if (snapshot.data()) {
          if (snapshot.data().roles)
            roles = snapshot.data().roles;
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
          // console.log('Roles: ', roles);

          let userData = {
            ...res.user,
            roles,
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
          // console.log('User with Roles: ', userData)
          // dispatch login action
          // dispatch({ type: 'LOGIN', payload: res.user })
          dispatch({ type: 'LOGIN', payload: userData })

          if (!isCancelled) {
            setIsPending(false)
            setError(null)
          }
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
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}