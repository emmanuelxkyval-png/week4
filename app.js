require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const logRequest = require("./logger.js");
const validateTodo = require("./validator.js");
const validateTodoPatch = require("./validatepatch.js");
const errorhandler = require("./errorhandler.js");
const app = express();
app.use(express.json()); // Parse JSON bodies

const corsOptions = {
  origin: 'http://localhost:3002/todos', // Allow all origins
};

app.use(cors(corsOptions)); // Enable CORS

app.use(logRequest); // Use the logging middleware

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Test API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res, next) => {
  try {
      res.status(200).json(todos);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// POST New – Create
app.post('/todos', validateTodo, (req, res, next) => {
   try {  
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
   } catch (error) {
    next(error); // Pass to error handler
   }
});

// PATCH Update – Partial
app.patch('/todos/:id', validateTodoPatch, (req, res, next) => {
  try {
      const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
  try {
      const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
  } catch (error) {
    next(error);
  }
});

app.get('/todos/completed', (req, res, next) => {
  try {
     const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
  } catch (error) {
    next(error);
  }
});

app.get('/todos/active', (req, res, next) => {
  try {
      const active = todos.filter((t) => !t.completed);
      res.json(active); // Custom Read!
  } catch (error) {
    next(error);
  }
});

app.get('/todos/:id', (req, res, next) => {
  try {
      const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.use(errorhandler); // Use the error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
