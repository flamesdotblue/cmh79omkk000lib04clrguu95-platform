import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero({ onCTAClick }) {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/80" />

      <div className="relative z-10 container mx-auto px-4 flex min-h-[90vh] items-center">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
          >
            AI Creator Portfolio — Tools & Training for the Modern Creator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-base sm:text-lg md:text-xl text-white/80"
          >
            Learn, Build, and Scale with the Top AI Tools and Prompts — Designed for developers and content creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <button
              onClick={onCTAClick}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-6 py-3 text-white font-semibold shadow-lg shadow-fuchsia-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Get Access Now</span>
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
