import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./Config/DatabaseConnection";

// Import your routes
import routerUser from "./Routes/User";
import routerAdmin from "./Routes/Admin";
import routerBook from "./Routes/Book";
import routerCart from "./Routes/Cart";
import routerCollection from "./Routes/Collection";
import routerDiscount from "./Routes/Discount";
import routerOrder from "./Routes/Order";
import routerSearch from "./Routes/Search";
import routerCategory from "./Routes/Category";
import routerReport from "./Routes/Reports";
import routerRestore from "./Routes/Restore";
import routerVerification from "./Routes/Verification";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 8080;

// Create HTTP server and attach Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Attach the socket server to the app
app.set("socketio", io);

app.use(express.json());
app.use(cors());

// Register your routes
app.use("/user", routerUser);
app.use("/admin", routerAdmin);
app.use("/book", routerBook);
app.use("/cart", routerCart);
app.use("/collection", routerCollection);
app.use("/discount", routerDiscount);
app.use("/order", routerOrder);
app.use("/search", routerSearch);
app.use("/category", routerCategory);
app.use("/report", routerReport);
app.use("/restore", routerRestore);
app.use("/verify", routerVerification);

// Start the server
server.listen(port, () => {
    console.log(`Server active on port: ${port}`);
});
