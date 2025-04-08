import {createContext, useState} from 'react'

// Create a context for the ShopOwner
export const ShopOwnerContext = createContext();

const ShopOwnerContextProvider = (props) => {

    const [sToken ,setSToken] = useState(() => localStorage.getItem('stoken') || false);
    const backendUrl = import.meta.env.VITE_BAKEND_URL;

    

    const value = {
        sToken ,setSToken,
        backendUrl
    };

    return(
        <ShopOwnerContext.Provider value={value}>
            {props.children}
        </ShopOwnerContext.Provider>
    ); 
};

export default ShopOwnerContextProvider;
