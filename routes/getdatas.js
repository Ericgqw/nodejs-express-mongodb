/**
 * Created by Administrator on 2018/9/3.
 */
var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";

router.post('/',function(req, res,next) {
    var db_name=req.body.db_name;
    var db_table=req.body.db_table;
    MongoClient.connect(url, function (err, db) {
       if(err) throw err;
        var dbo=db.db(db_name);
        dbo.collection(db_table).find({}).toArray(function(err,result){
            if(err) throw err;
            if(result!=null){
                res.json({
                    data:result
                })
            }
        })
    })
})

module.exports = router;