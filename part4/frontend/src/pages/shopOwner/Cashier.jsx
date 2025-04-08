import React, { useContext, useState, useEffect } from 'react';
import { ShopOwnerContext } from '../../context/shopOwnerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cashier = () => {
    const { backendUrl, sToken } = useContext(ShopOwnerContext);
    const [products, setProducts] = useState(null);
    const [orderQuantities, setOrderQuantities] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            if (sToken) {
                try {
                    const fullUrl = `${backendUrl}/api/shop/cashier`;
                    const response = await axios.get(fullUrl, {
                        headers: {
                            token: sToken
                        }
                    });

                    if (response.data.success) {
                        setProducts(response.data.inventory);
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
        setOrderQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, parseInt(value) || 0),
        }));
    };


    const handleOrder = async () => {
        
        const orderItems = products.reduce((acc, product) => {
            const quantity = orderQuantities[product._id] || 0;
            if (quantity > 0) {
                acc[product.product] = quantity; 
            }
            return acc;
        }, {});
    
        if (Object.keys(orderItems).length === 0) {
            toast.error("Please enter at least one valid quantity");
            return;
        }
    
        try {
            const response = await axios.post(
                `${backendUrl}/api/shop/customer-order`, 
                { 
                    products: orderItems 
                }, 
                { 
                    headers: {
                        token: sToken
                    }
                }
            );
            
            if (response.data.success) {
                toast.success("Order added successfully!");
            } else {
                toast.error("Failed to add order");
            }
        } catch (error) {
            toast.error(error.response.data.message || `Error adding order: ${error.message}`);
        }
    };

  

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Cashier</h2>
            {products ? (
                <div className="grid gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">All Products</h3>
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                                >
                                    <p className="font-medium">{product.product}</p>
                                    <input
                                        type="number"
                                        min= "0"
                                        value={orderQuantities[product._id] || ''}
                                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                        className="w-16 p-1 border rounded-md text-center"
                                    />
                                </div>
                            ))}
                            <button
                                onClick={handleOrder}
                                className="mt-4 w-full bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark"
                            >
                                end
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading products...</div>
            )}
        </div>
    );
};

export default Cashier;