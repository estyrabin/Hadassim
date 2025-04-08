import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import SignUp from './pages/provider/SignUp';
import Sidebar from './components/Sidebar';
import NewOrder from './pages/shopOwner/NewOrder';
import StatusOrders from './pages/shopOwner/StartusOrders'; // תיקנתי שגיאת כתיב
import AllOrders from './pages/shopOwner/AllOrders';
import AllMyOrders from './pages/provider/AllMyOrders';
import ConfirmOrders from './pages/shopOwner/ConfirmOrders';
import ConfirmMyOrders from './pages/provider/ConfirmMyOrders';
import { ProviderContext } from './context/ProviderContext';
import { ShopOwnerContext } from './context/shopOwnerContext';
import Cashier from './pages/shopOwner/Cashier';
import MinInventory from './pages/shopOwner/MinInventory';

const App = () => {
  const { sToken } = useContext(ShopOwnerContext);
  const { pToken } = useContext(ProviderContext);

  return (
    <div>
      <ToastContainer />
      {sToken || pToken ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Routes>
            <Route path="*" element={<Navigate to="/" />} /> 

              {/* Shop Owner Routes */}
              <Route path="/" element={<Navigate to="/" />} /> 
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/status-orders" element={<StatusOrders />} />
              <Route path="/confirm-orders" element={<ConfirmOrders />} />
              <Route path="/all-orders" element={<AllOrders />} />
              <Route path="/cashier" element={<Cashier />} />
              <Route path="/inventory" element={<MinInventory />} />

              {/* Provider Routes */}
              <Route path="/all-my-orders" element={<AllMyOrders />} />
              <Route path="/confirm-my-orders" element={<ConfirmMyOrders />} />

            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} /> 
        </Routes>
      )}
    </div>
  );
};

export default App;