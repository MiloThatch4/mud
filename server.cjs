// This file was copied from the CS365 notes

var express = require("express");
var app = express();
var http = require("http");
var server = http.Server(app);
var socketio = require("socket.io");
var io = socketio(server);
app.use(express.static("pub"));

//On the server side, you also need to do:
//	npm install express
//	npm install socket.io

let messages = []; //a full list of all chat made on this server

let adjectives = ["Best", "Happy", "Creepy", "Sappy"];
let nouns = ["Programmer", "Developer", "Web dev", "Student", "Person"];

function randomFromList(list) {
	let i = Math.floor(Math.random() * list.length);
	return list[i];
}

function mapSocketsToUsernames(socketList) {
	let ret = [];
	for(socketKeyValue of socketList) {
		// console.log(socketKeyValue[1]);
		ret.push(socketKeyValue[1].data.name);
	}
	return ret;
}

//Every time a client connects (visits the page) this function(socket) {...} gets executed.
//The socket is a different object each time a new client connects.
io.on("connection", function(socket) {
	console.log("Somebody connected.");

	//socket.data is a convenience object where we can store application data
	socket.data.name = randomFromList(adjectives) +" "+ randomFromList(nouns);

	socket.on("disconnect", function() {
		//This particular socket connection was terminated (probably the client went to a different page
		//or closed their browser).
		console.log("Somebody disconnected.");
		io.emit("updateUserList", mapSocketsToUsernames(io.sockets.sockets));
	});

	socket.on("directMessage", function(targetUser, text) {
		for(id of Array.from(io.sockets.sockets.keys())) {
			if (io.sockets.sockets.get(id).data.name == targetUser) {
				let m = socket.data.name + " just whispered to " + targetUser + ": " + text;
				io.sockets.sockets.get(id).emit("messageSent", m);
				socket.emit("messageSent", m); //also informs the one who sent the whisper
			}
		}
	});

	//Events coming from client going to server...
	socket.on("sendUsername", function(username, callback) {
		let allIds = Array.from(io.sockets.sockets.keys());
		let duplicate = false;
		for(id of allIds) {
			if(io.sockets.sockets.get(id).data.name == username) {
				duplicate = true;
			}
		}

		if (!duplicate) {
			socket.data.name = username; //TODO: Be wary of ANY data coming from the client.
			callback(true, messages);

			io.emit("updateUserList", mapSocketsToUsernames(io.sockets.sockets));
			let h = username + " logged in!";
			messages.push(h);
			io.emit("messageSent", h);
		}
		else {
			callback(false, null);
		}
	});

	socket.on("sendChat", function(chatMessage) {
		let m = socket.data.name + " just said: " + chatMessage;
		messages.push(m);
		console.log(m);
		io.emit("messageSent", m);
	});


});

server.listen(8080, function() {
	console.log("Server with socket.io is ready.");
});

