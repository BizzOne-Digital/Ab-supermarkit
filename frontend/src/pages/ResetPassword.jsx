import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Password reset successfully. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="container-app section-py max-w-md">
      <h1 className="font-heading text-3xl text-black mb-2 text-center">Reset Password</h1>
      <p className="text-charcoal/60 text-center mb-8">Enter your new password</p>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">New Password</label>
          <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
