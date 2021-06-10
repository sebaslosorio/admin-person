import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCvnK7djTqyP-svXsRd8Gy3YJ62c2O5V3Y",
    authDomain: "persona-aa4b3.firebaseapp.com",
    projectId: "persona-aa4b3",
    storageBucket: "persona-aa4b3.appspot.com",
    messagingSenderId: "221655961276",
    appId: "1:221655961276:web:75b523e9d095dfc6620ab9"
  };

  export const firebaseApp = firebase.initializeApp(firebaseConfig);