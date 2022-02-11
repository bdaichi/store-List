import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'


export let auth: firebase.auth.Auth;
export let db: firebase.firestore.Firestore;
export let storage: firebase.storage.Storage;
try {
    const config = {
        apiKey: "AIzaSyCdkl_d0uSWVir96mnY_ag9P7xd-ZHr4wc",
        authDomain: "shop-web-app-acfb0.firebaseapp.com",
        projectId: "shop-web-app-acfb0",
        storageBucket: "shop-web-app-acfb0.appspot.com",
        messagingSenderId: "175501893513",
        appId: "1:175501893513:web:6a786269a0d277a859cb58"
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