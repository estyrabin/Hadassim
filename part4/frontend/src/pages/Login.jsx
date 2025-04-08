import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ProviderContext } from '../context/ProviderContext';
import { ShopOwnerContext } from '../context/shopOwnerContext';

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('provider');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setPToken, backendUrl: providerBackendUrl } = useContext(ProviderContext)
  const { setSToken, backendUrl: shopBackendUrl } = useContext(ShopOwnerContext);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (loginType === 'shop') {

        const response = await axios.post(`${shopBackendUrl}/api/shop/login`, {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem('stoken', response.data.token);
          console.log(response.data.token)
          setSToken(response.data.token);
          toast.success(response.data.message);
        }
      } else {
        const response = await axios.post(`${providerBackendUrl}/api/provider/login`, {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem('ptoken', response.data.token);
          setPToken(response.data.token);
          console.log(response.data.token)
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          {loginType === 'shop' ? 'Shop Owner Login' : 'Provider Login'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light focus:outline-none focus:ring focus:ring-primary-light"
          >
            Login
          </button>
        </form>



        {loginType == "provider" && <div className="text-center text-sm text-gray-500 mt-4">
          <button className="mr-2" onClick={() => navigate('/sign-up')}>Signup</button>
          {' | '}
          <button className="ml-2" onClick={() => navigate('/login')}>
             Login
             </button>
        </div> }
         
        <p 
          className="text-center text-sm text-gray-500 mt-4 cursor-pointer"
          onClick={() => setLoginType(loginType === 'shop' ? 'provider' : 'shop')}
        >
          Click here to {loginType === 'shop' ? 'provider' : 'shop owner'} login
        </p>
        

      </div>
    </div>
  );
};

export default Login;