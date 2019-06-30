var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var dbConfig = require('../model/dbConfig');

var conn = mysql.createConnection(dbConfig);
conn.connect();


router.get('/', function(req, res, next) {
    //if()
    res.render('login', { title: 'See the Sea' });
});

router.post('/',function(req,res){
    var id = req.body.id;
    var passwd = req.body.passwd;
    var sql = 'SELECT * FROM Users WHERE id=?';
    conn.query(sql,[id], function(err, results){
        if(err)
            console.log(err);

        if(!results[0])
            console.log('id is not matched');

        var user = results[0];
        crypto.pbkdf2(passwd,user.salt,100000,64,'sha512',function(err,derivedKey){
            if(err)
                console.log(err);
            
                if(derivedKey.toString('hex')===user.passwd){
                    console.log('login success');
                }else{
                    console.log('passwd is not patched');
                }
        });

    });
});


  module.exports = router;