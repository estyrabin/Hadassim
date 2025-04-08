import React, { useContext, useState, useEffect } from 'react';
import { ShopOwnerContext } from '../../context/shopOwnerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ConfirmOrders = () => {
  const { backendUrl } = useContext(ShopOwnerContext);
  const [orders, setOrders] = useState(null);
  const {sToken} = useContext(ShopOwnerContext);
  



  useEffect(() => {
  
    fetchOrders();
  }, [sToken, backendUrl]);


  const fetchOrders = async () => {
    if (sToken) {
      try {
        const fullUrl = `${backendUrl}/api/shop/all-process-orders`;
        const response = await axios.get(fullUrl, {
          headers: {
            token:sToken
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("An error occurred while fetching orders");
        }
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
      }
    }
  };


  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/shop/confirm-orders`,
        { orderId },
        {
          headers: {
            token: sToken, 
          },
        }
      );
  
      if (response.data.success) {
        toast.success("Order Confirmed");
        fetchOrders();
      } else {
        toast.error("Failed to confirm order");
      }
    } catch (error) {
      toast.error(`Error confirming order: ${error.message}`);
    }
  };
  

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Confirm Orders</h2>
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
                 <button
                   onClick={() => handleConfirmOrder(order._id)}

                  className="mt-4 w-full bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark"
                >
                  Confirm Order

                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No orders to confirm...</div>
      )}
    </div>
  );
};

export default ConfirmOrders;