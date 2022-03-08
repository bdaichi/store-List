import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'


export let auth: firebase.auth.Auth;
export let db: firebase.firestore.Firestore;
export let storage: firebase.storage.Storage;
try {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
} catch (error) {
    console.log(error);
}