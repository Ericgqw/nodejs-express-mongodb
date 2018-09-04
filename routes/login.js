/**
 * Created by Administrator on 2018/8/31.
 */
var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
require("../lib/connect");
require("../model/model")
var User=mongoose.model('user');
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({ extended: true }));

router.post('/',function(req, res,next) {
    var name=req.body.name
    var pwd=req.body.pwd
    User.findOne({name: name, pwd: pwd}, function (error, result) {
        if (result == null) {
            res.json({
                msg: "fail"
            });
        } else {
            res.json({
                msg: "success"
            });
        }
    })
    req.on('data',function(data) {
       console.log("lala")
    })
  });

module.exports = router;

