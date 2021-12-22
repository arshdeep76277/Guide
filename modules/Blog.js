const mongoose=require('mongoose');
const BlogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
});
module.exports=Blog= mongoose.model('Blog',BlogSchema);
