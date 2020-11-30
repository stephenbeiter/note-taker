const fs = require('fs');
const path = require('path');
const express = require('express');
const port = process.env.PORT || 3001;
const app = express();
const cuid = require('cuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

const notes = require('./db/db.json');

// note functions
function newNote(note, notesArray) {
  notesArray.push(note);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notesArray, null, 2));
};

function deleteNote(noteId) {
  for (i = notes.length - 1; i >= 0; i--) {
    if (noteId === notes[i].id) {
      notes.splice(i, 1);
    }
  }
  fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), err => {
    if (err) throw err;
  });
};

// get paths
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// post path
app.post('/api/notes', (req, res) => {
  req.body.id = cuid();
  res.json(newNote(req.body, notes));
});

// delete path
app.delete('/api/notes/:id', (req, res) => {
  deleteNote(req.params.id);
  res.json(notes);
});

// listen port
app.listen(port, () => {
  console.log(`API server now on port ${port}!`);
});