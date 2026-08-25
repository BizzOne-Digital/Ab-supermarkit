import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as couponService from '../services/couponService';

const CartContext = createContext(null);
const STORAGE_KEY = 'ab_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [], coupon: null };
  } catch {
    return { items: [], coupon: null };
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart().items || []);
  const [coupon, setCoupon] = useState(() => loadCart().coupon || null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }));
  }, [items, coupon]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) => (i._id === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      const price = product.isOnSale && product.salePrice ? product.salePrice : product.regularPrice;
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price,
          image: product.images?.[0]?.url || '',
          qty,
        },
      ];
    });
    toast.success(`${product.name} added to cart`);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, qty) } : i)).filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      const raw = (subtotal * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
    }
    return Math.min(coupon.discountValue, subtotal);
  }, [coupon, subtotal]);

  const applyCoupon = useCallback(
    async (code) => {
      const res = await couponService.validateCoupon(code, subtotal);
      setCoupon(res.coupon);
      toast.success('Coupon applied');
      return res;
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
