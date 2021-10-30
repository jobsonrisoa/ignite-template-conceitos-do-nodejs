const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//Middleware
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
    const { name, username } = request.body;

    const userAlreadyExists = users.some(
      (user) => user.username === username
    );

    if (userAlreadyExists) {
      return response.status(400).json({error: "User already exists!"});
  }

  users.push(
    { 
      id: uuidv4(),
      name,
      username, 
      todos: []
    }
  )
  
  return response.json(users);

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
 const { title, deadline } = request.body;
 const { username } = request.headers;

 const user = users.find(user => user.username === username);

 user.todos.push( {
  id: uuidv4(),
	title,
	done: false, 
	deadline: new Date(deadline), 
	created_at: new Date()
  }
);



return response.json(user.todos.slice(-1));

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.query;

  const user = users.find(user => user.username === username);

  const todoId = user.todos.find(todoId => user.todos.id === id);

  todoId.title = title;
  todoId.deadline = new Date(deadline);

  return response.json(todoId)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.query;

  const user = users.find(user => user.username === username);
  const todoId = user.todos.find(todoId => user.todos.id === id);

  todoId.done = true;
  
  return response.json(todoId)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;