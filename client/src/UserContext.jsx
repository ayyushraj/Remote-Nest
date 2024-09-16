// import {createContext, useEffect, useState} from "react";
// import axios from "axios";
// import {data} from "autoprefixer";

// export const UserContext = createContext({});

// export function UserContextProvider({children}) {
//   const [user,setUser] = useState(null);
//   const [ready,setReady] = useState(false);
//   useEffect(() => {
//     if (!user) {
//       axios.get('/profile').then(({data}) => {
//         setUser(data);
//         setReady(true);
//       });
//     }
//   }, []);
//   return (
//     <UserContext.Provider value={{user,setUser,ready}}>
//       {children}
//     </UserContext.Provider>
//   );
// }
import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios.get('/profile')
        .then(({ data }) => {
          console.log('Fetched user data:', data); // Debugging line
          setUser(data);
          setReady(true);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setReady(true);  // Set ready even on error to avoid loading state forever
        });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
