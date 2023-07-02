const express = require('express')

const dados = require('../bancodedados')
const verificarSenhaBanco = (req, res, next) => {
    const {senha} = req.query;
    if (!senha) {
      return res.status(400).json({ mensagem: "A senha é obrigatória." });
    }
  
    if (senha !== dados.banco.senha) {
      return res.status(400).json({ mensagem: "A senha está incorreta." });
    }
  
    next();
  };

  const verificarSenhaUsuario = (req, res, next) => {
    const { id, senha } = req.query;
  
    if (!id || !senha) {
      return res.status(400).json({ mensagem: 'ID e senha são obrigatórios.' })
    }
  
    const buscarClientePorId = (id) => {
      return dados.contas.find(cliente => {
        return cliente.id == id;
      });
    };
  
    let clienteEncontrado = buscarClientePorId(id)
  
    if (!clienteEncontrado) {
      return res.status(400).json({ mensagem: 'Cliente não encontrado.' })
    }
    
    if (senha !== clienteEncontrado.senha) {
      return res.status(400).json({ mensagem: 'Senha incorreta.' })
    }
  
    next()
  };
  

module.exports = {
    verificarSenhaBanco,
    verificarSenhaUsuario
}