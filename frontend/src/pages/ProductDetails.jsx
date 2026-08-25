import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import * as productService from '../services/productService';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    productService
      .getProductBySlug(slug)
      .then((res) => setProduct(res.product))
      .catch(() => {
        toast.error('Product not found');
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner full />;
  if (!product) return <EmptyState title="Product not found" />;

  const price = product.isOnSale && product.salePrice ? product.salePrice : product.regularPrice;
  const images = product.images?.length ? product.images : [{ url: '' }];

  return (
    <div className="container-app section-py">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-gold-dark mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Shop
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-creme rounded-lg overflow-hidden mb-4">
            {images[activeImage]?.url ? (
              <img src={images[activeImage].url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-charcoal/30">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-16 w-16 rounded-md overflow-hidden border-2 ${activeImage === idx ? 'border-gold' : 'border-transparent'}`}
                >
                  {img.url && <img src={img.url} alt="" className="h-full w-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category?.name && (
            <p className="text-sm text-gold-dark font-semibold mb-2 uppercase tracking-wide">{product.category.name}</p>
          )}
          <h1 className="font-heading text-3xl sm:text-4xl text-black mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-heading text-2xl text-black">${Number(price).toFixed(2)}</span>
            {product.isOnSale && (
              <span className="text-lg text-charcoal/40 line-through">${Number(product.regularPrice).toFixed(2)}</span>
            )}
            {product.unit && <span className="text-sm text-charcoal/50">/ {product.unit}</span>}
          </div>
          {product.shortDescription && <p className="text-charcoal/70 mb-6">{product.shortDescription}</p>}

          <p className={`text-sm mb-6 ${product.stockQuantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <QuantitySelector value={qty} onChange={setQty} max={product.stockQuantity || 99} />
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stockQuantity <= 0}
              className="btn-gold flex-1 disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
          </div>

          {product.description && (
            <div className="border-t border-charcoal/10 pt-6">
              <h3 className="font-heading text-lg text-black mb-2">Description</h3>
              <p className="text-charcoal/70 whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
