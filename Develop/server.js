const fs = require("fs");
const express = require('express')
const path = require('path')
const app = express()
const port = 3000
const { v4: uuidv4 } = require('uuid');
const { response } = require("express");

// created a static path to public folder, meaning that all files in public folder are accessible
app.use(express.static("public"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// add public folder and sendFile will go here
app.get('/', function (req, res) {
  console.log('get home page')
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// add notes page
app.get('/notes', function (req, res) {
  console.log('get /notes');
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// route to get notes
app.get('/api/notes', function (req, res) {
  console.log('get /api/notes');
  // read db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Server error');
      return
    }
    res.json(JSON.parse(data));
  });
});

// 
app.get('/api/notes', function (req, res) {
  console.log('get /api/notes');
  // read db.json file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Server error');
      return
    }
    console.log(data);
    console.log(req);

    res.json(JSON.parse(data));
  });
});

// add note to the db.json file

// app.post('/api/notes', function(req, res) {
//     res.sendFile(path.join(__dirname, '/db/db.json'));
//     });

//  Posting a new note
app.post('/api/notes', function (req, res) {
  console.log("POSTING /api/notes");
  console.log(req.body);
  var note = req.body;
  // uuid note 
  note.id = uuidv4();
  fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      // noteList is an array of already existong notes
      const noteList = JSON.parse(jsonString);
      // need array of current file b/c as soon as fs.writeFile is called it will delete already existing data 
      noteList.push(note);
      fs.writeFile("./db/db.json", JSON.stringify(noteList), err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      })
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
  res.json(note);
});


// Delete Note BONUS:
app.delete('/api/notes/:id', function (req, res) {
  console.log("POSTING /api/notes");
  console.log(req.body);
  fs.readFile("./db/db.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      // noteList is an array of already existing notes
      const noteList = JSON.parse(jsonString);
      // filter array against note to be deleted.
      const result = noteList.filter(note => note.id != req.params.id);
      // stringify the result 
      fs.writeFile("./db/db.json", JSON.stringify(result), err => {
        if (err) {
          console.log('Error writing file', err)
        } else {
          console.log('Successfully wrote file')
        }
      })
      res.json(result)
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});


// noteTakerArray.push(note);
// fs.writeFileSync(
//   path.join(__dirname, '../db/db.json'),
//   JSON.stringify({
//     notes: noteTakerArray
//   }, null, 2)
// )


// 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})