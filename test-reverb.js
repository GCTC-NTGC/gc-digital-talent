const WebSocket = require("ws");

const url =
  "ws://localhost:6001/app/gcdtReverbKey?protocol=7&client=js&version=7.0.3";

const ws = new WebSocket(url);

ws.on("open", () => {
  console.log("WebSocket connection opened");
  ws.send("Hello Reverb Server");
});

ws.on("message", (data) => {
  console.log("Received message:", data);
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.on("close", (code, reason) => {
  console.log(`WebSocket closed: code=${code}, reason=${reason}`);
});
