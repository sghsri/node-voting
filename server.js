const express = require('express');
const app = express();
var rooms = [];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  
app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/index.html')
});
app.post('/create',(req, res) => {
    var roomid = generateRoomID();
    rooms.push({id: roomid, participants: 1});
    console.log(rooms);
    res.send(`Successfully created a party with id: ${roomid}`)
    console.log(`Successfully created a party with id: ${roomid}`)
});

app.get('/join/:id',(req, res) => {
    var roomid = req.params.id;
    var theroom = rooms.find(x => {return x.id == roomid});
    if(!theroom){
        return res.status(404).send(`Could not find a room with id ${roomid}`);
    } else {
        theroom.participants++;
        console.log(`User successfully joined a party with id: ${roomid}`)
        res.sendFile(__dirname + '/party.html')
    }
    console.log(rooms);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

function generateRoomID(){
    var roomid = getIDString();
    while(!isUniqueID(roomid)){
        roomid = getIDString();
    }
    return roomid;
}
function getIDString(){
    return Math.random().toString(36).slice(-6).toLowerCase();
}
function isUniqueID(roomid){
    for(var i = 0; i<rooms.length;i++){
        if(rooms[i].id == roomid){
            return false;
        }
    }
    return true;
}