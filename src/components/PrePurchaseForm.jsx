import { useState } from 'react';
import { motion } from 'framer-motion';
import { createOrder } from '../lib/firebase';

const courses = [
  { id: 'top-100-ai-tools', name: 'Top 100 AI Tools for Creators', price: 499 },
];

export default function PrePurchaseForm({ selectedCourse = 'top-100-ai-tools', onCourseChange, onOrderCreated }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState(selectedCourse);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const selected = courses.find((c) => c.id === courseId) || courses[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic email/phone check
    const emailOk = /.+@.+\..+/.test(email);
    const phoneOk = /[0-9\-\+ ]{7,}/.test(phone);
    if (!emailOk) return setError('Please enter a valid email.');
    if (!phoneOk) return setError('Please enter a valid phone number.');

    setLoading(true);
    try {
      const order = await createOrder({
        fullName,
        email,
        phone,
        courseId: selected.id,
        courseName: selected.name,
        price: selected.price,
      });
      onOrderCreated?.(order.id);
    } catch (err) {
      console.error(err);
      setError('Could not create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-bold">Pre-Purchase</h3>
      <p className="text-white/70 text-sm mt-1">Fill this form to reserve your spot. You can submit payment proof in the next step.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/80">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/80">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="jane@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/80">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
            placeholder="+91 98765 43210"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/80">Course</label>
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(e.target.value);
              onCourseChange?.(e.target.value);
            }}
            className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — ₹{c.price}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="md:col-span-2 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{error}</div>
        )}

        <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
          <div className="text-sm text-white/60">By continuing, your order will be saved with status: pending.</div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-white text-slate-900 font-semibold px-5 py-2.5 hover:bg-slate-100 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit' }
          </button>
        </div>
      </form>
    </motion.div>
  );
}
