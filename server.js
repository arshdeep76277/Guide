const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());               // used instead of body parser
const mongoose=require('mongoose');    
const db=require('./routes/api/db');   
const auth=require('./routes/api/auth');   
require('dotenv').config();                 // hiding the password for mongoDb
app.get('/home',(req,res)=>{res.send('Hey It is working')});
const router=express.Router();           //Help use shift the routes 
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>console.log('Database connected')).catch((err)=>console.log(err));
app.use('/api/db',db);   // if a request comes to /api/db then it will be handled by db file
app.use('/api/auth',auth);   // if a request comes to /api/auth then it will be handled by auth file
app.listen(process.env.PORT||3000,()=>{console.log("server is running on port "+process.env.PORT)});  