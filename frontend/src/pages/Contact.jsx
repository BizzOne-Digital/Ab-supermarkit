import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail } from 'lucide-react';
import * as contactService from '../services/contactService';

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactService.submitContactForm(data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="container-app section-py">
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-2 text-center">Contact Us</h1>
      <p className="text-charcoal/60 text-center mb-12">We&apos;d love to hear from you.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-black flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-black">Visit Us</h3>
              <p className="text-charcoal/70 text-sm">123 Market Street, Your City</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-black flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-black">Call Us</h3>
              <p className="text-charcoal/70 text-sm">(555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-black flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-heading text-lg text-black">Email Us</h3>
              <p className="text-charcoal/70 text-sm">hello@absupermarket.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-card p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-charcoal/70">Name</label>
            <input {...register('name', { required: 'Name is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal/70">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal/70">Message</label>
            <textarea rows={5} {...register('message', { required: 'Message is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-gold w-full disabled:opacity-60">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
