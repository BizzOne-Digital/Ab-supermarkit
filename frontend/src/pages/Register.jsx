import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created!');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="container-app section-py max-w-md">
      <h1 className="font-heading text-3xl text-black mb-2 text-center">Create Account</h1>
      <p className="text-charcoal/60 text-center mb-8">Join AB&apos;s Supermarket today</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">Full Name</label>
          <input {...register('name', { required: 'Name is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Phone</label>
          <input {...register('phone')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Password</label>
          <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-center text-sm text-charcoal/60 mt-6">
        Already have an account? <Link to="/login" className="text-gold-dark font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}
