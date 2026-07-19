// Ricrea la stessa interfaccia di storage usata dentro Claude (window.storage.get/set),
// ma appoggiata a Firebase Firestore invece che allo storage interno di Claude.
// Il resto dell'app (app.js) non sa la differenza: nessuna modifica lì dentro.

import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION = 'registry';

window.storage = {
  async get(key) {
    const snap = await getDoc(doc(db, COLLECTION, key));
    if (!snap.exists()) {
      throw new Error('Chiave non trovata: ' + key);
    }
    return { key, value: snap.data().value, shared: true };
  },
  async set(key, value) {
    await setDoc(doc(db, COLLECTION, key), { value });
    return { key, value, shared: true };
  },
};
