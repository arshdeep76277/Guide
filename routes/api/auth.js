const router=require('express').Router();
const User=require('../../modules/User');
require('dotenv');
const jwt=require('jsonwebtoken');


/* login router 
Public 
creates a json token */
router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email}).then(user=>{
        if(user.length!==0){
           if(user[0].password==req.body.password){
               req.body.userID=user[0]._id;
               req.body.name=user[0].name;
               next();
           }else res.status(401).json({msg:'password is incorrect'});
        }
        else res.status(404).json({msg:"user not found"});
    }).catch(err=>res.status(500).json({msg:err}));
},generateToken);

// signup request 
router.post('/register',(req,res,next)=>{
    User.find({email:req.body.email}).then(user=>{
        if(user.length!==0){
            res.status(400).json({msg:'user already exists'});
        }
        else {
            User.find({name:req.body.name}).then(user=>{
            if(user.length!==0){
                res.status(400).json({msg:'Username already exists, try a differnt Username'});
            }
            else{
                const newUser=new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                });
                newUser.save().then(user=>{
                    req.body.userID=user._id;
                    next()}
                    );
            }
        });}
    })
},generateToken);

// jwt authentication
function generateToken(req,res,next){
    const user=req.body.email;
    jwt.sign({user},process.env.SECRET_KEY,(err,token)=>{
        if(err) res.status(500).json({msg:err});
        else res.status(200).json({token,userId:req.body.userID,username:req.body.name});
    });
}
module.exports=router;
