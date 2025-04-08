import React, { useContext } from 'react';
import { ShopOwnerContext } from '../context/shopOwnerContext';
import { ProviderContext } from '../context/ProviderContext';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



const Sidebar = () => {

  
  const {sToken, setSToken} = useContext(ShopOwnerContext);
  const {pToken , setPToken} = useContext(ProviderContext);

  const navigate = useNavigate();



  const handleLogout = () => {
    if(sToken){
      setSToken(false);
      localStorage.removeItem('stoken')
    }
    else if (pToken){
      setPToken(false);
      localStorage.removeItem('ptoken')
    }
  
    navigate('/login');
  };





  return (
    <div className="fixed top-16 left-0 min-h-screen w-[10vw] bg-white border-r shadow-md z-30">
      
   {sToken ? (
    <ul className="fixed top-0 left-0 w-[10vw] h-screen bg-gray-900 p-4 text-white flex flex-col space-y-4">
      <li>
        <NavLink to="/new-order" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
          New Order
        </NavLink>
      </li>
      <li>
        <NavLink to="/status-orders" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
          Status Orders
        </NavLink>
      </li>
      <li>
        <NavLink to="/confirm-orders" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
          Confirm Orders
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-orders" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
          All Orders
        </NavLink>
      </li>
      <li>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
        Inventory update        
        </NavLink>
      </li>
      <li>
      <NavLink to="/cashier" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
          Cashier
        </NavLink>
      </li>
      
      <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-primary px-4 py-2 rounded"
    onClick={handleLogout}>
      logout  </button> 
      
    </ul>
    
  ) : (
    (
      <ul className="fixed top-0 left-0 w-[10vw] h-screen bg-gray-900 p-4 text-white flex flex-col space-y-4">
       
        <li>
          <NavLink to="/confirm-my-orders" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
            Confirm Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/all-my-orders" className={({ isActive }) => isActive ? "text-lg font-bold underline" : ""}>
            All Orders
          </NavLink>
        </li>
        <button class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-primary px-4 py-2 rounded"
    onClick={handleLogout}>
      logout  </button> 
      </ul>
    )
  )
  }
 

</div>
  )
}

export default Sidebar