import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import ProviderContextProvider from './context/ProviderContext.jsx';
import ShopOwnerContextProvider from './context/shopOwnerContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProviderContextProvider>
        <ShopOwnerContextProvider>
          <App />
        </ShopOwnerContextProvider>
      </ProviderContextProvider>
    </BrowserRouter>  
  </StrictMode>,
)
