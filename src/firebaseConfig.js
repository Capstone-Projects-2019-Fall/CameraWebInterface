import firebase from 'firebase'
import 'firebase/firestore'
import store from "./store";

// firebase init goes here
const config = {
    apiKey: "AIzaSyC2AMehEW9xsxtLdVKHzZG7ENNh2wrBNw0",
    authDomain: "mspi-a4b75.firebaseapp.com",
    databaseURL: "https://mspi-a4b75.firebaseio.com",
    projectId: "mspi-a4b75",
    storageBucket: "mspi-a4b75.appspot.com",
    messagingSenderId: "224698699586",
    appId: "1:224698699586:web:33bb9a289a097f74a302db",
    measurementId: "G-RBB4FBV72Q"
}
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
});

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser
const storageRef = firebase.storage().ref();

// firebase collections
const usersCollection = db.collection('test')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    storageRef
  
}