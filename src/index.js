const express = require('express')
const intermediarios = require('../src/controladores/intermediarios')
const app = express()
app.use(express.json())

const contas = require('./controladores/rotas')

app.get('/contas', intermediarios.verificarSenhaBanco, contas.listarDados)
app.post('/contas',contas.criarContaBancaria)
app.put('/contas/:id',contas.atualizarUsuarioDaConta)
app.delete('/contas/:id',contas.deletarUsuarioDaConta)

app.post('/transacoes/depositar',contas.depositarConta)
app.post('/transacoes/sacar',contas.sacarConta)
app.post('/transacoes/transferir',contas.transferirConta)

app.get('/contas/saldo',intermediarios.verificarSenhaUsuario,contas.verificarSaldo)
app.get('/contas/extrato',intermediarios.verificarSenhaUsuario,contas.verificarExtrato)

app.listen(3000)