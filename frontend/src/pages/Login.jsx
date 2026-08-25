import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/account');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="container-app section-py max-w-md">
      <h1 className="font-heading text-3xl text-black mb-2 text-center">Welcome Back</h1>
      <p className="text-charcoal/60 text-center mb-8">Login to your account</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Password</label>
          <input type="password" {...register('password', { required: 'Password is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold-dark hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-sm text-charcoal/60 mt-6">
        Don&apos;t have an account? <Link to="/register" className="text-gold-dark font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
}
