const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

app.use(cors());
app.use(bodyParser.json());

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
});

const url = "mongodb+srv://RomanS:testserver1@cluster0.350pg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const Task = mongoose.model("tasks", taskScheme);

app.get('/allTasks', (req, res) => {
  Task.find().then(result => {
    res.send({ data: result });
  });
});

app.post('/createTask', (req, res) => {
  const task = new Task(req.body);
  task.save().then(result => {
    Task.find().then(result => {
      res.send({ data: result });
    });
  });
});

app.patch('/updateTask', (req, res) => {
  const body = req.body;
  Task.updateOne({ _id: req.body._id }, req.body).then(result => {
    Task.find().then(result => {
      res.send(result);
    });
  });
});

app.delete('/deleteTask', (req, res) => {
  Task.remove().then(() => {
    Task.find().then(result => {
      res.send({ data: result });
    });
  });
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});