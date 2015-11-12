var jsonServer = require('json-server');
var express = require('express');
var low = require('lowdb');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var nodemailer = require('nodemailer');
var db = low('db.json');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'ads.nqts@gmail.com',
		pass: 'C1m@t3c!'
	}
});

// Returns a Express server
var server = jsonServer.create();
//app.use(express.bodyParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());

// Returns and Express router
var router = jsonServer.router('db.json');

server.post('/Oauth/Token', function(req, res) {
	if (req.body.username && req.body.password)
		var findDB = db('Usuario').find({Login : req.body.username, Senha: req.body.password});
		res.jsonp(findDB);
});

server.post('/recoverEmail', function(req, res) {
	var newPassword = uuid();
	if (req.body.email) 
		var findDB = db('Usuario')
						.chain()
						.find({Email: req.body.email})
						.assign({Senha: newPassword})
						.value();
		res.jsonp(findDB);
		
		var mailOptions = {
			from: 'senai <senai@senai.com.br>',
			to: 'thiago.leite@nad1.com.br',
			subject: 'teste',
			html: 'sua nova senha é: <b>' + newPassword + '</b>'
		}

		transporter.sendMail(mailOptions, function(error, info) {
			if(error) {
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});

});

server.use('/api', router);

server.listen(3000);