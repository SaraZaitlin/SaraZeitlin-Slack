var express = require('express');
var router = express.Router();
const db = require('../models');
var sqlite3 = require('sqlite3').verbose();

//Router responsible for handling the landing page
router.get('/', function(req, res, next) {
    if(req.session.userId==null)
        makeid(res,req)//A function that creates a new username only if it does not already exist
    else {
        db.Message.findAll({}).then((contacts) => {
           if(contacts!="")
           {
               let LastMessageKey = contacts.slice(-1)[0].id;
               if (LastMessageKey != req.session.LastMessageKey)
                   req.session.LastMessageKey = LastMessageKey;//Update what is the last message the user saw
           }
           res.render('slack', {messages: contacts});
        }).catch((err) => result404(req, res));
    }
});
//The router responsible for checking if a new message has been received and if so refresh the page
router.get('/checkUpdate', function(req, res, next) {

    db.Message.findOne({
        attributes: ['id'],
        order: [
            ['id', 'DESC']]
    }).then((contacts) =>{
        if(contacts!=null&&req.session.LastMessageKey!=contacts.id){
            req.session.LastMessageKey=contacts.id;
            res.redirect('/');
        }
    }).catch((err) => result404(req,res));


});

//Router responsible for handling a new message from the user
router.post('/message', function(req, res, next) {
    console.log(req.body.message+ "session: "+req.session.userId)
    if(req.body.message!=""){
        addMessage(req.body.message,req.session.userId).then((contacts) =>{
            res.redirect('/');
        }).catch((err) => result404(req,res));

    }
    else
        res.redirect('/');

});
//Asynchronous function for inserting a new message into the database
async function addMessage(message,name){
    db.Message.create({//Check if the attraction already exists
        message:message,
        user:name
    }).then((contacts) =>{
        return contacts
    })

}
//The function responsible for creating a name for a new user
function makeid(res,req) {
    let id = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        id += possible. charAt(Math. floor(Math. random() * possible. length));
        return db.Message.findOne({//Check if the user name already exists
            where: { user:id}
        }).then((contacts) =>{
            if(contacts == null){//if it does not already exist
                req.session.userId=id
            }
            return  res.redirect('/');
        })
}



function result404(req,res)
{
    res.status(404).send()
}



module.exports = router;
