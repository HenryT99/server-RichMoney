const app = require("express")();
const server = require("http").Server(app);
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const Socketio = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const db = require("./db/config");
//connect database
const user = require("./router/User.router");
const role = require("./router/Role.router");

const { send } = require("process");

const UserModel = require("./models/User.model");
const { Socket } = require("socket.io");

const { networkInterfaces } = require("os");

const nets = networkInterfaces();

const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === "IPv4" && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    exposedHeaders: "Token",
    // optionsSuccessStatus: 200,
    credentials: true,
    // preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const upload = multer({
  dest: "./uploads/",
});

app.use("/api/users", user);

app.use("/api/roles", role);

app.get("/", function (req, res) {
  res.redirect("http://localhost:5000");
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    code: req.file,
  });
});

Socketio.on("connection", (socket) => {
  socket.emit("hello", "Hello");
  socket.on("SaveUser", (data) => {
    UserModel.getUserByEmail(data, (user) => {
      if (user) {
        socket.broadcast.emit("editUser", user);
      }
    });
  });
  socket.on("deleteUser", (data) => {
    socket.broadcast.emit("deleteUser", data.email);
  });
  socket.on("createUser", (data) => {
    UserModel.getUserByEmail(data, (user) => {
      c;
      if (user) {
        socket.broadcast.emit("createUser", user);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`http://${results["Wi-Fi"][0]}:${port}`);
});
