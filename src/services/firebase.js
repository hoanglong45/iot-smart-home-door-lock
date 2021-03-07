import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyCfTKQ-5sDNvN3QfC6S4oqeKOnbEv7AxzE",
  authDomain: "iot-smart-home-door-lock-7ccc9.firebaseapp.com",
  databaseURL: "https://iot-smart-home-door-lock-7ccc9.firebaseio.com",
  projectId: "iot-smart-home-door-lock-7ccc9",
  storageBucket: "iot-smart-home-door-lock-7ccc9.appspot.com",
  messagingSenderId: "513607106040",
  appId: "1:513607106040:web:d627644390357454e76a0d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const storage = firebase.storage();
export const auth = firebase.auth();