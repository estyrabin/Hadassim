import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { ProviderContext } from '../../context/ProviderContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [products, setProducts] = useState([{ name: '', price: '', minOrder: '' }]);
  const navigate = useNavigate();

  const { setPToken, backendUrl } = useContext(ProviderContext);

  const handleProductsChange = (index, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? { ...product, [field]: field === 'name' ? value : Number(value) }
          : product
      )
    );
  };

  const removeProduct = (index) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const addProduct = () => {
    setProducts((prevProducts) => [...prevProducts, { name: '', price: '', minOrder: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate products
    const isProductsValid = products.every(
      (product) => product.name && product.price && product.minOrder
    );
    if (!isProductsValid) {
      toast.error('Please fill in all product fields');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/provider/sign-up`,
        { email, password, phone, companyName, representativeName, products },
      );

      if (response.data.success) {
        localStorage.setItem('ptoken', response.data.token);
        setPToken(response.data.token);
        toast.success(response.data.message);
        //navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          Provider Sign Up
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
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter company name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="representativeName" className="block text-sm font-medium text-gray-700">
              Representative Name
            </label>
            <input
              type="text"
              id="representativeName"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Enter representative name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Products (name, price, min order)
            </label>
            {products.map((product, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={product.name || ''}
                  onChange={(e) => handleProductsChange(index, 'name', e.target.value)}
                  className="mt-1 block w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={product.price || ''}
                  onChange={(e) => handleProductsChange(index, 'price', e.target.value)}
                  className="mt-1 block w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  min="0"
                  required
                />
                <input
                  type="number"
                  placeholder="Min Order"
                  value={product.minOrder || ''}
                  onChange={(e) => handleProductsChange(index, 'minOrder', e.target.value)}
                  className="mt-1 block w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  min="0"
                  required
                />
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <div>
              <button
                type="button"
                onClick={addProduct}
                className="text-blue-500 hover:text-blue-700 mt-2"
              >
                Add Product
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light focus:outline-none focus:ring focus:ring-primary-light"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          <button className="mr-2" onClick={() => navigate('/sign-up')}>
            Signup
          </button>
          {' | '}
          <button className="ml-2" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;