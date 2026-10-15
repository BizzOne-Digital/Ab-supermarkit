import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, verifyTwoFactor } = useAuth();
  const navigate = useNavigate();
  const [pendingUserId, setPendingUserId] = useState(null);

  const credentialsForm = useForm();
  const codeForm = useForm();

  const onSubmitCredentials = async (data) => {
    try {
      const res = await login(data);
      if (res?.mfaRequired) {
        setPendingUserId(res.userId);
        toast.success('Code sent to your admin email');
        return;
      }
      if (res?.role !== 'admin') {
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const onSubmitCode = async ({ code }) => {
    try {
      const user = await verifyTwoFactor(pendingUserId, code);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access');
        return;
      }
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid code');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <img src="/logo.png" alt="AB's Supermarket" className="h-16 w-auto object-contain mx-auto mb-2" />
        <p className="text-ivory/50 text-center mb-8">Admin Portal</p>

        {!pendingUserId ? (
          <form onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)} className="bg-charcoal rounded-lg p-6 space-y-4 border border-gold/20">
            <div>
              <label className="text-sm font-medium text-ivory/70">Email</label>
              <input
                type="email"
                {...credentialsForm.register('email', { required: 'Email is required' })}
                className="w-full mt-1 bg-black text-ivory border border-gold/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
              {credentialsForm.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1">{credentialsForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-ivory/70">Password</label>
              <input
                type="password"
                {...credentialsForm.register('password', { required: 'Password is required' })}
                className="w-full mt-1 bg-black text-ivory border border-gold/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
              {credentialsForm.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1">{credentialsForm.formState.errors.password.message}</p>
              )}
            </div>
            <button type="submit" disabled={credentialsForm.formState.isSubmitting} className="btn-gold w-full disabled:opacity-60">
              {credentialsForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="bg-charcoal rounded-lg p-6 space-y-4 border border-gold/20">
            <p className="text-sm text-ivory/70">
              We emailed a 6-digit verification code to the admin account's email address. Enter it below to finish logging in.
            </p>
            <div>
              <label className="text-sm font-medium text-ivory/70">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                {...codeForm.register('code', {
                  required: 'Code is required',
                  pattern: { value: /^\d{6}$/, message: 'Enter the 6-digit code' },
                })}
                className="w-full mt-1 bg-black text-ivory border border-gold/20 rounded-md py-2.5 px-3 tracking-[0.5em] text-center text-lg focus:outline-none focus:border-gold"
                placeholder="------"
              />
              {codeForm.formState.errors.code && (
                <p className="text-red-400 text-xs mt-1">{codeForm.formState.errors.code.message}</p>
              )}
            </div>
            <button type="submit" disabled={codeForm.formState.isSubmitting} className="btn-gold w-full disabled:opacity-60">
              {codeForm.formState.isSubmitting ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => setPendingUserId(null)}
              className="w-full text-center text-xs text-ivory/50 hover:text-gold"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
