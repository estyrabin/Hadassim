import React, { useContext, useState, useEffect } from 'react';
import { ShopOwnerContext } from '../../context/shopOwnerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const NewOrder = () => {
  const { backendUrl } = useContext(ShopOwnerContext);
  const [productsDict, setProductsDict] = useState(null);
  const [orderQuantities, setOrderQuantities] = useState({});
  const {sToken} = useContext(ShopOwnerContext);


  
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (sToken) {
        console.log(sToken)
        try {
          const fullUrl = `${backendUrl}/api/shop/all-products`;
          const response = await axios.get(fullUrl, {
            headers: {
              token:sToken
            }
          });
          

          if (response.data.success) {
            setProductsDict(response.data.productsDict);
          } else {
            toast.error("An error occurred while fetching data");
          }
        } catch (error) {
          toast.error(`Error fetching data: ${error.message}`);
        }
      }
    };
  
    fetchProducts();
  }, [sToken, backendUrl]);
  
  

 
  const handleQuantityChange = (productId, value) => {
    setOrderQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, parseInt(value) || 0),
    }));
  };

  const handleAddToOrder = async (providerName) => {
    const providerProducts = productsDict[providerName];
    const orderItems = providerProducts
      .reduce((acc, product) => {
        const quantity = orderQuantities[product._id] || 0;
        if (quantity > 0) {
          if(quantity<product.minOrder){
             toast.error(`Minimum order for this product is ${product.minOrder}`);
             return
            
          }
          else{
            acc[product.name] = quantity; 
          }
        }
        return acc;
      }, {});

    if (Object.keys(orderItems).length === 0) {
      toast.error("Please enter at least one valid quantity");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/shop/new-order`, 
        { 
          companyName: providerName, 
          products: orderItems 
        }, 
        { 
          headers: {
            token: sToken
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Order added for ${providerName}!`);
      } else {
        toast.error("Failed to add order");
      }
    } catch (error) {
      toast.error(error.response.data.message || `Error adding order: ${error.message}`);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
      <h2 className="text-2xl font-bold mb-4">New Order</h2>
      {productsDict ? (
        <div className="grid gap-6">
          {Object.entries(productsDict).map(([providerName, products]) => (
            <div key={providerName} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{providerName}</h3>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Price: {product.price}
                      </p>
                    </div>
                    <input
                      type="number"
                      min={product.minOrder}
                      value={orderQuantities[product._id] || ''}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      className="w-16 p-1 border rounded-md text-center"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAddToOrder(providerName)}
                  className="mt-4 w-full bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark"
                >
                  Add Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading products...</div>
      )}
    </div>
  );
};

export default NewOrder;