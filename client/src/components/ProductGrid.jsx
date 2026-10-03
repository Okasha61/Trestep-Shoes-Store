import ProductCard from "./ProductCard";

function ProductGrid({ products = [], loading = false }) {
  if (loading) return <div className="product-grid-message"><p>Loading products...</p></div>;
  if (!products.length) return <div className="product-grid-message"><h3>No Products Found</h3><p>We couldn't find any shoes matching your selection.</p></div>;
  return <div className="product-grid">{products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}</div>;
}
export default ProductGrid;
