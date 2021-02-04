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
//    const promiseChain = clients.matchAll({
//            type: "window",
//            includeUncontrolled: true
//        }).then(windowClients => {
//            for (let i = 0; i < windowClients.length; i++) {
//                const windowClient = windowClients[i];
//                windowClient.postMessage(payload);
//            }
//        }).then(() => {
//            const title = payload.notification.title;
//            const options = {
//                body: payload.notification.score
//              };
//            return registration.showNotification(title, options);
//        });
//    return promiseChain;
  console.log("backgroundMessage")
  const title = payload.notification.title;
  const options = {body: payload.notification.score};
  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick',function(event){
   console.log('notification received: ', event)
  const clickedNotification = event.notification;
  clickedNotification.close();
  const promiseChain = doSomething();
  event.waitUntil(promiseChain);
});