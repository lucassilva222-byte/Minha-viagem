import { createContext, useState} from "react";

export const GlobalContext = createContext()

export const GlobalContextProvider = ({children}) => {
    const[usuario, setUsuario] = useState("Lúcio Fernando")
    const[jogadorPOTM, setJogadorPOTM] = useState('Endrick')

    return(
        <GlobalContext.Provider value={{
                usuario, setUsuario, jogadorPOTM, setJogadorPOTM
            }}>
            {children}
        </GlobalContext.Provider>
    )
}