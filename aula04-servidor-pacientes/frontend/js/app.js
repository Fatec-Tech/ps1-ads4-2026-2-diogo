
const URL_API = 'https://api-clinica-diogo-iori.onrender.com/pacientes';

let pacientes = [];
let pacienteEditando = null;

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');

const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoNascimento = document.getElementById('nascimento');

const botaoSubmit = document.getElementById('btn-submit');
const botaoCancelar = document.getElementById('btn-cancelar');

// Formata a data para exibição
function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Carrega os pacientes do backend
async function carregarPacientes() {
    mensagemCarregando.style.display = 'block';
    mensagemCarregando.textContent = 'Carregando pacientes...';

    try {
        const resposta = await fetch(URL_API);

        if (!resposta.ok) {
            throw new Error('Erro ao carregar pacientes');
        }

        pacientes = await resposta.json();

        renderizarTabela();

        mensagemCarregando.style.display = 'none';

    } catch (erro) {
        console.error(erro);
        mensagemCarregando.textContent =
            'Erro ao carregar pacientes. Verifique o servidor.';
    }
}

// Renderiza os pacientes na tabela
function renderizarTabela() {
    tabela.innerHTML = '';

    pacientes.forEach((paciente) => {
        const linha = document.createElement('tr');

        const colunaNome = document.createElement('td');
        colunaNome.textContent = paciente.nome;

        const colunaEmail = document.createElement('td');
        colunaEmail.textContent = paciente.email;

        const colunaNascimento = document.createElement('td');
        colunaNascimento.textContent =
            formatarData(paciente.nascimento);

        const colunaAcoes = document.createElement('td');

        // Botão Editar
        const botaoEditar = document.createElement('button');
        botaoEditar.textContent = 'Editar';
        botaoEditar.className = 'btn btn-warning btn-sm me-2';

        botaoEditar.addEventListener('click', () => {
            editarPaciente(paciente);
        });

        // Botão Excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.className = 'btn btn-danger btn-sm';

        botaoExcluir.addEventListener('click', () => {
            excluirPaciente(paciente.id);
        });

        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoExcluir);

        linha.appendChild(colunaNome);
        linha.appendChild(colunaEmail);
        linha.appendChild(colunaNascimento);
        linha.appendChild(colunaAcoes);

        tabela.appendChild(linha);
    });
}

// Cadastrar ou atualizar paciente
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const paciente = {
        nome: campoNome.value,
        email: campoEmail.value,
        nascimento: campoNascimento.value
    };

    try {
        let resposta;

        if (pacienteEditando === null) {
            // CREATE - POST
            resposta = await fetch(URL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });

        } else {
            // UPDATE - PUT
            resposta = await fetch(`${URL_API}/${pacienteEditando}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });
        }

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || 'Erro ao salvar paciente');
        }

        formulario.reset();
        cancelarEdicao();

        await carregarPacientes();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
});

// Preenche o formulário para edição
function editarPaciente(paciente) {
    pacienteEditando = paciente.id;

    campoNome.value = paciente.nome;
    campoEmail.value = paciente.email;
    campoNascimento.value = paciente.nascimento;

    botaoSubmit.textContent = 'Salvar alterações';
    botaoCancelar.classList.remove('d-none');

    campoNome.focus();
}

// Cancela o modo de edição
function cancelarEdicao() {
    pacienteEditando = null;

    formulario.reset();

    botaoSubmit.textContent = 'Cadastrar';
    botaoCancelar.classList.add('d-none');
}

// Botão cancelar
botaoCancelar.addEventListener('click', cancelarEdicao);

// Excluir paciente
async function excluirPaciente(id) {
    const confirmar = confirm('Deseja realmente excluir este paciente?');

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao excluir paciente');
        }

        await carregarPacientes();

    } catch (erro) {
        alert(erro.message);
        console.error(erro);
    }
}

// Inicia o carregamento dos pacientes
carregarPacientes();
