import { useRef, useState, useEffect } from 'react';
import Hero from './components/Hero';
import Courses from './components/Courses';
import PrePurchaseForm from './components/PrePurchaseForm';
import PaymentSection from './components/PaymentSection';

export default function App() {
  const coursesRef = useRef(null);
  const formRef = useRef(null);
  const paymentRef = useRef(null);
  const [selectedCourse, setSelectedCourse] = useState('top-100-ai-tools');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (lastOrderId) setOrderId(lastOrderId);
  }, []);

  const scrollToRef = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero onCTAClick={() => scrollToRef(formRef)} />

      <section ref={coursesRef} className="container mx-auto px-4 py-16">
        <Courses onBuyNow={() => scrollToRef(formRef)} />
      </section>

      <section ref={formRef} className="container mx-auto px-4 py-16">
        <PrePurchaseForm
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          onOrderCreated={(id) => {
            setOrderId(id);
            localStorage.setItem('lastOrderId', id);
            setTimeout(() => scrollToRef(paymentRef), 300);
          }}
        />
      </section>

      <section ref={paymentRef} className="container mx-auto px-4 py-16">
        <PaymentSection orderId={orderId} onFocusPrepurchase={() => scrollToRef(formRef)} />
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/60">
        <div className="container mx-auto px-4">© {new Date().getFullYear()} AI Creator Portfolio — Tools & Training for the Modern Creator</div>
      </footer>
    </div>
  );
}
