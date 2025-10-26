import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { submitPaymentProof } from '../lib/firebase';

export default function PaymentSection({ orderId: orderIdProp, onFocusPrepurchase }) {
  const [orderId, setOrderId] = useState(orderIdProp || '');
  const [txnId, setTxnId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderIdProp) setOrderId(orderIdProp);
  }, [orderIdProp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!orderId) return setError('Please provide your Order ID (generated after pre-purchase).');
    if (!txnId && !file) return setError('Provide a Transaction ID or upload a screenshot.');

    setLoading(true);
    try {
      await submitPaymentProof({ orderId, txnId, file });
      setMessage('Payment proof submitted successfully. We will verify and contact you soon.');
      setTxnId('');
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('Could not submit payment proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-bold">Payment</h3>
      <p className="text-white/70 text-sm mt-1">Use UPI / GPay / Paytm / NetBanking and submit payment proof here.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
          <h4 className="font-semibold">Manual Payment Options</h4>
          <ul className="list-disc pl-5 text-sm text-white/80 mt-2 space-y-1">
            <li>UPI: aicreator@okicici</li>
            <li>GPay / Paytm: +91 90000 00000</li>
            <li>NetBanking: AC 1234567890, IFSC ICIC000000, ICICI Bank</li>
          </ul>
          <div className="mt-4">
            <img src="/qr.png" alt="Payment QR" className="w-48 h-48 rounded-lg border border-white/10" />
            <p className="text-xs text-white/50 mt-2">Scan to pay via UPI</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/80">Order ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Paste your Order ID"
                required
              />
              {!orderId && (
                <button
                  type="button"
                  onClick={onFocusPrepurchase}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 text-sm hover:bg-white/10"
                >
                  Get ID
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm text-white/80">Transaction ID (optional if uploading screenshot)</label>
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
              placeholder="e.g., TXN12345ABC"
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm text-white/80">Upload Screenshot (PNG/JPG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-lg bg-slate-900/70 border border-white/10 px-3 py-2"
            />
          </div>

          {error && <div className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">{error}</div>}
          {message && <div className="mt-4 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{message}</div>}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white text-slate-900 font-semibold px-5 py-2.5 hover:bg-slate-100 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Payment Proof'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
