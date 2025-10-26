import { useMemo } from 'react';
import { motion } from 'framer-motion';

function timeAgoString(date) {
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  return { hours, label: `Added ${hours} hour${hours === 1 ? '' : 's'} ago` };
}

export default function Courses({ onBuyNow }) {
  const course = useMemo(() => {
    // Example: course added 3 hours ago
    const createdAt = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const { hours, label } = timeAgoString(createdAt);
    return {
      id: 'top-100-ai-tools',
      title: 'Top 100 AI Tools for Creators',
      description:
        'A complete collection of the most useful AI tools and ready-to-use prompts for creators and developers.',
      price: 499,
      status: 'Available',
      createdAt,
      timeLabel: label,
      isNew: hours <= 24,
      thumbnail: null,
    };
  }, []);

  const courses = [course];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Courses</h2>
        <p className="text-white/70 mt-1">Curated resources for modern creators and developers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
          >
            <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white/60">
              {c.thumbnail ? (
                <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-sm">Course Preview</div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">{c.status}</span>
                {c.isNew && (
                  <span className="inline-flex items-center rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-xs text-fuchsia-300">New (24h)</span>
                )}
              </div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-white/70 mt-1">{c.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-base font-bold">₹{c.price}</div>
                <div className="text-xs text-white/60">{c.timeLabel}</div>
              </div>
              <div className="mt-4">
                <button
                  onClick={onBuyNow}
                  className="w-full rounded-xl bg-white text-slate-900 font-semibold py-2.5 hover:bg-slate-100 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
