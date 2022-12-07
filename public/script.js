document.addEventListener('DOMContentLoaded', () => {
    const tela = document.querySelector('#tela');
    const contexto = tela.getContext('2d');

    const socket = io.connect();

    const pincel = {
        ativo: false,
        movendo: false,
        pos:{x: 0, y: 0},
        posAnterior: null,
    }
    pessoaADesenhar = false;
    segundos=150;
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
        }else{
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

    socket.on('pintor',(num)=>{
        contagemVez = num;
    })
    socket.on('desenhar', (linha) => {
        desenharLinha(linha);
    })
    socket.on('fimdaRodada', () => {
        contagemRegressiva(0);
        contexto.clearRect(0,0,tela.width,tela.height);
    })
    socket.on('novaPalavra',(animal) => {
        document.getElementById('palavraDesenhar').value=animal;
  })
    

    const ciclo = () => {
        if(pincel.ativo && pincel.movendo && pincel.posAnterior && pessoaADesenhar){
            socket.emit('desenhar', {pos: pincel.pos, posAnterior: pincel.posAnterior})
            pincel.movendo = false;
        }
        pincel.posAnterior = {x: pincel.pos.x, y: pincel.pos.y}
        document.body.addEventListener('keyup', e => {
            if(e.keyCode === 32){
              socket.emit('clear')
            }
          })
        if(segundos !=0){
            setTimeout(ciclo, 10);
        }
    }
    const ordemDesenhar = () =>{
        contagemVez--;
        if(contagemVez==0){
            pessoaADesenhar=true;
            socket.emit('cancelarmensagem',0)
            segundos=150;
            contagemRegressiva(segundos);
            document.getElementById('palavraDesenhar').style.visibility= visible;
        }
    }
    const contagemRegressiva = (segundo)=> {
            if(segundo==0){
                pessoaADesenhar = false;
                segundos=0;
                socket.emit('cancelarmensagem',1)
                socket.emit('horaPintar')
                ordemDesenhar;
                document.getElementById('palavraDesenhar').style.visibility= hidden;
                
            }else{
                ciclo();
                document.getElementById("second").innerHTML =segundo;
                segundo--;
                setTimeout(contagemRegressiva(segundo),1000);
            }
    }
    ordemDesenhar();
    
    
})