import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
 
 
 // Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyCu3PUS0YpvDWgkHOj33V9hc6fdbPSDIHA",
    authDomain: "coursemash-25052.firebaseapp.com",
    databaseURL: "https://coursemash-25052.firebaseio.com",
    projectId: "coursemash-25052",
    storageBucket: "coursemash-25052.appspot.com",
    messagingSenderId: "1064382865042",
    appId: "1:1064382865042:web:1fd31a161615cdb4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;