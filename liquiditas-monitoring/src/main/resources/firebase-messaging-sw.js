// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.2/firebase-messaging.js');
//importScripts('https://www.gstatic.com/firebasejs/init.js');
//importScripts('/__/firebase/init.js');

var config = {
    apiKey: "AIzaSyC38znzKlQ8Jj0KH74cGnv16dF8l6LHBgs",
    authDomain: "lmetallica-99c6c.firebaseapp.com",
    databaseURL: "https://lmetallica-99c6c.firebaseio.com",
    projectId: "lmetallica-99c6c",
    storageBucket: "lmetallica-99c6c.appspot.com",
    messagingSenderId: "483040143609"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  // Customize notification here
  const notificationTitle = 'Info';
  const notificationOptions = {
    body: payload,
    icon: '/liquditas.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
// [END background_handler]
