require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const logRequest = require("./logger.js");
const validateTodo = require("./validator.js");
const validateTodoPatch = require("./validatepatch.js");
const errorhandler = require("./errorhandler.js");
const connectDB = require('./db.js');
const TodoModel = require('./todoModel.js');
const app = express();
app.use(express.json()); // Parse JSON bodies

const corsOptions = {
  origin: 'http://localhost:3002/todos', // Allow all origins
};

app.use(cors(corsOptions)); // Enable CORS

connectDB(); // Connect to MongoDB

app.use(logRequest); // Use the logging middleware

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Test API', completed: false },
];

// GET All – Read
app.get('/todos', async (req, res, next) => {

  const todos = await TodoModel.find();
  try {
      res.status(200).json(todos);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
// GET Completed – Read
app.get('/todos/completed', async (req, res, next) => {
  try {
     const completed = await TodoModel.find({ completed: true });
     res.json(completed);

  } catch (error) {
    next(error);
  }
});
// GET Incomplete – Read
app.get('/todos/completed=false', async (req, res, next) => {
  try {
     const incomplete = await TodoModel.find({ completed: false });
     res.json(incomplete);
  } catch (error) {
    next(error);
  }
});

// GET One – Read
app.get('/todos/:id', async (req, res, next) => {
  try {
      const todo = await TodoModel.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// POST New – Create
app.post('/todos', validateTodo, async (req, res, next) => {

   try {
    const newTodo = new TodoModel(req.body);
    await newTodo.save();
    res.status(201).json(newTodo); // Echo back
   } catch (error) {
    next(error); // Pass to error handler
   }
});

// PATCH Update – Partial
app.patch('/todos/:id', validateTodoPatch, async (req, res, next) => {
  try {
      const todo = await TodoModel.findByIdAndUpdate(req.params.id, req.body, 
        { new: true }
      );
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
  try {
      const todo = await TodoModel.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ message: 'Todo not found' });
      res.status(200).json({ message: `Todo ${todo.id} deleted` });
  } catch (error) {
    next(error);
  }
});


app.use(errorhandler); // Use the error handling middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
