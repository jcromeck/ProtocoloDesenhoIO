const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');

const io = socketIo(server);


let autoId = 0;
let players = [];
let limite = 0

server.listen(3000, () => {
    console.log("running");
})

app.use(express.static(__dirname + "/public"))

var historico = []
var palavraChave = ['L' , 'R' , 'U' , 'B' , 'F'];

io.on('connection', (socket) => {
    if(limite <=4){
        limite++;
        players.push(socket);
        randomPlayer = Math.random() * players.length;
        if(randomPlayer%2 != 0){
            randomPlayer--;
        }
        random = Math.random() * palavraChave.length;
        io.emit('palavraGerada',random)
        
        historico.forEach(linha => {
            socket.emit('desenhar', linha)
        })
        socket.on('novaPalavra',()=>{
            random = Math.random() * palavraChave.length;
            io.emit('palavraGerada',random)
        })
        socket.on('desenhar', (linha) => {
            historico.push(linha)
            io.emit('desenhar', linha)
        })
        socket.on('funcaoStart',(bool)=>{
            io.emit('funcaoStart', bool)
        })
        socket.on('msg', (msg) => {
            console.log(msg)
            io.emit('msg', msg);
        })
        socket.on('clear', () => {
            historico = new Array()
            io.emit('desenhar')
        })
    }else{
        document.querySelector('#palavra').innerHTML = 'servidor cheio'
        historico.push(linha)
        document.getElementById("resp").disabled = true;
    }
    console.log(`Nova conexão`);
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
})

