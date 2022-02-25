const express = require('express')
const path = require('path')
const app =express()
const PORT = process.env.PORT || 4000



var ip = require("ip")
let ipaddress = `http://${ip.address()}:4000`
console.log( `Please Use this address to chat with me from PC Laptop or IPad - http://${ip.address()}:4000` );

const server = app.listen(PORT,()=>{console.log(`Server is Running on http://localhost:${PORT}`)})
const io = require('socket.io')(server)
app.use(express.static(path.join(__dirname,'public')))

let socketConnection = new Set();



io.on('connection',onConnected)

function onConnected(socket)
{
    console.log(socket.id)
    socketConnection.add(socket.id)
    
    let connectionDetails ={
        ClientTotal: socketConnection.size,
        IpAddress: ipaddress
    }

    io.emit("connectionDetails",connectionDetails)

    socket.on('disconnect',()=>{
        socketConnection.delete(socket.id)
        io.emit("ClientTotal",socketConnection.size)
    })

    socket.on("message",(dataObject)=>{
        console.log(dataObject)
        
        socket.broadcast.emit("chat-Message",dataObject)
    })

    socket.on("feedback",(data)=>{
    
            socket.broadcast.emit("chat-feedback",data)
    })
}
console.log("see the path",path.join(__dirname,"public", "chat.bat"))
// exec(path.join(__dirname,"public", "chat.bat"), function(error, stdout, stderr) {
//            console.log(stdout);
//         });

