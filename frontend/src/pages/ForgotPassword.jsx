import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await authService.forgotPassword(data.email);
      toast.success(res.message || 'Reset link sent if account exists.');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="container-app section-py max-w-md">
      <h1 className="font-heading text-3xl text-black mb-2 text-center">Forgot Password</h1>
      <p className="text-charcoal/60 text-center mb-8">Enter your email to receive a reset link</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-center text-sm text-charcoal/60 mt-6">
        <Link to="/login" className="text-gold-dark font-semibold hover:underline">Back to Login</Link>
      </p>
    </div>
  );
}
