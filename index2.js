let localId;
let bancoDeDados;
let nomeDoBancoDeDados = "BancoDePostit2";
let nomeDaLista = "listaDeDados2"

function criaBancoDeDados () {
    
    let requisicao = window.indexedDB.open( nomeDoBancoDeDados, 1);

    requisicao.onsuccess = (evento) => {

        bancoDeDados = requisicao.result;

        console.log("banco de dados criado", evento, bancoDeDados);
        
        mostrarCardNaTela ()
    }

    requisicao.onupgradeneeded = (evento) => {

        bancoDeDados = evento.target.result;

        const objetoSalvo = bancoDeDados.createObjectStore(nomeDaLista, {
            keyPath: "id",
            autoIncrement: true
        });

        objetoSalvo.createIndex("lembrete", "lembrete", {unique: false});

        console.log("houve um upgrade", evento)
    }


    requisicao.onerror = (evento) => {

        console.log("hove um erro", evento);
    }
}

function salvarDados (lembrete) {
    
   
    let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

    let novaMensagem = {mensagem: lembrete};

    listaParaAdicionar.add(novaMensagem);

    mostrarCardNaTela ()       
}


const abrirMenuEditar = (click) =>{

    localId = Number(click.target.getAttribute("data-id"));

    const paiDoAlvo = click.target.parentNode;
    const voDoalvo = paiDoAlvo.parentNode;
    
    const texto = voDoalvo.querySelector("p").textContent;

    let campoDeEdiçao = document.getElementById("mensagen-editada");
    campoDeEdiçao.value = texto
}

function salvarEdicao () {


    const lembrete = document.getElementById("mensagen-editada").value;

    let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");

    let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);

   
    let local = listaParaAdicionar.get(localId);

    local.onsuccess = function(e) {
        var data = e.target.result;
        data.mensagem = lembrete;
        listaParaAdicionar.put(data);
    }

    mostrarCardNaTela () 



   
}

function criarCard(conteudo, cursor) {

    let div = document.createElement("div");
    div.classList.add("post-it");

    let divtexto = document.createElement("div");

    let divFilha = document.createElement("div");
    divFilha.classList.add("xis");
    divFilha.textContent = "X";
    divFilha.classList.add("botao-cancelar");
    divFilha.setAttribute("data-id", cursor.value.id);
    divFilha.addEventListener("click", removerItem);
    divFilha.addEventListener("click", esmaecerItem);
    

    let pConteudo = document.createElement("p");
    pConteudo.classList.add("texto")
    pConteudo.textContent = conteudo;
    pConteudo.setAttribute("data-id", cursor.value.id)
    pConteudo.addEventListener('click', abrirMenuEditar);
    pConteudo.addEventListener("click", ()=>{

        const menuNav = document.querySelector('.nav-deslizante')
    
        menuNav.classList.toggle('nav-deslizante--ativo');
    })


    let divBotoes = document.createElement("div");
    divBotoes.classList.add("botao-post-it");


    
    

    divtexto.appendChild(divFilha);
    divtexto.appendChild(pConteudo);

  

        
    div.appendChild(divtexto);


    return div;
}

const esmaecerItem = (evento) =>{
    const paiDoAlvo = evento.target.parentNode;
    const voDoalvo = paiDoAlvo.parentNode;
    
    voDoalvo.classList.add("esmaecer");
}

const removerItem = (eventoClick) => {

    setTimeout(function(){
        
        console.log(eventoClick.target);
    
        const localId = Number(eventoClick.target.getAttribute("data-id"));
    
        let localParaAdicionar = bancoDeDados.transaction([nomeDaLista], "readwrite");
    
        let listaParaAdicionar = localParaAdicionar.objectStore(nomeDaLista);
    
        listaParaAdicionar.delete(localId);
    
        mostrarCardNaTela ();

    }, 800)

}

function mostrarCardNaTela(){

    let local = document.querySelector(".container-cards");
    local.innerHTML  = ""

    let objetoGuardado = bancoDeDados.transaction(nomeDaLista).objectStore(nomeDaLista);

    objetoGuardado.openCursor().onsuccess = (evento) => {

        const cursor = evento.target.result;

        if(cursor){

            const conteudo = cursor.value.mensagem

            const card = criarCard(conteudo, cursor); 
        
            local.appendChild(card)

            cursor.continue();
        }
    }
}

function pegarDados(){
    
    var campoInformacoes = document.querySelector("[data-mensagem]");
    var conteudo = campoInformacoes.value;
    
    if(conteudo.length > 0){
        
        salvarDados(conteudo);
               
        campoInformacoes.value = ""

    }else{
        alert("Esqueceu de digitar o seu lembrete")
    }
}

// Eventos

document.querySelector(".nav__botao-editar").addEventListener("click", ()=>{
   salvarEdicao()
})

document.querySelector(".botao-cancelar").addEventListener("click" ,()=>{
    var campoInformacoes = document.querySelector("[data-mensagem]");
    campoInformacoes.value = ""
});

document.querySelector(".botao-salvar").addEventListener("click", ()=>{
    pegarDados()
});

function adicionarEfeitoDeslizanteBotoes(){

    const botaoMenu = document.querySelectorAll('.botao-deslizante')
    const menu = document.querySelector('.menu-deslizante')

    botaoMenu.forEach(botao => {

        botao.addEventListener('click', () => {
        menu.classList.toggle('menu-deslizante--ativo')
        });
    });
}

function adicionarEfeitoBotaoEditar(){

    const botaoEditar = document.querySelectorAll(".botao-editar")
    const menuNav = document.querySelector('.nav-deslizante')

    botaoEditar.forEach(botao => {
        
        botao.addEventListener("click", ()=>{
    
            menuNav.classList.toggle('nav-deslizante--ativo');
        })
    })
}

criaBancoDeDados();

adicionarEfeitoDeslizanteBotoes();

adicionarEfeitoBotaoEditar();









/* 

var longclick = function (cb) {
var min = 1500;
var max = 9000;
var time, self, timeout, event;

function reset() {
    clearTimeout(timeout);
    timeout = null;
}

window.addEventListener('mouseup', reset); // caso o mouseup ocorra fora do elemento
    return function (e) {
        if (!self) {
            self = this;
            self.addEventListener('mouseup', function (e) {
                e.stopPropagation(); // para não subir no DOM
                var interval = new Date().getTime() - time;
                if (timeout && interval > min) cb.call(self, event);
                reset();
            });
        }
        event = e;
        time = new Date().getTime();

        if (e.type == 'mousedown') timeout = setTimeout(reset, max);
    };
};


var handler = longclick(function (e) {
    alert('clicado entre 2 e 4 segundos! ' + e.type);
   
});

var cardTexto = document.querySelectorAll(".texto");
.addEventListener('mousedown', handler); */