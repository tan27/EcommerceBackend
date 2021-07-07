import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
// import pkg from 'mongodb';
// const { MongoClient } = pkg; 
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const uri = process.env.CONNECTIONSTRING;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => console.log('Now connected to MongoDB!'))
.catch(err => console.error('Something went wrong', err));

const userSchema = new mongoose.Schema ({
  name: String,
  email: String,
  password: String,
  joined: Date
});
const User = mongoose.model("User", userSchema)

 app.get('/', (req, res) => {
  res.json('success');
})

app.post('/register', async (req, res) => { 
      let user = await User.findOne({ email: req.body.email });
      if (user) {
          return res.status(400).send('That user already exists!');
      } else {
          user = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              joined: Date()
          });
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          user.save();
          res.json(user);
      }
    });

app.post('/signin', async (req, res) => { 
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    } res.json(user);
});


app.put('/image', (req, res) => {
  User.findOneAndUpdate({ id: req.body.id }, {$inc: {quantity: 1}});
  return res.json(quantity[0]);
});

app.get('/profile/:id', (req, res) => {
  User.findOne({id: req.body.id})
  return res.json(user);
})


app.listen(3001, () => {
      console.log('app is connected on port 3001')
   });


// MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
//   if (err) return (console.log(err))
//   app.listen(3001, () => {
//     console.log('app is connected')
//  });

//   let dbase = db.db("store");

//  app.post('/', function(req, res) {
//    dbase.collection("users").insertOne(req.body, function (err, result) {
//      if (err)
//      res.sent('error');
//      else res.send('success');
//    })
//  })

//  let dbase = db.db("store");

//  app.get('/', (req, res) => {
//   res.json('success');
// })
 
//  app.post('/register', (req, res) => {
//     dbase.collection("users").insertOne({
//           name: req.body.name,
//           email: req.body.email
//       }, 
//       function(err, result) {
//           if (err)
//           console.log(err)
//       });
//       res.json(result.ops[0]);
//           db.close();
//   });
// });

// app.get('/name', (req, res, next) => {
//   dbase.collection('name').find().toArray( (err, results) => {
//     res.send(results)
//   });
// });


// mongoose.connect(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });
// var db = mongoose.connection;
// db.on('error', console.log.bind(console, "connection error"));
// db.once('open', function(callback) {
//     console.log("connection succeeded");
// })


// app.post("/register", function (req, res) {
//   var username = req.body.username
//   var email = req.body.email
//   User.register(new User({ username: username }),
//           email, function (err, user) {
//       if (err) {
//           console.log(err);
//           return res.json(users[0]);
//       }

//       passport.authenticate("local")(
//           req, res, function () {
//           res.render("secret");
//       });
//   });
// });

// app.get('/:name', (req, res) => {
//   MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("store");
//       dbo.collection("users").findOne({
//           name: req.params.name
//       }, 
//       function(err, result) {
//           if (err) throw err;
//           res.json(result);
//           db.close();
//       });
//   });
// });

// app.post('/register', (req, res) => {
//   MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
//       if (err) throw err;
//       var dbo = db.db("users");
//       dbo.collection("users").insertOne({
//           name: req.body.name,
//           age: req.body.age
//       }, 
//       function(err, result) {
//           if (err) throw err;
//           res.json(result);
//           db.close();
//       });
//   });
// });


// app.route('/').get( async function (req, res) {

// app.get('/', async (req, res) => {
//     try {
//       const results = await client.db("store").collection("users").find({name: "lily"}).toArray()
//       if (results.length) {
//       console.log(results)
//       res.json(results)
//     } else {
//       res.json("You do not currently have any dogs in your pets collection.")
//     }
//   } catch (err) {
//     console.log(err)
//     res.json("Try again later.")
//   }
// })

// app.get('/login', (req, res) => {
// res.send('login is working');
// });

// app.post('/login', (req, res) => {
//     let username = req.body.username;
//     let password = req.body.password;
//     res.send(`Username: ${username} Password: ${password}`);
//   });
