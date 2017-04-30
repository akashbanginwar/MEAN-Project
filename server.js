var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcrypt');
var app = express();

var db = null;
MongoClient.connect("mongodb://localhost:27017/project", function(err,dbconn){
  if(!err){
    console.log("we are connected!!");
    db = dbconn;
  }
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/myArrays', function(req,res,next){

  db.collection('myArrays',function(err,myArraysCollection){
    myArraysCollection.find().toArray(function(err, myArrays){
      return res.json(myArrays);
    });
  });

});

app.post('/myArrays', function(req,res,next){

  db.collection('myArrays',function(err,myArraysCollection){

    var newComment = {text: req.body.newComment};

    myArraysCollection.insert(newComment, {w:1}, function(err){       //insert(option,objct, callback function)
    return res.send();
    });
  });
});

app.put('/myArrays/remove', function(req,res,next){

  db.collection('myArrays',function(err,myArraysCollection){

    var commentId = req.body.myArray._id;

    myArraysCollection.remove({_id: ObjectId(commentId)}, {w:1}, function(err){
    return res.send();
    });
  });
});

app.post('/users', function(req,res,next){

  db.collection('users',function(err, usersCollection){

    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(req.body.password, salt, function(err,hash){

        var newUser = {
          username: req.body.username,
          password: hash
        };

        usersCollection.insert(newUser, {w:1}, function(err){       //insert(option,objct, callback function)
        return res.send();
        });
      });
    });
  });
});

app.put('/users/login', function(req,res,next){

  db.collection('users',function(err, usersCollection){

    usersCollection.findOne({username: req.body.username}, (function(err, user){

      bcrypt.compare(req.body.password, user.password, function(err,result){
        if(result){
          return res.send();
        }else{
          return res.status(400).send();
        }
      });

    });

    bcrypt.genSalt(10,function(err,salt){
      bcrypt.hash(req.body.password, salt, function(err,hash){

        var newUser = {
          username: req.body.username,
          password: hash
        };

        usersCollection.insert(newUser, {w:1}, function(err){       //insert(option,objct, callback function)
        return res.send();
        });
      });
    });
  });
});



app.listen(8080, function(){
  console.log('Example app listening on port 8080')
});
