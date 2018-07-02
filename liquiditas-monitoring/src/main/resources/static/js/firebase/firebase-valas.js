
$.ajax({
    type: "GET",
    url: baseUrl + "notification/get",
    async: true,
    success: function(obj) {
        var prop;
        var drop_down =
            '<ul id="notification_div" class="dropdown-menu dropdown-menu-right dropdown-menu-lg show" style="width:750px !important;" >\n' +
            '  <div class="dropdown-header text-center">\n' +
            '   <strong id="notification_count_title"></strong>\n' +
            '  </div>\n' +
            '</ul>\n';
        var count = 0;
        $("#notification_li").append(drop_down);
        for(prop in obj) {
            if(!obj.hasOwnProperty(prop)) continue;
            var backgroundColor = "";
            if (obj[prop].isSeen == true) {
                backgroundColor = '<li id="'+obj[prop].key+'" style="background-color: white">\n';
            } else {
                backgroundColor = '<li id="'+obj[prop].key+'" style="background-color: #f7f8f9" onclick="readNotification(\''+obj[prop].key+'\')">\n'
                count++;
            }
            var added =
                backgroundColor +
                '<a href="#" class="dropdown-item">\n' +
                '  <div class="message">\n' +
                '    <div>\n' +
                '      <small class="text-muted" id="notification_title">'+obj[prop].title+'</small>\n' +
                '      <small class="text-muted float-right mt-1" id="notification_date">'+new Date(obj[prop].date)+'</small>\n' +
                '    </div>\n' +
                '    <div class="small text-muted text-truncate" id="notification_body">'+obj[prop].body+'</div>\n' +
                '  </div>\n' +
                '</a>\n' +
                '</li>\n';
            $("#notification_div").append(added);
        }
        $("#notification_count").html(count);
        $("#notification_count_title").html('You have ' + count + ' unread message.');
    }
});

// Initialize Firebase
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
messaging.usePublicVapidKey('BCoh3NsznMYaC61OFdHRAaWwf0I6VJ0KEcqUzDTmkqthIRaQ294gKDNlZfAzV6rqplycVa6cR-V99yqJMr7E41w');

const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

messaging.onTokenRefresh(function () {
    messaging.getToken()
        .then(function (refreshedToken) {
            console.log('Token refreshed: ' + refreshedToken);
            setTokenSentToServer(false);
            sendTokenToServer(refreshedToken);
            resetUI();
        })
        .catch(function (err) {
            console.log('Unable to retrieve refreshed token ', err);
        });
});

function resetUI() {
    messaging.getToken()
        .then(function (currentToken) {
            if (currentToken) {
                console.log("Current token: " + currentToken);
                setTokenSentToServer(false);
                sendTokenToServer(currentToken);
            } else {
                console.log('No Instance ID token available. Request permission to generate one.');
                setTokenSentToServer(false);
            }
        })
        .catch(function (err) {
            console.log('An error occurred while retrieving token. ', err);
            setTokenSentToServer(false);
        });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        subscribeTokenToTopic(currentToken);
        console.log('Sending token to server...');
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }

}

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}

function requestPermission() {
    console.log('Requesting permission...');
    messaging.requestPermission()
        .then(function () {
            console.log('Notification permission granted.');
            resetUI();
        })
        .catch(function (err) {
            console.log('Unable to get permission to notify.', err);
        });
}

function deleteToken() {
    messaging.getToken()
        .then(function (currentToken) {
            messaging.deleteToken(currentToken)
                .then(function () {
                    console.log('Token deleted.');
                    setTokenSentToServer(false);
                    resetUI();
                })
                .catch(function (err) {
                    console.log('Unable to delete token. ', err);
                });
        })
        .catch(function (err) {
            console.log('Error retrieving Instance ID token. ', err);
        });

}

function subscribeTokenToTopic(token) {
    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Authority", token);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        url: baseUrl + "notification/subscribe",
        data: {
            token: token
        },
        success: function(msg) {
            console.log("Subscribe success. " + msg)
        }
    });

}

messaging.onMessage(function (payload) {
    console.log(payload);
    var added =
        '<a href="#" class="dropdown-item">\n' +
        '  <div class="message">\n' +
        '    <div>\n' +
        '      <small class="text-muted" id="notification_title">'+payload.notification.title+'</small>\n' +
        '      <small class="text-muted float-right mt-1" id="notification_date">'+"now"+'</small>\n' +
        '    </div>\n' +
        '    <div class="small text-muted text-truncate" id="notification_body">'+payload.notification.body+'</div>\n' +
        '  </div>\n' +
        '</a>\n';

    var newItem = document.createElement('li');
    newItem.style.cssText = 'background-color:#f7f8f9';
    var divNode = document.createElement("div");
    divNode.innerHTML = added;
    newItem.appendChild(divNode);

    var list = document.getElementById("notification_div");
    list.insertBefore(newItem, list.childNodes[2]);

    var count = $("#notification_div li").length;
    $("#notification_count").html(count);
    $("#notification_count_title").html('You have ' + count + ' unread message.');
    $.toast({
        text : payload.notification.body,
        hideAfter : 5000,              // `false` to make it sticky or time in miliseconds to hide after
        textAlign : 'left',            // Alignment of text i.e. left, right, center
        position : 'bottom-right'       // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
    })
});

resetUI();
requestPermission();

function readNotification(key) {
    $.ajax({
        type: "POST",
        url: baseUrl + "notification/read/" + key,
        async: true,
        contentType: 'application/x-www-form-urlencoded',
        success: function(obj) {
            $('#'+key+'').css("background-color", "white");
        }
    });
}

function formatDate(longDate) {
    var monthNames = [
        "Januari", "Februari", "Maret",
        "April", "Mei", "Juni", "Juli",
        "Agustus", "September", "Oktober",
        "November", "Desember"
    ];

    var date = new Date(longDate);
    var now = new Date();

    if ((data.getDate() - 1) === now) {

    }

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}
