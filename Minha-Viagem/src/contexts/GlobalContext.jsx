import { createContext, useState} from "react";

export const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const[usuario, setUsuario] = useState("Lúcio Fernando")
    const [posts, setPosts] = useState([]);

    return(
        <GlobalContext.Provider value={{
                usuario, setUsuario, posts, setPosts
            }}>
            {children}
        </GlobalContext.Provider>
    )
}