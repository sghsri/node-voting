const express = require("express");
const app = express();
var rooms = [];
var bodyParser = require("body-parser");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/create/", (req, res) => {
  res.sendFile(__dirname + "/create.html");
});
app.get("/party/", (req, res) => {
  res.sendFile(__dirname + "/party.html");
});
app.get("/host/:id", (req, res) => {
  res.sendFile(__dirname + "/host.html");
});

app.get("/api/party/:id", (req, res) => {
  var roomid = req.params.id;
  var theroom = rooms.find(x => {
    return x.id == roomid;
  });
  if (!theroom) {
    return res.status(404).send(`Could not find a room with id ${roomid}`);
  } else {
    res.send(JSON.stringify(theroom));
  }
});

app.post("/create", (req, res) => {
  var party = req.body;
  console.log(party);
  var roomid = generateRoomID();
  rooms.push({ id: roomid, vote: party });
  console.log(rooms);
  res.send(roomid);
  console.log(`Successfully created a party with id: ${roomid}`);
});

app.post("/join/:id", (req, res) => {
  var roomid = req.params.id;
  var theroom = rooms.find(x => {
    return x.id == roomid;
  });
  if (!theroom) {
    return res.status(404).send(`Could not find a room with id ${roomid}`);
  } else {
    res.send(theroom);
  }
});
app.put("/party/:id", (req, res) => {
  var party = req.body;
  console.log(party.vote.answers);
  var foundIndex = rooms.findIndex(x => x.id == req.params.id);
  rooms[foundIndex] = party;
  res.send("updated");
  console.log(rooms[foundIndex].vote.answers);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

function generateRoomID() {
  var roomid = getIDString();
  while (!isUniqueID(roomid)) {
    roomid = getIDString();
  }
  return roomid;
}
function getIDString() {
  return Math.random()
    .toString(36)
    .slice(-6)
    .toLowerCase();
}
function isUniqueID(roomid) {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].id == roomid) {
      return false;
    }
  }
  return true;
}
