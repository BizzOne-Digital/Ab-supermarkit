import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: user?.name || '', phone: user?.phone || '' } });

  const onSubmit = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Admin Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">Full Name</label>
          <input {...register('name')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Email</label>
          <input value={user?.email || ''} disabled className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 bg-creme/50 text-charcoal/60" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Phone</label>
          <input {...register('phone')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
