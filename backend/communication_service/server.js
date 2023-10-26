const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	// console.log(socket.id);
	socket.emit("getSelfId", socket.id);
	console.log("socket id: ", socket.id);
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
	});

	socket.on("callUser", (data) => {
		console.log("call user ", "from: ", data.from, "to: ", data.userToCall);
		// console.log(data.from);
		io.to(data.userToCall).emit("callUser", {
			signal: data.signalData,
			from: data.from,
			name: data.name,
		});

		socket.on("signal", (data) => {
			// Relay signaling data to the intended recipient
			console.log("target socket: ", data.to);
			io.to(data.to).emit("signal", data.signal);
		});
	});
	socket.on("test", (data) => {
		// console.log(data);
		console.log("target socket: ", data.to);
		io.to(data.to).emit("signal", data.signal);
	});

	socket.on("answerCall", (data) => {
		console.log("answer call");
		// console.log(data);
		console.log(data.to);

		io.to(data.to).emit("callAccepted", data.signal);
		// io.emit("callAccepted", data.signal);
	});
});

server.listen(5000, () => console.log("server is running on port 5000"));
