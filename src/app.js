const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
});

server.listen(PORT, () => {
    console.log("listening on: " + PORT);
});

let rooms = [];

io.on("connection", (socket) => {
    console.log("Got a connection: " + socket.id);

    socket.on("createRoom", (creationObject, callback) => {
        const { items, name, total } = creationObject;
        const id = random4Digit();

        let unTaxtedTotal = 0;

        items.forEach((item) => {
            unTaxtedTotal += item.quantity * item.price;
        });

        let taxPercent = total / unTaxtedTotal - 1;
        let taxAmount = taxPercent * unTaxtedTotal;

        let room = {
            host: socket.id,
            items,
            id,
            total,
            unTaxtedTotal,
            taxAmount,
            taxPercent,
            users: [{ id: socket.id, name, selectedItems: [], total: 0 }],
        };
        rooms.push(room);
        socket.join(id);

        callback({ room, userID: socket.id });
    });

    socket.on("joinRoom", (info, callback) => {
        const room = rooms.find((room) => {
            return room.id === info.id;
        });

        if (room) {
            room.users.push({
                id: socket.id,
                name: info.name,
                selectedItems: [],
                total: 0,
            });
        }

        socket.join(room.id);
        callback({ room, userID: socket.id });
        console.log(room);
    });

    socket.on("itemSelected", (info, callback) => {
        const room = rooms.find((room) => {
            return room.id === info.roomID;
        });

        for (let i = 0; i < room.items.length; i++) {
            if (room.items[i].name == info.item.name) {
                if (!room.items[i].users) {
                    room.items[i].users = [];
                }

                let userName = room.users.find((user) => {
                    return user.id == socket.id;
                }).name;

                room.items[i].users.push({ userID: socket.id, userName });
                console.log(room.items[i].users);
            }
        }

        let userIndex = room.users.findIndex((user) => {
            return user.id === socket.id;
        });

        room.users[userIndex].selectedItems.push(info.item);

        let userTotal = 0;

        for (let i = 0; i < room.users.length; i++) {
            let total = 0;

            for (let j = 0; j < room.users[i].selectedItems.length; j++) {
                let itemPrice;
                let index = room.items.findIndex((item) => {
                    return item.name === room.users[i].selectedItems[j].name;
                });

                itemPrice =
                    (room.items[index].price * room.items[index].quantity) /
                    room.items[index].users.length;

                total += itemPrice + room.taxPercent * itemPrice;
            }

            room.users[i].total = total;
            userTotal = total;
        }

        io.to(room.id).emit("receiptUpdate", room);
        console.log(room);
    });

    socket.on("itemDeselected", (info, callback) => {
        const room = rooms.find((room) => {
            return room.id === info.roomID;
        });

        console.log("ITEM DESELECTED");

        for (let i = 0; i < room.items.length; i++) {
            if (room.items[i].name == info.item.name) {
                let idIndex = room.items[i].users.findIndex((user) => {
                    return user.userID === socket.id;
                });

                console.log("ID INDEX: " + idIndex);

                room.items[i].users.splice(idIndex, 1);

                console.log("AFTER REMOVAL: ");
                console.log(room.items[i].users);
            }
        }

        let userIndex = room.users.findIndex((user) => {
            return user.id === socket.id;
        });

        let itemIndex = room.users[userIndex].selectedItems.findIndex(
            (item) => {
                return item.name === info.item.name;
            }
        );

        room.users[userIndex].selectedItems.splice(itemIndex, 1);

        let userTotal = 0;

        for (let i = 0; i < room.users.length; i++) {
            let total = 0;

            for (let j = 0; j < room.users[i].selectedItems.length; j++) {
                let itemPrice;
                let index = room.items.findIndex((item) => {
                    return item.name === room.users[i].selectedItems[j].name;
                });

                itemPrice =
                    (room.items[index].price * room.items[index].quantity) /
                    room.items[index].users.length;

                total += itemPrice + room.taxPercent * itemPrice;
            }

            room.users[i].total = total;
            userTotal = total;
        }

        console.log(room);
        io.to(room.id).emit("receiptUpdate", room);
    });
});

function random4Digit() {
    return shuffle("0123456789".split("")).join("").substring(0, 4);
}

function shuffle(o) {
    for (
        var j, x, i = o.length;
        i;
        j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
    );
    return o;
}
