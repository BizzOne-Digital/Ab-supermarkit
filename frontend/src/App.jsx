import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './layouts/PublicLayout';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQPage = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Account = lazy(() => import('./pages/Account'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminProfile = lazy(() => import('./admin/AdminProfile'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminProducts = lazy(() => import('./admin/pages/Products'));
const AdminCategories = lazy(() => import('./admin/pages/Categories'));
const AdminSlides = lazy(() => import('./admin/pages/Slides'));
const AdminOrders = lazy(() => import('./admin/pages/Orders'));
const Inventory = lazy(() => import('./admin/pages/Inventory'));
const Customers = lazy(() => import('./admin/pages/Customers'));
const AdminCoupons = lazy(() => import('./admin/pages/Coupons'));
const AdminDeals = lazy(() => import('./admin/pages/Deals'));
const AdminOffers = lazy(() => import('./admin/pages/Offers'));
const AdminTestimonials = lazy(() => import('./admin/pages/Testimonials'));
const AdminFAQ = lazy(() => import('./admin/pages/FAQ'));
const AdminDeliveryLinks = lazy(() => import('./admin/pages/DeliveryLinks'));
const ContactSubmissions = lazy(() => import('./admin/pages/ContactSubmissions'));
const AdminNewsletter = lazy(() => import('./admin/pages/Newsletter'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="slides" element={<AdminSlides />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="deals" element={<AdminDeals />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="delivery-links" element={<AdminDeliveryLinks />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
