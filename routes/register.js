/**
 * Created by Administrator on 2018/9/3.
 */
var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
require("../lib/connect");
require("../model/model")
var User=mongoose.model('user');
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: false }));

router.post('/',function(req, res,next) {
    var name=req.body.name
    var pwd=req.body.pwd
    var user=new User(
        {
            name:name,
            pwd:pwd
        }
    )
    user.save(function(err,result){
        if(result==null){
            res.json({
                msg:'fail'
            });
        }else{
            res.json({
                msg:'success'
            })
        }
    req.on('data',function(data) {
        console.log("aaa")
        })
    })
    req.on('error', function(e) {
        console.log("ERROR: " + e.message);
    });
});

module.exports = router;

