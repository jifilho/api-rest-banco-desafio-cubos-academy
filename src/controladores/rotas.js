const express = require('express');
const app = express();
const dados = require('../bancodedados');

const verificarExistenciaCPF = (cpf) => {
  return dados.contas.find((cliente) => cliente.cpf === cpf);
};

const verificarExistenciaEmail = (email) => {
  return dados.contas.find((cliente) => cliente.email === email);
};

const buscarClientePorId = (id) => {
  return dados.contas.find((cliente) => cliente.id == id);
};

const listarDados = (req, res) => {
  if (dados.contas.length === 0) {
    return res.status(404).json({ mensagem: "Não existem contas cadastradas" });
  }

  return res.send(dados.contas);
};

const criarContaBancaria = (req, res) => {
  let ultimoId = 1;

  if (dados.contas.length > 0) {
    let ultimoIndice = dados.contas.length - 1;
    ultimoId = dados.contas[ultimoIndice].id + 1;
  }

  let { nome, cpf, dataNascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !dataNascimento || !telefone || !email || !senha) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  if (verificarExistenciaCPF(cpf)) {
    return res.status(400).json("CPF já foi utilizado.");
  }

  if (verificarExistenciaEmail(email)) {
    return res.status(400).json("E-mail já foi utilizado.");
  }

  let cadastrarCliente = {
    id: ultimoId,
    nome,
    cpf,
    dataNascimento,
    telefone,
    email,
    senha,
    saldo: 0,
  };

  dados.contas.push(cadastrarCliente);

  return res.status(201).json(cadastrarCliente);
};

const atualizarUsuarioDaConta = (req, res) => {
  const { id } = req.params;
  const { nome, cpf, dataNascimento, telefone, email, senha } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ mensagem: "Nenhum dado foi enviado para a atualização dos dados." });
  }

  let clienteEncontrado = buscarClientePorId(id);

  if (!clienteEncontrado) {
    return res.status(400).json({ mensagem: "Cliente não encontrado" });
  }

  if (cpf && verificarExistenciaCPF(cpf) && cpf !== clienteEncontrado.cpf) {
    return res.status(400).json("CPF já foi utilizado.");
  }

  if (email && verificarExistenciaEmail(email) && email !== clienteEncontrado.email) {
    return res.status(400).json("E-mail já foi utilizado.");
  }

  clienteEncontrado.nome = nome;
  clienteEncontrado.cpf = cpf;
  clienteEncontrado.dataNascimento = dataNascimento;
  clienteEncontrado.telefone = telefone;
  clienteEncontrado.email = email;
  clienteEncontrado.senha = senha;

  return res.status(201).json({ mensagem: "Seus dados foram atualizados com sucesso." });
};

const deletarUsuarioDaConta = (req, res) => {
  const { id } = req.params;

  if (id > dados.contas.length) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  if (dados.contas[id - 1].saldo > 0) {
    return res.status(400).json({ mensagem: "Usuário possui saldo maior que 0. Não é possível deletar conta." });
  }

  dados.contas.splice(id - 1, 1);

  return res.json({ mensagem: "Usuário deletado com sucesso." });
};

const depositarConta = (req, res) => {
  const { id, saldo } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensagem: "Nenhum dado foi enviado para o depósito." });
  }

  if (!id || !saldo) {
    return res.status(400).json({ mensagem: "Id e saldo são obrigatórios." });
  }

  let clienteEncontrado = buscarClientePorId(id);

  if (!clienteEncontrado) {
    return res.status(400).json({ mensagem: "Cliente não encontrado" });
  }

  if (saldo <= 0) {
    return res.status(400).json({ mensagem: "Valor inválido para depósito." });
  }

  clienteEncontrado.saldo += parseFloat(saldo);

  dados.depositos.push({
    data: new Date(),
    id: id,
    valor: parseFloat(saldo),
  });

  return res.send({ mensagem: "Depósito realizado com sucesso" });
};

const sacarConta = (req, res) => {
  const { id, saldo, senha } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensagem: "Nenhum dado foi enviado para o saque." });
  }

  if (!id || !saldo || !senha) {
    return res.status(400).json({ mensagem: "Id, saldo e senha são obrigatórios." });
  }

  let clienteEncontrado = buscarClientePorId(id);

  if (!clienteEncontrado) {
    return res.status(400).json({ mensagem: "Cliente não encontrado" });
  }

  if (saldo <= 0) {
    return res.status(400).json({ mensagem: "Valor inválido para saque." });
  }

  const senhaCorreta = clienteEncontrado.senha === senha;

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: "Senha incorreta." });
  }

  const saldoAtual = parseFloat(clienteEncontrado.saldo);
  const valorSaque = parseFloat(saldo);

  if (saldoAtual < valorSaque) {
    return res.status(400).json({ mensagem: "Saldo insuficiente para o saque." });
  }

  clienteEncontrado.saldo = saldoAtual - valorSaque;

  dados.saques.push({
    data: new Date(),
    id: id,
    valor: valorSaque,
  });

  return res.send({ mensagem: "Saque realizado com sucesso." });
};

const transferirConta = (req, res) => {
  const { depositante, recebedor, valor, senha } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ mensagem: "Nenhum dado foi enviado para a transferência." });
  }

  let depositanteEncontrado = buscarClientePorId(depositante);

  if (!depositanteEncontrado) {
    return res.status(400).json({ mensagem: "Depositante não encontrado" });
  }

  let recebedorEncontrado = buscarClientePorId(recebedor);

  if (!recebedorEncontrado) {
    return res.status(400).json({ mensagem: "Recebedor não encontrado" });
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "A senha deve ser informada." });
  }

  if (senha !== depositanteEncontrado.senha) {
    return res.status(400).json({ mensagem: "Senha inválida! Tente novamente." });
  }

  if (!valor) {
    return res.status(400).json({ mensagem: "Valor deve ser informado." });
  }

  if (depositanteEncontrado.saldo === 0 || valor > depositanteEncontrado.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente para realizar transferência." });
  }

  const depositanteParseado = parseFloat(depositanteEncontrado.saldo);
  const recebedorParseado = parseFloat(recebedorEncontrado.saldo);

  depositanteEncontrado.saldo = depositanteParseado - valor;
  recebedorEncontrado.saldo = recebedorParseado + valor;

  dados.transferencias.push({
    data: new Date(),
    valor: valor,
    depositante: depositante,
    recebedor: recebedor,
  });

  return res.send({ mensagem: "Transferência realizada com sucesso." });
};

const verificarSaldo = (req, res) => {
  const { id } = req.query;

  const saldoEncontrado = dados.contas.find((dado) => dado.id === Number(id));

  if (saldoEncontrado) {
    return res.send(`Saldo: ${saldoEncontrado.saldo}`);
  }
};

const verificarExtrato = (req, res) => {
  const { id } = req.query;

  const saqueEncontrado = dados.saques.find((dado) => dado.id === Number(id));
  const depositoEncontrado = dados.depositos.find((dado) => dado.id === Number(id));
  const transferenciaEncontrada = dados.transferencias.find((dado) => Number(dado.depositante) === Number(id));

  const resultado = {
    Saques: saqueEncontrado,
    Depósitos: depositoEncontrado,
    Transferências: transferenciaEncontrada,
  };

  res.send(resultado);
};

module.exports = {
  listarDados,
  criarContaBancaria,
  atualizarUsuarioDaConta,
  deletarUsuarioDaConta,
  depositarConta,
  sacarConta,
  transferirConta,
  verificarSaldo,
  verificarExtrato,
};
