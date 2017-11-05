var express = require('express'), http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');

// var request = require("request");
var helper = require('./bin/helper');

var index = require('./routes/v1/index');

var logsSystem = require('./routes/v1/logs');
var fs = require('fs');
var verification = require('./bin/verification');
var logs = require('./bin/logs');
var dblayer = require('./bin/dblayer');

require('./bin/config');
global.request = require("request");
global.ObjectID = require('mongodb').ObjectID;
global.Timestamp = require('mongodb').Timestamp;
global.sefaria_service = require('./bin/sefaria_service')();
global._ = require('lodash');

global.dbObj = new dblayer();
global.helperObj = new helper();


var local = true
if (local)
    global.base_url = "http://localhost:4500/v1/";
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(verification);
app.use('/', index);
// app.use('/users', users);

app.use(logs);
app.use('/v1/logs', logsSystem);

/*
 app.use(function (result,req,res,next) {//itzik22

 })*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// app.use(bodyParser.json({verify: verification.check}));
app.set('port', process.env.PORT || 4500);
//console.log('messageIm');

/*
 // error handler
 app.use(function (err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
 res.status(err.status || 500);
 // res.render('error');
 res.send({
 "error": {
 "message": "Unsupported request. Please read the documentation at https://developers.messageapi.io/docs",
 "type": "MethodException",
 "code": 404
 }
 })
 });
 */
var server = http.createServer(app);

/*server.listen(app.get('port'), function () {
 console.log("Express server listening on port " + app.get('port'));
 var os = require('os');
 var xx = os.hostname();
 console.log("HOST NAME:");
 console.log(xx);
 console.log('***********');
 });*/

// var privateKey = fs.readFileSync('ssl/private.pem', 'utf8');
// var certificate = fs.readFileSync('ssl/public.pem', 'utf8');
// var ca = fs.readFileSync('ssl/cer.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate, ca: ca};
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(app.get('port'));
// httpsServer.listen(443);

// start();
module.exports = app;
function createKeyToken(myObj) {
    var sha256 = require('sha256');
    var k = "95B0528E61C2BD3676C96523F00B750C06B35A0B46F8DB5C3EDDD3393653FBA0";
    myObj.app_id = myObj._id.toString();
    myObj._id = undefined;
    // console.log(typeof myObj.app_id);
    var checkKey = sha256(myObj.app_id + myObj.date_create + myObj.date_create + k);

    var b = new Buffer(JSON.stringify({
        app_id: myObj.app_id,
        AC: myObj.date_create,
        UC: myObj.date_create,
        sign: checkKey
    }));
    console.log("***********");
    // console.log(myObj);
    console.log('Please copy this token for using an api:');
    console.log(b.toString('base64'));
    console.log("***********");


    // var elements = signature.split('=');
    // var method = elements[0];
    // var signatureHash = elements[1];

    var crypto = require('crypto')
        , app_id = 'sdfgsdf3g2s13df2g1s3d2g1fs'
        , key = k
        , hash;
    var crypto = require('crypto');
    hash = crypto.createHmac('sha1', key).update(app_id).digest('hex');


    console.log(hash);
//console.log(signatureHash);
//console.log(expectedHash);
    /* if (signatureHash != expectedHash) {
     //  throw new Error("Couldn't validate the request signature.");
     }*/
}
function start() {
    var messageApiIm = require('messageapi-im')('eyJhcHBfaWQiOiI1OWY4NmI1ZTQzNjYyYjM3YWM1ODg3ODgiLCJhYyI6MTUwOTQ1MjYzOCwidWMiOjE1MDM5MTU5MTUsInNpZ24iOiJkMWNmMmIyMmY2MjM5NDkzZmVjNDZiOTcwNDg1MjA1N2Q4ZWY1YjU2MTgzMWY0MzNhY2JiY2I0ZDI2ODVjMmZlIn0=');
    // messageApiIm.messages.Send({
    //     "customer_id": "59f87acb29d975d5d375d185",
    //     "integration_id": "59f86ba929d975d5d375d16d",
    //     "data": {
    //         type: 'template',
    //         template: {
    //             type: 'generic', title: 'חמשה חומשי תורה',
    //             //text: 'Hello - content ....',
    //             //image_url:'https://i.ytimg.com/vi/D1xSzmwW-Rg/hqdefault.jpg',
    //             // image_url: 'https://cdn1.iconfinder.com/data/icons/office-icons-17/512/ilustracoes_04-05-128.png',
    //             buttons: [
    //                 {action: 'reply', label: 'בראשית', reply_data: 'בראשית'},
    //                 {action: 'reply', label: 'שמות', reply_data: 'שמות'},
    //                 {action: 'reply', label: 'ויקרא', reply_data: 'ויקרא'},
    //                 // {action: 'reply', label: 'במדבר', reply_data: 'במדבר'},
    //                 // {action: 'reply', label: 'דברים', reply_data: 'דברים'}
    //
    //             ]
    //         }
    //     }
    // }).then(function (result) {
    //     var message = result.message;
    //     console.log(result);
    //     messageApiIm.messages.Send({
    //         "customer_id": "59f87acb29d975d5d375d185",
    //         "integration_id": "59f86ba929d975d5d375d16d",
    //         "data": {
    //             type: 'template',
    //             template: {
    //                 type: 'generic',
    //                 title: '.',
    //                 //text: 'Hello - content ....',
    //                 //image_url:'https://i.ytimg.com/vi/D1xSzmwW-Rg/hqdefault.jpg',
    //                 // image_url: 'https://cdn1.iconfinder.com/data/icons/office-icons-17/512/ilustracoes_04-05-128.png',
    //                 buttons: [
    //
    //                     {action: 'reply', label: 'במדבר', reply_data: 'במדבר'},
    //                     {action: 'reply', label: 'דברים', reply_data: 'דברים'}
    //
    //                 ]
    //             }
    //         }
    //     }).then(function (result) {
    //         var message = result.message;
    //         console.log(result);
    //     });
    // });


    // return;
    var search = 'שלום';
    sefaria_service.search(search).then(function (result) {
        var booksMes = cutMessages(result.books);
        var personsMsg = cutMessages(result.persons);
        var othersMsg = cutMessages(result.others);




        booksMes.forEach(function (element) {
            var templateBooks = {
                type: 'generic',
                title: 'ספרי מקורות',
                buttons: []
            }
            element.forEach(function (element) {
                templateBooks.buttons.push({
                    action: 'open_uri',
                    label: element.title,
                    url: 'https://www.sefaria.org.il/' + element.ref
                });
            });
            sendMessage(templateBooks);
        });
        personsMsg.forEach(function (element) {
            var templatePersons = {
                type: 'generic',
                title: 'מחברים',
                buttons: []
            }
            element.forEach(function (element) {
                templatePersons.buttons.push({
                    action: 'open_uri',
                    label: element.title,
                    url: 'https://www.sefaria.org.il/' + element.ref
                })
            });
            sendMessage(templatePersons);
        });
        othersMsg.forEach(function (element) {
            var templateOthers = {
                type: 'generic',
                title: 'ספרים שונים',
                buttons: []
            }
            element.forEach(function (element) {
                templateOthers.buttons.push({
                    action: 'open_uri',
                    label: element.title,
                    url: 'https://www.sefaria.org.il/' + element.ref
                })
            });
            sendMessage(templateOthers);
        });


        console.log(result);
        debugger;
    });
    var cutMessages = function (items) {
        var groups = [];
        if (items.length <= 3)
            groups.push(items);
        else {
            var tempItems = new Array(items.length);
            for (var i = 0; i < items.length; i++) {
                tempItems[i] = items[i];
            }
            do {
                var x = [];
                x.push(tempItems[0]);
                if (tempItems[1])
                    x.push(tempItems[1])
                if (tempItems[2])
                    x.push(tempItems[2])
                groups.push(x);
                tempItems.splice(0, x.length);
            } while (tempItems.length > 0)
        }
        return groups;
    }

    var sendMessage = function (template) {
        messageApiIm.messages.Send({
            "customer_id": "59f87acb29d975d5d375d185",
            "integration_id": "59f86ba929d975d5d375d16d",
            "data": {
                type: 'template',
                template: template
            }
        }).then(function (result) {
            var message = result.message;
            console.log(result);
        });
    }
    return;
    sefaria_service.search(search).then(function (result) {
        //console.log(result);
        var dada = result.completions;//.he;
        // console.log(dada);
        var types = [];
        var books = [];
        dada.forEach(function (element) {
            console.log(dada);
            var indx = 0;
            sefaria_service.search(element).then(function (result) {
                console.log('')
                console.log('------ ' + indx + ' -------');
                if (types.indexOf(result.type) == -1)
                    types.push(result.type);
                if (result.is_book)
                    books.push(result);
                console.log('---------------');
            });
            console.log(types);
            console.log(books);
            /*messageApiIm.messages.Send({
             "customer_id": "59f87acb29d975d5d375d185",
             "integration_id": "59f86ba929d975d5d375d16d",
             "data": {
             type: 'template',
             template: {
             type: 'generic', title: 'search of '+search,
             buttons:[{action: 'open_uri', url: 'http://google.com', label: 'Google'}]
             }
             }).then(function (result) {
             var message = result.message;
             console.log(result);
             },function (error) {
             //var message = result.message;
             console.log(error);
             });*/
        });
    }, function (err) {
        console.log(err);
    })

    return;
    messageApiIm.messages.Send({
        "customer_id": "59f87acb29d975d5d375d185",
        "integration_id": "59f86ba929d975d5d375d16d",
        "data": {
            type: 'template',
            template: {
                type: 'generic', title: 'חמשה חומשי תורה',
                //text: 'Hello - content ....',
                //image_url:'https://i.ytimg.com/vi/D1xSzmwW-Rg/hqdefault.jpg',
                // image_url: 'https://cdn1.iconfinder.com/data/icons/office-icons-17/512/ilustracoes_04-05-128.png',
                buttons: [
                    {action: 'reply', label: 'בראשית', reply_data: 'בראשית'},
                    {action: 'reply', label: 'שמות', reply_data: 'שמות'},
                    {action: 'reply', label: 'ויקרא', reply_data: 'ויקרא'},
                    // {action: 'reply', label: 'במדבר', reply_data: 'במדבר'},
                    // {action: 'reply', label: 'דברים', reply_data: 'דברים'}

                ]
            }
        }
    }).then(function (result) {
        var message = result.message;
        console.log(result);
    });


}
