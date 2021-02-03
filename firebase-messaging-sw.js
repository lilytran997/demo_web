// console.log("")
importScripts("https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.5/firebase-analytics.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js");
firebase.initializeApp({
                           apiKey: "AIzaSyD9vsX5169zjv6GYsdzg6SaqJSMWz89c28",
                           authDomain: "flutterweb-92792.firebaseapp.com",
                           projectId: "flutterweb-92792",
                           storageBucket: "flutterweb-92792.appspot.com",
                           messagingSenderId: "662835722389",
                           appId: "1:662835722389:web:6b6a8e538ea29e6037439c",
                           measurementId: "G-EXLN6VF2PE"
                          });

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
    const promiseChain = clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        }).then(() => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.score
              };
            return registration.showNotification(title, options);
        });
    return promiseChain;
});
messaging.requestPermission().then(function(){
  console.log('Notification permission granted.');
//   TODO(developer): Retrieve an Instance ID token for use with FCM.
//   ...
  console.log(messaging.getToken());
}).then(function(token){
  console.log('token: ', token);
  console.log(token);
}).catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});

messaging.getToken({vapidKey: 'BEGtF1_ZIcyi_dQlol1Sj9Es2vOhzEc0RedOEz26eRzYSJIgMo7NDZuPa3GsBPJ9936PXj5huuUqmeENzzZVlAg'}).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
self.addEventListener('notificationclick',function(event){
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const promiseChain = doSomething();
  event.waitUntil(promiseChain);
});