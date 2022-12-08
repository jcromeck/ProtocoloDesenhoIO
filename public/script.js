document.addEventListener('DOMContentLoaded', () => {
    const tela = document.querySelector('#tela');
    
    const palavra = document.querySelector('#palavra');
    
    const teste = document.querySelector('.teste');

    const contexto = tela.getContext('2d');
    const socket = io.connect();
    let jogadorAtual = "usuário"
    let numJogador = 0
    let pessoaADesenhar = false;

    const pincel = {
        ativo: false,
        movendo: false,
        pos:{x: 0, y: 0},
        posAnterior: null,
    }

    tela.width = 700;
    tela.height = 500;

    contexto.lineWidth = 4;
    contexto.strokeStyle = "black";
    colorAnterior="black";
    

    const desenharLinha = (linha) => {
        color = document.getElementById('colorPallete1').value;
        if(color!=colorAnterior){
            contexto.strokeStyle = color;
            colorAnterior=color;
        }
        if(linha){
            contexto.beginPath();
            contexto.moveTo(linha.posAnterior.x, linha.posAnterior.y);
            contexto.lineTo(linha.pos.x, linha.pos.y);
            contexto.stroke();
        } else{
            contexto.clearRect(0, 0, tela.width, tela.height);
        }
        
    }

    tela.onmousedown = (evento) => {
        pincel.ativo = true;
    }
    
    tela.onmouseup = (evento) => {
        pincel.ativo = false;
    }

    tela.onmousemove = (evento) => {
        pincel.pos.x = evento.clientX;
        pincel.pos.y = evento.clientY;
        pincel.movendo = true;
    }

    socket.on('desenhar', (linha) => {
        desenharLinha(linha);
    })
    socket.on('palavraGerada',(palavraChave)=>{
        document.getElementById("palavraDesenhar").innerHTML = palavraChave;
    })
    socket.on('funcaoStart',(bool)=>{
        StopCiclo(bool);
    })

    const ciclo = () => {
        if(pincel.ativo && pincel.movendo && pincel.posAnterior/* && pessoaADesenhar*/){
            socket.emit('desenhar', {pos: pincel.pos, posAnterior: pincel.posAnterior})
            pincel.movendo = false;
        }
        pincel.posAnterior = {x: pincel.pos.x, y: pincel.pos.y}

        document.body.addEventListener('keyup', e => {
            if(e.keyCode === 32){
              socket.emit('clear')
            }
          })
        setTimeout(ciclo, 10);
    }
    const StopCiclo=(bool)=>{
        console.log("Deu certo");
        pessoaADesenhar=bool;
        ciclo();
        if(bool){
            document.getElementById("resp").disabled = false;
            document.getElementById('palavraDesenhar').style.visibility= "visible";
        }else{
            contexto.clearRect(0,0,tela.width,tela.height);
            document.getElementById("resp").disabled = true;
            document.getElementById('palavraDesenhar').style.visibility= "hidden";
            socket.emit('novaPalavra')
        }
    }
    ciclo();
})
    
    