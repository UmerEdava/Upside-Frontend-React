importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyCQoLdzDHxge26eCrWSsEXLxXUxoE-13W8",
  authDomain: "upside-5b959.firebaseapp.com",
  projectId: "upside-5b959",
  storageBucket: "upside-5b959.appspot.com",
  messagingSenderId: "647791960831",
  appId: "1:647791960831:web:e84771b4192ec3366ba2ca",
  measurementId: "G-SQBDFPZ0YP"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };

//   // self.registration.showNotification(notificationTitle, notificationOptions);
// });
