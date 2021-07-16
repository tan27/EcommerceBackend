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


app.listen(process.env.PORT || 3001, () => {
      console.log(`app is connected on port ${process.env.PORT}`)
   });

