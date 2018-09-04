/**
 * Created by Administrator on 2018/8/31.
 */
var mongoose=require("mongoose")
var UserSchema=new mongoose.Schema({
    name:String,
    pwd:String
})
mongoose.model('user',UserSchema);