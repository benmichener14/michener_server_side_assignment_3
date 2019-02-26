const express = require('express');
const app = express();

// install session module first using 'npm install express-session'
var session = require('express-session'); 
app.use(session({ secret: 'Wraith Run', 
                  resave: false, 
                  saveUninitialized: false, 
                  cookie: { maxAge: 60000 }}));

app.get('/', returnSongs);                  
app.get('/sort', sort);
app.get('/add', add);
app.get('/remove', remove);
app.get('/clear', clear);

app.listen(process.env.PORT,  process.env.IP, startHandler());

function startHandler()
{
  console.log('Server listening on port ' + process.env.PORT);
}

function sort(req, res)
{
  let result = {};
  try
  {
    if (req.session.songs == undefined)
    {
      req.session.songs = [];
      result = {'error' : "There is nothing to sort!"};
    }
    else
    {
      req.session.songs.sort();
      result = {"songs": req.session.songs};
    }
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function add(req, res)
{
  let result = {};
  try
  {
    if (req.session.songs == undefined)
    {
      req.session.songs = [];
      req.session.songs.push(req.query.song);
      result = {"songs": req.session.songs};
    }
    else if (req.query.song == undefined)
    {
      result = {'error' : "Please specify a song!"};
    }
    else if (req.session.songs.includes(req.query.song))
    {
      result = {'error' : "The song is already one of your favorites!"};
    }
    else
    {
      req.session.songs.push(req.query.song);
      result = {"songs": req.session.songs};
    }
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function remove(req, res)
{
  let result = {};
  try
  {
    if (req.session.songs == undefined)
    {
      req.session.songs = [];
      result = {'error' : "Your song list is empty"};
    }
    else if (req.query.song == undefined)
    {
      result = {'error' : "Please specify a song!"};
    }
    else if (req.session.songs.includes(req.query.song))
    {
      for( var i = 0; i < req.session.songs.length; i++)
      { 
        if ( req.session.songs[i] === req.query.song) 
        {
          req.session.songs.splice(i, 1); 
        }
      }
      result = {"songs": req.session.songs};
    }
    else
    {
      result = {'error' : "The song is not in your list!"};
    }
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function clear(req, res)
{
  let result = {};
  try
  {
    req.session.songs = [];
    result = {"songs": req.session.songs}; 
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}

function returnSongs(req, res)
{
  let result = {};
  try
  {
    if (req.session.songs == undefined)
    {
      req.session.songs = [];
    }
    result = {"songs": req.session.songs}; 
  }
  catch (e)
  {
    result = {'error' : e.message};
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(result));
  res.end('');
}