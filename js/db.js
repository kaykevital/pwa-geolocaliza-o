import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('locais', {
                            // A propriedade nome será o campo chave
                            keyPath: 'nome'
                        });
                        // Criando um índice id na store, deve estar contido no objeto do banco.
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message)
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();

    document.getElementById("btnSalvar").addEventListener("click", addData);
    document.getElementById("btnListar").addEventListener("click", getData);
    document.getElementById("btnAtualizar").addEventListener("click", atualizar);
    document.getElementById("btnRemover").addEventListener("click", remover);
    document.getElementById('btnBuscar').addEventListener("click", buscar);
});

async function getData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }

    const tx = await db.transaction('locais', 'readonly')
    const store = tx.objectStore('locais');
    const value = await store.getAll();
    if (value) {

        const listagem = value.map(local => {
            return `<div>
                <p> ${local.nome}</p>
                <p> ${local.lat}</p>
                <p> ${local.long}</p>
            </div>`
        })
        showResult("Dados do banco: " + listagem.join(''))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}


async function addData() {
    let nome = document.getElementById("nome").value;
    let lat = document.getElementById("lat").value;
    let long = document.getElementById("long").value;
    const tx = await db.transaction('locais', 'readwrite')
    const store = tx.objectStore('locais');
    try {
        await store.add({ nome: nome, lat: lat, long: long  });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

function showResult(text) {
    document.getElementById('resultados').innerHTML = text;
}

async function buscar() {
    let nomeBuscado = document.getElementById('buscarNome').value;
    const tx = db.transaction('locais', 'readonly');
    const store = tx.objectStore('locais');
    try {
        let objetoBuscado = await store.get(nomeBuscado);
        document.getElementById('nome').value = objetoBuscado.nome;
        document.getElementById('lat').value = objetoBuscado.lat;
        document.getElementById('long').value = objetoBuscado.long;
    } catch (error) {
        console.log(error.message);
    }
}

async function atualizar() {
    let nome = document.getElementById("nome").value;
    let lat = document.getElementById("lat").value;
    let long = document.getElementById("long").value;
    const tx = await db.transaction('locais', 'readwrite')
    const store = tx.objectStore('locais');
    try {
        let objBuscado = await store.get(nome)
        objBuscado = { nome: nome, lat: Number(lat), long: Number(long) }
        await store.put(objBuscado);
        await tx.done;
        console.log('Registro atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        tx.abort();
    }
}

async function remover() {
    let nome = document.getElementById("nome").value;
    const tx = await db.transaction('locais', 'readwrite')
    const store = tx.objectStore('locais');
    try {
        let objBuscado = await store.get(nome)
        await store.delete(objBuscado.nome);
        await tx.done;
        console.log('Registro removido com sucesso!');
    } catch (error) {
        console.error('Erro ao remover registro:', error);
        tx.abort();
    }
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('lat').value = '';
    document.getElementById('long').value = '';
}