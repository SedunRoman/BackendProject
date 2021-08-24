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
const url = "mongodb+srv://RomanS:testserver1@cluster0.350pg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const Task = mongoose.model("tasks", taskScheme);
app.get('/allTasks', (req, res) => {
  Task.find().then(result => {
    res.send({ data: result });
  });
});
app.post('/createTask', (req, res) => {
  const task = new Task(req.body);
  if (req.body.hasOwnProperty('text')
    && req.body.hasOwnProperty('isCheck')
    && (req.body.isCheck === true || req.body.isCheck === false)
    && req.body.text) {
    task.save().then(result => {
      Task.find().then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send(`Error! Please fill in the fields in full`);
  }
});
app.patch('/updateTask', (req, res) => {
  const body = req.body;
  if (body.hasOwnProperty('_id')
    && (body.hasOwnProperty('text') || body.hasOwnProperty('isCheck'))) {
    Task.updateOne({ _id: req.body._id }, req.body).then(result => {
      Task.find().then(result => {
        res.send({ data: result });
      });
    }).catch(err => res.status(404).send(`Error! Sorry, but no such object with this id was found`));
  } else {
    res.status(422).send(`Error! Please fill in the fields in full`);
  };
});
app.delete('/deleteTask', (req, res) => {
  if (req.query._id) {
    Task.deleteOne({ _id: req.query._id }).then(result => {
      Task.find().then(result => {
        res.send({ data: result });
      });
    }).catch(err => res.status(404).send(`Error! Sorry, but no such object with this id was found`));
  } else {
    res.status(422).send(`Error! Sorry, but no such object with this id was found`);
  };
});
app.delete('/deleteAllTask', (req, res) => {
  Task.remove().then(() => {
    Task.find().then(result => {
      res.send({ data: result });
    });
  });
});
app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});