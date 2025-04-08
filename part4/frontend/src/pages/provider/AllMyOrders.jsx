import React, { useContext, useState, useEffect } from 'react';
import { ProviderContext } from '../../context/ProviderContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ProviderOrders = () => {
  const { backendUrl, pToken } = useContext(ProviderContext);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!pToken) return;

      try {
        const fullUrl = `${backendUrl}/api/provider/all-my-orders`;
        console.log('Fetching from:', fullUrl);
        
        const response = await axios.get(fullUrl, {
          headers: {
            token:pToken
          },
        });

        console.log('Response:', response.data);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("An error occurred while fetching orders");
        }
      } catch (error) {
            toast.error(error.response.data.message || `Error fetching the orders: ${error.message}`);
      }
    };

    fetchOrders();
  }, [pToken, backendUrl]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
              Date:{new Date(order.date).toLocaleDateString()} | Status: {order.status}
              </h3>
             
              <div className="space-y-4">
                {Object.entries(order.products).map(([productName, quantity]) => (
                  <div
                    key={productName}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                  >
                    <div>
                      <p className="font-medium">Product: {productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No orders...</div>
      )}
    </div>
  );
};

export default ProviderOrders;