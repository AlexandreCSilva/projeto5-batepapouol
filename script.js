// Variaveis auxiliares
let resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
let usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios);
let nome = "";
const tempo = Math.random() * (5000 - 300) + 300;

// Função que retorna caso tenhamos algum erro da api
function retornarErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
};

// Função que retorna o erro e recarrega a pagina pra que ele digite um novo nome
function retornarErroNome(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
    window.location.reload();
};

// Função que renderiza as mensagens
function renderizarMensagens(resposta){
    const ul = document.querySelector(".conteudo");
    ul.innerHTML = '<div></div><div></div><div></div>'
    let filha;
    let name;
    
    for (let i = 1; i < (resposta.data).length; i++){
        ul.innerHTML += 
        `<div class="mensagem">
            <span class="time">(${resposta.data[i].time})</span>
            <span class="name"><strong>${resposta.data[i].from}</strong></span>
            <span class="message">${resposta.data[i].text}</span>
        </div>`
        
        i+=3;
        filha = document.querySelector(".conteudo :nth-child("+i+")")
        name = document.querySelector(".conteudo :nth-child("+i+") .name")
        i-=3;
        
        if (resposta.data[i].type == "status"){
            filha.classList.add("system")
        } else if (resposta.data[i].type == "private_message" && (resposta.data[i].to == nome.name || resposta.data[i].from == nome.name)){
            filha.classList.add("private")
            name.innerHTML += ` reservadamente para <strong>${resposta.data[i].to}</strong>:`
        } else {
            name.innerHTML += ` para <strong>${resposta.data[i].to}</strong>:`
        }
    }

    // Scrollando a ultima mensagem pra tela do usuario
    const ultimaMensagem = document.querySelector(".conteudo :nth-child("+((resposta.data).length)+")");
    ultimaMensagem.scrollIntoView();
};

// Função que recebe o nome digitado pelo usuario e caso o mesmo for valido carrega a pagina
function digitandoNome(){
    const input = document.querySelector(".inicial input");
    
    if (input.value != ""){
        nome = 
            {
                name: input.value
            }
        axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome).catch(retornarErroNome);
        axios.get('https://mock-api.driven.com.br/api/v6/uol/participants', nome).then(renderizarUsuarios);
        setTimeout(carregarPagina(), tempo);
    }
};

// Função que torna o menu lateral visivel
function menuLateral(){
    const menu = document.querySelector(".menu");
    
    menu.classList.remove("escondida");
    setTimeout(function(){menu.classList.add("visivel");}, 10);
};

// Função que renderiza o menu lateral na tela
function renderizarUsuarios(resposta){
    const menuLateral = document.querySelector(".menulateral");
    let scrolar = menuLateral.scrollTop;
    let usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
    let visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)");
    
    if (usuarioEscolhido == null){ 
        menuLateral.innerHTML = `
        <p><strong>Escolha um contato para enviar mensagem:</strong></p>
        <div data-identifier="participant" class="usuarios escolhido" onclick="selecionarUsuario(this)">
            <div class="icone"><ion-icon name="people"></ion-icon> </div>
            <div class="nomeUsuarios">Todos</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
        usuarioEscolhido = document.querySelector(".usuarios");
        usuarioEscolhido.classList.add("selecionado")
    } else {
        menuLateral.innerHTML = `
        <p><strong>Escolha um contato para enviar mensagem:</strong></p>
        <div class="usuarios" onclick="selecionarUsuario(this)">
            <div class="icone"><ion-icon name="people"></ion-icon> </div>
            <div class="nomeUsuarios">Todos</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
    }

    for (let i = 1; i < (resposta.data).length; i++){
        if (usuarioEscolhido != null && usuarioEscolhido.innerHTML == resposta.data[i].name){
            menuLateral.innerHTML += `
            <div data-identifier="participant" class="usuarios selecionado" onclick="selecionarUsuario(this)">
                <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
                <div class="nomeUsuarios">${resposta.data[i].name}</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
            usuarioEscolhido = null;
        } else if ((i == (resposta.data).length - 1) && (usuarioEscolhido != null)){
            usuarioEscolhido = null;
            const todos = document.querySelector(".usuarios");
            todos.classList.add("selecionado");
        } else {
            menuLateral.innerHTML += `
            <div data-identifier="participant" class="usuarios" onclick="selecionarUsuario(this)">
                <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
                <div class="nomeUsuarios">${resposta.data[i].name}</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        }
    }
      
    if (visibilidadeEscolhida == null){
        menuLateral.innerHTML += `
        <p><strong>Escolha a visibilidade:</strong></p>
        <div class="visibilidade selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
            <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
            <div class="nomeUsuarios">Público</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>
        <div class="visibilidade" onclick="selecionarVisibilidade(this)">
            <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
            <div class="nomeUsuarios">Reservadamente</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
    } else {
        if (visibilidadeEscolhida.innerHTML == "Público"){
            menuLateral.innerHTML += `
            <p><strong>Escolha a visibilidade:</strong></p>
            <div data-identifier="visibility" class="visibilidade selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
                <div class="nomeUsuarios">Público</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>
            <div data-identifier="visibility" class="visibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
                <div class="nomeUsuarios">Reservadamente</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        } else {
            menuLateral.innerHTML += `
            <p><strong>Escolha a visibilidade:</strong></p>
            <div data-identifier="visibility" class="visibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
                <div class="nomeUsuarios">Público</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>
            <div data-identifier="visibility" class="visibilidade  selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
                <div class="nomeUsuarios">Reservadamente</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        }
    }

    // Fazendo (mas não 100%) o elemento voltar com o scroll aonde ele tava
    setTimeout(function(){menuLateral.scrollTop = scrolar;}, 10)
};

// Função que envia o nome do usuario pra API
function atualizarStatus(){ 
    if (nome != ""){
         axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome).catch(atualizarPagina); 
    }
};

// Atualizando o status de 5 em 5 segundos
setInterval(atualizarStatus , 5000);

// Função que atualiza os usuarios de acordo com a API
function atualizandoUsuarios(){
    usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios).catch(retornarErroNome);
};

// Atualizando os usuarios de 10 em 10 segundos
setInterval(atualizandoUsuarios, 10000);

// Função que atualiza as mensagens de acordo com a API
function atualizandoMensagens(){
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
};

// Atualizando as mansagens de 3 em 3 segundos
setInterval(atualizandoMensagens, 3000);

// Função que muda o placeholder da input com nome
function inputPlaceholder(){
    const usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
    const visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)");
    const input = document.querySelector(".digitar input");
    
    input.placeholder = "Escreva aqui..."
    if (usuarioEscolhido != null && usuarioEscolhido.innerHTML != "Todos"){
        input.placeholder += "\n Enviando para "+ usuarioEscolhido.innerHTML;
    }
    if (visibilidadeEscolhida.innerHTML != "Público"){
        input.placeholder += " (reservadamente)"
    }
}

// Função que faz sair do menu lateral
function voltar(){
    const menu = document.querySelector(".menu");
    
    menu.classList.remove("visivel");
    menu.classList.add("invisivel");
    setTimeout(escondendoMenuLateral, 1000);
};

// Função que tira o menu lateral da frente do conteudo
function escondendoMenuLateral() { 
    const menu = document.querySelector(".menu");
    
    menu.classList.add("escondida");
    menu.classList.remove("invisivel");  
};

// Função que seleciona o usuario que você quer mandar mensagem
function selecionarUsuario(elemento){
    const selecionado = document.querySelector(".selecionado");
    
    selecionado.classList.remove("selecionado");
    elemento.classList.add("selecionado");
    inputPlaceholder();
};

// Função que seleciona a visibilidade da sua mensagem
function selecionarVisibilidade(elemento){
    const selecionado = document.querySelector(".selecionadoVisibilidade");
    
    selecionado.classList.remove("selecionadoVisibilidade");
    elemento.classList.add("selecionadoVisibilidade");
    inputPlaceholder();
};

// Função que envia a mensagem pra API
function enviarMensagem(){
    let input = document.querySelector(".digitar input");
    let tipo = "message";
    
    if (input.value != ""){
        const usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
        const visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)")
        if (visibilidadeEscolhida.innerHTML != "Público"){
            tipo = "private_message";
        } else {
            tipo = "message"
        }
        const mensagem =
        {
            from: nome.name,
            to: usuarioEscolhido.innerHTML,
	        text: input.value,
	        type: tipo
        }
        input.value = "";
        axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem).catch(atualizarPagina);
    }
};

// Função que envia mensagens pelo Enter
function enviarEnter(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    
    if (charCode == '13'){
        enviarMensagem();
    }
};

// Função que atualiza a pagina
function atualizarPagina(){
    window.location.reload();
};

// Função que carrega a pagina
function carregarPagina(){
    const inicial = document.querySelector(".inicial");
    
    inicial.classList.remove("nomeando");
    inicial.classList.add("carregando");
    setTimeout(function(){inicial.classList.add("escondida");}, tempo)
}