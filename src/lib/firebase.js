import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

let app = null;
let db = null;
let storage = null;

function hasFirebaseConfig() {
  return !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  );
}

function ensureInit() {
  if (!hasFirebaseConfig()) return false;
  if (!getApps().length) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }
  db = getFirestore();
  storage = getStorage();
  return true;
}

function mockCreateOrder(payload) {
  const id = `mock_${Date.now().toString(36)}`;
  const order = {
    id,
    ...payload,
    status: 'pending',
    createdAt: new Date().toISOString(),
    source: 'mock',
  };
  const arr = JSON.parse(localStorage.getItem('mock_orders') || '[]');
  arr.push(order);
  localStorage.setItem('mock_orders', JSON.stringify(arr));
  return Promise.resolve(order);
}

function mockSubmitPaymentProof({ orderId, txnId, file }) {
  const arr = JSON.parse(localStorage.getItem('mock_orders') || '[]');
  const idx = arr.findIndex((o) => o.id === orderId);
  if (idx === -1) return Promise.reject(new Error('Order not found'));
  const proof = { txnId: txnId || null, uploadedAt: new Date().toISOString(), url: null };
  if (file) {
    proof.url = URL.createObjectURL(file);
  }
  arr[idx] = { ...arr[idx], status: 'payment_submitted', proof };
  localStorage.setItem('mock_orders', JSON.stringify(arr));
  return Promise.resolve(arr[idx]);
}

export async function createOrder({ fullName, email, phone, courseId, courseName, price }) {
  const enabled = ensureInit();
  if (!enabled) {
    console.warn('Firebase config not found. Using local mock storage for orders.');
    return mockCreateOrder({ fullName, email, phone, courseId, courseName, price });
  }

  const ref = await addDoc(collection(db, 'orders'), {
    fullName,
    email,
    phone,
    courseId,
    courseName,
    price,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

export async function submitPaymentProof({ orderId, txnId, file }) {
  const enabled = ensureInit();
  if (!enabled) {
    console.warn('Firebase config not found. Using local mock storage for payment proof.');
    return mockSubmitPaymentProof({ orderId, txnId, file });
  }

  let proofUrl = null;
  if (file) {
    const storageRef = ref(storage, `payment_proofs/${orderId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    proofUrl = await getDownloadURL(storageRef);
  }

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: 'payment_submitted',
    paymentProof: {
      txnId: txnId || null,
      url: proofUrl || null,
      submittedAt: serverTimestamp(),
    },
  });

  return { id: orderId, proofUrl };
}
