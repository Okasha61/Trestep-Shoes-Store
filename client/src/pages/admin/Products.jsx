import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit,
  FiEye,
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { deleteProduct, getProducts } from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data?.products || data?.data || data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter((product) => (product._id || product.id) !== id)
      );

      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to delete product."
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText) ||
      product.gender?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-lime-400">
            Store Management
          </p>

          <h1 className="mt-2 text-3xl font-bold">Products</h1>

          <p className="mt-2 text-sm text-gray-500">
            Add, edit, delete and manage your footwear products.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black transition hover:bg-lime-300"
        >
          <FiPlus />
          Add Product
        </Link>
      </div>

      <div className="relative mt-8 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-lime-400"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <FiPackage className="text-4xl text-gray-700" />

            <h2 className="mt-4 text-lg font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Gender</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const id = product._id || product.id;

                  const image =
                    product.images?.[0] || product.image || null;

                  return (
                    <tr
                      key={id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-zinc-900">
                            {image ? (
                              <img
                                src={image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <FiPackage className="text-gray-700" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold">{product.name}</p>

                            {product.isNew && (
                              <span className="mt-1 inline-block text-xs text-lime-400">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {product.category || "-"}
                      </td>

                      <td className="px-6 py-5 text-gray-400">
                        {product.gender || "-"}
                      </td>

                      <td className="px-6 py-5 font-medium">
                        Rs. {Number(product.price || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            product.stock > 0
                              ? "text-lime-400"
                              : "text-red-400"
                          }
                        >
                          {product.stock ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/product/${id}`}
                            className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-lime-400/30 hover:text-lime-400"
                            title="View"
                          >
                            <FiEye />
                          </Link>

                          <Link
                            to={`/admin/products/edit/${id}`}
                            className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-lime-400/30 hover:text-lime-400"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>

                          <button
                            onClick={() => handleDelete(id)}
                            className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:border-red-400/30 hover:text-red-400"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
