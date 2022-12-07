const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socketIo = require('socket.io');

const io = socketIo(server);
const animals = [];
animals.push("Cachorro", "Cavalo", "Porco", "Guaxinim", "Gato", "Pinguim", "Calopsita", "Tucano", "Chimpanzé", "Tigre", "Leão", "Gorila", "Baleia", "Águia", "Cobra");

server.listen(3000, () => {
    console.log("running");
})

app.use(express.static(__dirname + "/public"))

var historico = []
let numConexoes =1;
var numAcertaram=0;

io.on('connection', (socket) => {
    console.log('Nova conexão');
    socket.emit('pintor',numConexoes)
    //socket.emit('horaPintar')
    numConexoes++;

    historico.forEach(linha => {
        socket.emit('desenhar', linha)
    })
    socket.on('horaPintar', () => {
        socket.emit('pintor',numConexoes)
    })

    socket.on('desenhar', (linha) => {
        historico.push(linha)
        io.emit('desenhar', linha)
    })
    
    socket.on('msg', (msg) =>{
        console.log(msg)
        io.emit('msg', msg);
    })
    socket.on('mudarPalavra',()=>{
        animal = animals[Math.floor(Math.random() * animals.length)];
        io.emit('novaPalavra',(animal))
        io.emit('palavraCerta',(animal))
    })
    socket.on('acertou',()=>{
        numAcertaram++;
        if(numAcertaram == numConexoes){
            io.emit('fimdaRodada')
            numAcertaram=0;
        }
    })
    socket.on('clear', () => {
        historico = new Array()
        io.emit('desenhar')
    })
})