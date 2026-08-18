const input = document.getElementById("mensagem");
const botao = document.getElementById("enviar");
const chat = document.getElementById("chat");

async function enviarMensagem() {
  const message = input.value.trim();

  if (!message) return;

  // Mostra a mensagem da cliente
  const mensagemCliente = document.createElement("div");
  mensagemCliente.className = "mensagem";
  mensagemCliente.textContent = message;
  chat.appendChild(mensagemCliente);

  input.value = "";

  try {
    const resposta = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const dados = await resposta.json();

    const mensagemBot = document.createElement("div");
    mensagemBot.className = "mensagem bot";
    mensagemBot.textContent = dados.response || "Não consegui responder agora.";
    chat.appendChild(mensagemBot);

    chat.scrollTop = chat.scrollHeight;

  } catch (erro) {
    const mensagemErro = document.createElement("div");
    mensagemErro.className = "mensagem bot";
    mensagemErro.textContent = "Ops! Não consegui responder. Tente novamente.";
    chat.appendChild(mensagemErro);
  }
}

botao.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enviarMensagem();
  }
});