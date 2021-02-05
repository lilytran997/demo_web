
const messaging = firebase.messaging();
    messaging.requestPermission().then(() => {
       console.log('Notification permission granted.')
       const messaging = firebase.messaging();
        messaging.getToken({vapidKey: 'BEGtF1_ZIcyi_dQlol1Sj9Es2vOhzEc0RedOEz26eRzYSJIgMo7NDZuPa3GsBPJ9936PXj5huuUqmeENzzZVlAg'}).then((currentToken) => {
            if (currentToken) {
                window.state = {
                    currentToken: currentToken
                }
                console.log('currentToken from javascript: '+currentToken);
<!--             // Send the token to your server and update the UI if necessary-->
            } else {
<!--                // Show permission request UI-->
                  console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
                  console.log('An error occurred while retrieving token. ', err);
        });
   }).catch((err) => {
                   console.log('Unable to get permission to notify. ', err)
   })
   messaging.onMessage(function(payload){
            window.state = {
                 body: payload.notification.body
            }
            window.state = {
                  title: payload.notification.title
            }
            console.log('Message received in javascript: ', payload);
            const title = payload.notification.title;
            const options = {body: payload.notification.score};
          return window.alert(title);
   });