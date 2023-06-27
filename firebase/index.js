import { initializeApp }  from "firebase/app";
import { getFirestore } from "firebase/firestore";


// config
const firebaseConfig = {
  apiKey: "AIzaSyD5htXp05sl12A1COt6IR8tdGvATijmX-M",
  authDomain: "todowithreactak.firebaseapp.com",
  projectId: "todowithreactak",
  storageBucket: "todowithreactak.appspot.com",
  messagingSenderId: "941227991692",
  appId: "1:941227991692:web:d1bcb73f5e243649dc11a9"
};

// init app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

