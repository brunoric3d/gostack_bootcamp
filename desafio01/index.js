const express = require('express');
const server = express();

server.use(express.json());


//Middleware global para debug das requisições
server.use((req, res, next) => {

  console.count('Requests made');
  console.time('Request duration');
  console.log(`Method: ${req.method}; URL:${req.url}`);
  next();
  console.timeEnd('Request duration');

});


//Middleware para verificação de existência de projeto por id
function CheckIfProjectExists(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  req.project = project;
  return next();
};


//array temporario para os projetos
const projects = [{
  "id": 0,
  "name": "Projeto 1",
  "tasks": []
}];


//Rota para listagem de todos os projetos
server.get('/projects', (req, res) => {

  return res.json(projects);

});


//Rota para listagem de um projeto por id
server.get('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params;
  return res.json(projects[id]);
});

//Rota para alterar titulo de projeto
server.put('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].name = title;

  return res.json(req.project);
});

//Rota para deletar projeto
server.delete('/projects/:id', CheckIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});


//Rota para cadastro de novo projeto, espera "id" e "title" no body
server.post('/projects', (req, res) => {
  const { id,title } = req.body;

  //Checa se projeto com mesma id já existe
  if (projects[id]) {
    return res.status(400).json({ error: 'Project id already exists' });
  }

  const newProject = { id, title, tasks:[] }
  projects.push(newProject);
  return res.json(project);
});


//Rota para cadastro de nova tarefa, espera "title" no body
server.post('/projects/:id/tasks', CheckIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const newTask = title;
  projects[id].tasks.push(newTask);
  return res.json(req.project);
});

server.listen(3000);