import React, { useContext, useState, useEffect } from 'react';
import { ShopOwnerContext } from '../../context/shopOwnerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const StartusOrders = () => {
  const { backendUrl } = useContext(ShopOwnerContext);
  const [orders, setOrders] = useState(null);
  const {sToken} = useContext(ShopOwnerContext);
  

  
  useEffect(() => {
    const fetchOrders = async () => {
      if (sToken) {
        try {
          const fullUrl = `${backendUrl}/api/shop/status-orders`;
          const response = await axios.get(fullUrl, {
            headers: {
              token: sToken
            }
          });
          
          if (response.data.success) {
            setOrders(response.data.orders);
          } else {
            toast.error("An error occurred while fetching orders");
          }
        } catch (error) {
          toast.error(error.response.data.message || `Error fetching the orders: ${error.message}`);
        }
      }
    };
  
    fetchOrders();
  }, [sToken, backendUrl]);
  


  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Startus Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{order.companyName} | {new Date(order.date).toLocaleDateString()} | {order.status}</h3>

              <div className="space-y-4">
                {Object.entries(order.products).map(([productName, quantity]) => (
                  <div
                    key={productName}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                  >
                    <div>
                      <p className="text-sm text-gray-600">Product Name: {productName}</p>
                      <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No orders in process...</div>
      )}
    </div>
  );
};

export default StartusOrders;