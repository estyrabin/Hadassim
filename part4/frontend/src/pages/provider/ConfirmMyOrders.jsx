import React, { useContext, useState, useEffect } from 'react';
import { ProviderContext } from '../../context/ProviderContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ConfirmMyOrders = () => {
  const { backendUrl, pToken } = useContext(ProviderContext);
  const [orders, setOrders] = useState(null);

  useEffect(() => {

    fetchOrders();
  }, [pToken, backendUrl]);


  const fetchOrders = async () => {
    if (!pToken) return;

    try {
      const fullUrl = `${backendUrl}/api/provider/all-new-orders`;
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


  const handleConfirmOrder = async (orderId) => {
    try {
 
      const response = await axios.post(
        `${backendUrl}/api/provider/confirm-my-orders`,
        { orderId }, 
        {
          headers: {
            token: pToken,
          },
        }
      );
      
      if (response.data.success) {
        toast.success("Order Confirm");
        fetchOrders();
      } else {
        toast.error("Failed to confirm order");
      }
    } catch (error) {
      toast.error(error.response.data.message || `Error confirm order: ${error.message}`);
    }
  };


  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Confirm Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
              Date: {new Date(order.date).toLocaleDateString()}
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
              <button
                   onClick={() => handleConfirmOrder(order._id)}

                  className="mt-4 w-full bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark"
                >
                  Confirm Order

                </button>
            </div>
            
          ))}
         
        </div>
      ) : (
        <div>No orders to confirm...</div>
      )}
    </div>
  );
};

export default ConfirmMyOrders;