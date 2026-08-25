import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src="/logo.png" alt="AB's Supermarket" className="h-16 w-auto object-contain mx-auto mb-2" />
        <p className="text-ivory/50 text-center mb-8">Admin Portal</p>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-charcoal rounded-lg p-6 space-y-4 border border-gold/20">
          <div>
            <label className="text-sm font-medium text-ivory/70">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 bg-black text-ivory border border-gold/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-ivory/70">Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} className="w-full mt-1 bg-black text-ivory border border-gold/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
