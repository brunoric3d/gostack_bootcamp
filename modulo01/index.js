const express = require('express');

//atribui o express à variavel server
const server = express();

//adiciona o plugin de interpretação de requisição json no body
server.use(express.json());

//Middleware global para debug das requisições
server.use((req,res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL:${req.url}`);
  next();
  console.timeEnd('Request');
});


function CheckUserExists(req, res, next){
  if(!req.body.name){
    return res.status(400).json({error: 'Username is required'});
  }
  return next();
}

function CheckUserInArray(req, res, next){
  const user = users[req.params.index];

  if(!user){
    return res.status(400).json({error: 'User id is invalid'});
  }
  return next();
}

const users = [ 'Bruno', 'Sandro', 'Ana'];

//rota de listagem de todos os users
server.get('/users/', (req, res) => {
    return res.json(users);
});

//rota de listagem de um user especifico
server.get('/users/:index', CheckUserInArray, (req, res) => {
  return res.json(req.user);
});

//rota de cadastro de usuario
server.post('/users', CheckUserExists, (req, res) => {
  const { name } = req.body;
  
  users.push(name);
  
  return res.json(users);
  ;
})

//rota de alteração de usuario
server.put('/users/:index', CheckUserInArray, CheckUserExists, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

   users[index] = name;

  return res.json(users);
  ;
})


//rota para deletar usuario
server.delete('/users/:index', CheckUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index,1);

  return res.send();
  ;
})

//inicia o server na porta 3000
server.listen(3000);