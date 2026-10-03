import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(params);
      setProducts(data?.products || data?.data || data || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [JSON.stringify(params)]);
  return { products, loading, error, refetch: fetchProducts };
};
export default useProducts;
