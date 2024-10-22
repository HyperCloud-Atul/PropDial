import { createContext, useReducer, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      // update online status
      if (user) {
        const documentRef = projectFirestore.collection("users-propdial").doc(user.uid);
        const unsubscribe = documentRef.onSnapshot((snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            let role = snapshot.data().rolePropDial;
            let roles = snapshot.data().rolesPropDial;
            let accessType = snapshot.data().accessType;
            let accessValue = snapshot.data().accessValue;
            let online = snapshot.data().online;
            let displayName = snapshot.data().displayName;
            let fullName = snapshot.data().fullName;
            let phoneNumber = snapshot.data().phoneNumber;
            let email = snapshot.data().email;
            let country = snapshot.data().country;
            let countryCode = snapshot.data().countryCode;
            let city = snapshot.data().city;
            let address = snapshot.data().address;
            let photoURL = snapshot.data().photoURL;
            let status = snapshot.data().status;
            let createdAt = snapshot.data().createdAt;
            let lastLoginTimestamp = snapshot.data().lastLoginTimestamp;

            let userData = {
              ...user,
              role,
              roles,
              accessType,
              accessValue,
              online,
              displayName,
              fullName,
              phoneNumber,
              email,
              country,
              countryCode,
              city,
              address,
              photoURL,
              status,
              createdAt,
              lastLoginTimestamp,
            };

            dispatch({ type: "AUTH_IS_READY", payload: userData });
          }
        });
        return () => {
          unsubscribe();
        };
      } else {
        dispatch({ type: "AUTH_IS_READY", payload: user });
      }
      // dispatch({ type: 'AUTH_IS_READY', payload: userData })
      // unsub()
    });

    return () => {
      unsub();
    };
  }, []);

  // console.log('AuthContext state:', state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
