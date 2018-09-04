/**
 * Created by Administrator on 2018/8/31.
 */
var express = require('express');
var router = express.Router();
router.get('/',function(req,res,next){
    res.render('index');

})
router.post('/index.html',function(req,res,next){
    res.render("index");
})
router.post('/register.html',function(req,res,next){
    res.render('register');

})
router.post('/main.html',function(req,res,next){
    res.render('main');
})
module.exports = router;