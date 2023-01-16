import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import viewRouter from "./routes/views.routes.js";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = app.listen(8080, () => console.log("Port is running on 8080"));

// Socket
const io = new Server(httpServer);

// Handlebars
app.engine(
   "hbs",
   handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
   })
);

//Express config
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Endpoints
app.use("/", viewRouter);

const messages = [];

// Socket Server

io.on("connection", (socket) => {
   console.log("Nuevo cliente conectado");

   socket.on("Inicio", () => {
      io.sockets.emit("messageLogs", messages);
      socket.broadcast.emit("connected", messages);
   });

   socket.on("message", (data) => {
      console.log(data);
      messages.push(data);
      io.sockets.emit("messageLogs", messages);
   });
});
