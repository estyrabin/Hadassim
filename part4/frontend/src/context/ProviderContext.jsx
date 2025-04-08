import {createContext, useState} from 'react'

// Create a context for the provider
export const ProviderContext = createContext();

const ProviderContextProvider = (props) => {

    const [pToken ,setPToken] = useState(() => localStorage.getItem('ptoken') || false);
    const backendUrl = import.meta.env.VITE_BAKEND_URL;

    const value = {
        pToken, setPToken,
        backendUrl
    }

    return(
        <ProviderContext.Provider value={value}>
            {props.children}
        </ProviderContext.Provider>
    ) 
}

export default ProviderContextProvider
