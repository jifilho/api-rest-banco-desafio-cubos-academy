# Desafio Back-end - Módulo 2 | API de Banco Digital

## Olá, pessoal!

Nesta apresentação, vou compartilhar com vocês o projeto incrível que desenvolvi para o desafio de Back-end do Módulo 2. A minha tarefa como desenvolvedor foi criar uma API para um Banco Digital. Vamos mergulhar nesse projeto piloto e explorar suas funcionalidades.

## Visão Geral do Projeto

Este Banco Digital é mais do que uma simples API - é uma solução completa para operações bancárias. Aqui estão algumas das funcionalidades que desenvolvi:

- **Criar conta bancária**: Permite a criação de novas contas bancárias com informações do usuário.
- **Atualizar dados do usuário**: Permite a atualização das informações de um usuário existente.
- **Depositar**: Permite que os clientes depositem dinheiro em suas contas.
- **Sacar**: Possibilita o saque de dinheiro das contas dos clientes.
- **Transferir**: Facilita a transferência de valores entre contas bancárias.
- **Consultar saldo**: Fornece informações sobre o saldo disponível em uma conta.
- **Emitir extrato bancário**: Gera um relatório detalhado das transações realizadas em uma conta.
- **Excluir conta bancária**: Permite a exclusão de contas bancárias quando o saldo é zero.

## Tecnologias Utilizadas

Para criar essa incrível API, utilizei as seguintes tecnologias:

- **Node.js**: Plataforma de desenvolvimento backend.
- **Express.js**: Framework para criação de APIs RESTful.
- **date-fns**: Biblioteca para formatação de datas.

## Estrutura do Projeto

O projeto está organizado de forma modular e segue a seguinte estrutura:

- `index.js`: Ponto de entrada do aplicativo.
- `servidor.js`: Configuração do servidor Express e inicialização.
- `bancodedados.js`: Mantém os dados persistidos em memória.
- Pasta `controladores`: Inclui arquivos de controle para cada operação. Dentro da pasta tem os arquivos:

  -- `rotas`: Contém arquivos de rotas para cada funcionalidade.

  -- `intermediários`: Contendo as middlewares para validar informações importantes, como senhas.

## Exemplos de Endpoints

### Listar contas bancárias

- Método: `GET`
- Rota: `/contas?senha_banco=123`

### Criar conta bancária

- Método: `POST`
- Rota: `/contas`
- Entradas: Nome, CPF, Data Nascimento, Telefone, Email, Senha

### Atualizar usuário da conta bancária

- Método: `PUT`
- Rota: `/contas/:numeroConta/usuario`
- Entradas: Nome, CPF, Data Nascimento, Telefone, Email, Senha

### Excluir Conta

- Método: `DELETE`
- Rota: `/contas/:numeroConta`

### Depositar

- Método: `POST`
- Rota: `/transacoes/depositar`
- Entradas: Número da conta, Valor

### Sacar

- Método: `POST`
- Rota: `/transacoes/sacar`
- Entradas: Número da conta, Valor, Senha

### Tranferir

- Método: `POST`
- Rota: `/transacoes/transferir`
- Entradas: Número da conta (origem), Senha (origem), Valor, Número da conta (destino)

### Saldo

- Método: `GET`
- Rota: `/contas/saldo`
- Parâmetros de URL: `numero_conta`, `senha`

### Extrato

- Método: `GET`
- Rota: `/contas/extrato`
- Parâmetros de URL: `numero_conta`, `senha`

## Conclusão

Este projeto foi uma incrível oportunidade de aplicar meus conhecimentos em desenvolvimento back-end e criar uma solução que simula operações bancárias. Espero que tenham gostado da minha apresentação e que fiquem empolgados com as possibilidades que essa API oferece. Obrigado!
