const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketio = require('socket.io');
const sessids = require('sessids')("sessions.json");
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const os = express();
let booted = false;
os.use(sessids.sessions);
os.all("*", (req, res, next) => {
    if (!booted) {
        res.send(fs.readFileSync(path.join(__dirname, "startup.html"), { encoding: "utf8" }));
        booted = true;
    }else {
        next();
    }
});
os.use(express.static(path.join(__dirname, "os")));
os.all("*", (req, res) => {
    res.status(404).send(fs.readFileSync(path.join(__dirname, "errors/404.html"), { encoding: "utf8" }));
});
const webserver = http.createServer(os);
webserver.listen(100, () => {
    console.log("running");
});
const io = new socketio.Server(webserver);
let userfixable = false;
io.on("connection", client => {
    client.on("load", msg => {
        try {
            if (msg.load == "users") {
                const result = [];
                const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), { encoding: "utf8" }));
                if (users.length <= 0) {
                    throw new Error("not enough users");
                }
                for (const user of users) {
                    result.push(user.username);
                }
                client.emit("loaded", result);
            }
        }catch {
            if (msg.load == "users") {
                client.emit(
                    "error",
                    "fatal error WOS1-FTLU: failed to load users <button onclick=\"WOS1_FTLU_FIX()\">fix</button>"
                );
                userfixable = true;
            }
        }
    });
    client.on("login", msg => {
        try {
            const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), { encoding: "utf8" }));
            for (const user of users) {
                if (user.username == msg.username) {
                    if (bcrypt.compareSync(msg.password, user.password)) {
                        sessids.find({ id: msg.sessid })[0].data.set("username", msg.username);
                        client.emit("login", "success");
                    }else {
                        client.emit("login", "failed");
                    }
                }
            }
        } catch {}
    });
    client.on("fix-users", user => {
        try {
            if (userfixable) {
                fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(
                    [
                        {
                            username: user.username,
                            password: bcrypt.hashSync(user.password, 10)
                        }
                    ]
                ), { encoding: "utf8" });
                userfixable = false;
            }
        } catch {}
    });
    client.on("command", (command, callback) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                callback(`exec error: ${error}`);
            }
            callback(stdout);
        });
    })
    client.on("disconnect", () => {
    });
});
