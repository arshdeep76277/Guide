const router=require('express').Router();
const jwt=require('jsonwebtoken');
const Blogs = require('../../modules/Blog');   
require('dotenv');

/* creating a new post 
private route
*/
router.post('/create',verifyUser,(req,res)=>{
    if(!req.body.title || !req.body.description){
        res.status(400).json({msg:'Please enter title and content'});
    }
    const blog=new Blogs({
        title:req.body.title,
        description:req.body.description,
        userId:req.body.userId,
        username:req.body.username
    });
    blog.save().then(blog=>{
        console.log("post created");
        res.json({msg:'Blog created successfully'});
    }).catch(err=>{
        console.log(err);
        res.status(500).json({msg:err})
    });
});
/* delete a post 
private route
*/
router.delete('/:blogId',verifyUser,(req,res)=>{
    console.log(req.body.userId,req.params.blogId);
    Blogs.findOneAndDelete({_id:req.params.blogId,userId:req.body.userId}).then(blog=>{
        if(blog) res.status(200).json({msg:'Post deleted'});
        else res.status(403).json({msg:"Only owner can delete the post"});
    }).catch(err=>{
        res.status(500).json(err);
    });
})
/* update a post
private
*/
router.put('/update/:postId',verifyUser,(req,res)=>{
    if(!req.body.title || !req.body.description) res.status(400).json({msg:'Please enter title and content'});
    else{
    Blogs.findOneAndUpdate({_id:req.params.postId,userId:req.body.userId},{$set:{title:req.body.title,description:req.body.description}}).then(blog=>{
        if(blog) res.status(200).json({msg:'Post updated'});
        else res.status(404).json({msg:"Only owner can update the post"});
    }).catch(err=>{
        res.status(500).json("Internal server Error",err)
    })}});
/* get all posts of a user
private 
*/
router.get('/:userId',verifyUser,(req,res)=>{
    Blogs.find({userId:req.params.userId}).then(blogs=>{
        res.json(blogs);
    })
});

/* get a single post data
public 
completed
*/
router.get('/blogs/:blogId',(req,res)=>{
    Blogs.find({_id:req.params.blogId}).then(blog=>{
        if(blog.length===0) res.status(404).json({msg:'No post found'});
        else res.status(200).json(blog[0]);
    })
})
// verify jwt token
function verifyUser(req,res,next){
    const bearerHeader=req.header('Authorization');
    if(!bearerHeader) res.status(401).json({msg:'No token, authorization denied'});
    else{
    const token=bearerHeader.split(' ')[1];
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err) throw err;
        next();
    })
}
}
//Comment on a post  Infuture
module.exports=router;