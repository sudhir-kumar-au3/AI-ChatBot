const dotenv=require("dotenv");
dotenv.config();
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const express = require('express');
const app = express();
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));
const server = app.listen(process.env.PORT ||3000, () => {
    console.log('App listening on port  ', server.address().port, app.settings.env);
});
const io = require('socket.io')(server);
io.on('connection', function(socket){
    console.log('user connected');
})

const apiai = require('apiai')(APIAI_TOKEN);
app.get('/', (req, res) => {
    res.sendFile('index.html');
});
io.on('connection', function(socket){
    socket.on('chat message', (text) => {
        console.log('message: '+ text);
        let apiaiReq = apiai.textRequest(text, {
            sessionID: APIAI_SESSION_ID
        });
        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            console.log('bot reply: '+ aiText);
            socket.emit('bot reply', aiText);
        });
        apiaiReq.on('error', (error) => {
            console.log(error);
        });
        apiaiReq.end();
    });
});
