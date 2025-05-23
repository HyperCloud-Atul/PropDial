import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  const { user } = useAuthContext();

  // collection ref
  const ref = projectFirestore.collection(collection);

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    // if (!isCancelled) {
    dispatch(action);
    // }
  };


  const addDocumentWithCustomDocId = async (doc, _customDocId) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // const createdBy = {
      //   id: user.uid,
      //   displayName: user.displayName + '(' + user.role + ')',
      //   fullName: user.fullName,
      //   phoneNumber: user.phoneNumber,
      //   emailID: user.email,
      //   photoURL: user.photoURL
      // }    
      // console.log("doc data: ", doc)
      console.log("doc id: ", _customDocId)
      const createdBy = user ? user.uid : "guest";
      const createdAt = timestamp.fromDate(new Date());
      // const addedDocument = await ref.add({ ...doc, createdAt, createdBy });
      await ref.doc(_customDocId).set({ ...doc, createdAt, createdBy });
      // console.log("addedDocument: ", addedDocument)
      // console.log("addedDocument id: ", addedDocument.id)

      // dispatchIfNotCancelled({
      //   type: "ADDED_DOCUMENT",
      //   payload: {
      //     ...addedDocument,
      //     id: addedDocument.id,
      //   },
      // });
      // return addedDocument; // addedDocument returned
    } catch (err) {
      console.log("Firestore set document err:", err);
      // dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };


  // console.log("user", user);
  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // const createdBy = {
      //   id: user.uid,
      //   displayName: user.displayName + '(' + user.role + ')',
      //   fullName: user.fullName,
      //   phoneNumber: user.phoneNumber,
      //   emailID: user.email,
      //   photoURL: user.photoURL
      // }    
      // console.log("doc data: ", doc)
      const createdBy = user ? user.uid : "guest";
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt, createdBy });

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: {
          ...addedDocument,
          id: addedDocument.id,
        },
      });
      return addedDocument; // addedDocument returned
    } catch (err) {
      console.log("Firestore adddocument err:", err);
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  // update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      // console.log("updateDocument id : ", id)
      // console.log("updateDocument data : ", updates)

      const updatedDocument = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error });
      return null;
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { recodAudit, response };
};
