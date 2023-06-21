import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // const getDocument = async (collection1, id1) => {
  //   console.log('getDocument collection:', collection1)
  //   console.log('getDocument id:', id1)
  //   const ref = projectFirestore.collection(collection1).doc(id1)
  //   const unsubscribe = ref.onSnapshot(snapshot => {
  //     // need to make sure the doc exists & has data
  //     if (snapshot.data()) {
  //       setDocument({ ...snapshot.data(), id: snapshot.id })
  //       setError(null)
  //       console.log('getDocument document:', document)
  //       return snapshot.data();
  //     }
  //     else {
  //       setError('No such document exists')
  //       return null;
  //     }
  //   }, err => {
  //     console.log(err.message)
  //     setError('failed to get document')
  //     // return null;
  //   })


  //   // unsubscribe on unmount
  //   // return () => unsubscribe()
  // }

  // realtime document data
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      // need to make sure the doc exists & has data
      if (snapshot.data()) {
        setDocument({ ...snapshot.data(), id: snapshot.id })
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, err => {
      console.log(err.message)
      setError('failed to get document')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, id])

  return { document, error }
}