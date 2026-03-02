let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

function salvar() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
}

function adicionarCliente() {
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;

  if (!nome || !telefone) {
    alert("Preencha todos os campos");
    return;
  }

  clientes.push({
    nome,
    telefone,
    data: new Date(),
    respondeu: false
  });

  salvar();
  render();
}

function marcarRespondido(index) {
  clientes[index].respondeu = true;
  salvar();
  render();
}

function getStatus(cliente) {
  if (cliente.respondeu) return { classe: 'verde', texto: 'Respondido' };

  const agora = new Date();
  const data = new Date(cliente.data);
  const horas = (agora - data) / (1000 * 60 * 60);

  if (horas > 48) return { classe: 'vermelho', texto: 'Ligar' };
  if (horas > 24) return { classe: 'amarelo', texto: 'Follow-up' };
  return { classe: 'verde', texto: 'Aguardando' };
}

function formatTempo(data) {
  const agora = new Date();
  const diff = (agora - new Date(data)) / 1000;

  const horas = Math.floor(diff / 3600);
  if (horas < 1) return 'Agora';
  if (horas < 24) return horas + 'h';

  const dias = Math.floor(horas / 24);
  return dias + 'd';
}

function render() {
  const tabela = document.getElementById('tabela');
  tabela.innerHTML = '';

  let respondidos = 0;

  clientes.forEach((c, i) => {
    if (c.respondeu) respondidos++;

    const status = getStatus(c);

    tabela.innerHTML += `
      <tr class="${status.classe}">
        <td>${c.nome}</td>
        <td>${formatTempo(c.data)}</td>
        <td>${status.texto}</td>
        <td>
          ${!c.respondeu ? `<button onclick="marcarRespondido(${i})">Respondeu</button>` : '✔'}
        </td>
        <td>
          <a href="https://wa.me/${c.telefone}" target="_blank">
            <button>WhatsApp</button>
          </a>
        </td>
      </tr>
    `;
  });

  document.getElementById('resumo').innerText =
    `${respondidos}/${clientes.length} responderam`;
}

render();
setInterval(render, 60000);
