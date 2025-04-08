import React, { useContext, useState, useEffect } from 'react';
import { ShopOwnerContext } from '../../context/shopOwnerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MinInventory = () => {
    const { backendUrl, sToken } = useContext(ShopOwnerContext);
    const [products, setProducts] = useState(null);
    const [orderQuantities, setOrderQuantities] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            if (sToken) {
                try {
                    const fullUrl = `${backendUrl}/api/shop/inventory`;
                    const response = await axios.get(fullUrl, {
                        headers: {
                            token: sToken
                        }
                    });

                    if (response.data.success) {
                        setProducts(response.data.inventory);
                        const initialQuantities = response.data.inventory.reduce((acc, product) => {
                            acc[product._id] = product.min.toString();
                            return acc;
                        }, {});
                        setOrderQuantities(initialQuantities);
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

    const handleSave = async (product) => {
        const quantity = orderQuantities[product._id] === undefined || orderQuantities[product._id] === ''
            ? product.min 
            : parseFloat(orderQuantities[product._id]);

        if (quantity < 0) {
            toast.error(`Minimum quantity for ${product.product} cannot be negative`);
            return;
        }
       
       

        try {
            const response = await axios.post(
                `${backendUrl}/api/shop/inventory-update`,
                { productName: product.product,
                    quantity 
                 },
                {
                    headers: {
                        token: sToken
                    }
                }
            );

            if (response.data.success) {
                toast.success(`Minimum for ${product.product} updated successfully!`);
                setProducts(products.map(p => 
                    p._id === product._id ? { ...p, min: quantity } : p
                ));
                setOrderQuantities(prev => ({
                    ...prev,
                    [product._id]: quantity.toString()
                }));
            } else {
                toast.error(`Failed to update ${product.product}`);
            }
        } catch (error) {
            toast.error(`Error updating ${product.product}: ${error.message}`);
        }
    };

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll ml-[15vw] pt-5 mx-auto">
            <h2 className="text-2xl font-bold mb-4">Minimum Inventory</h2>
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
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={orderQuantities[product._id] !== undefined ? orderQuantities[product._id] : product.min}
                                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                            className="w-16 p-1 border rounded-md text-center"
                                        />
                                        <button
                                            onClick={() => handleSave(product)}
                                            className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading products...</div>
            )}
        </div>
    );
};

export default MinInventory;