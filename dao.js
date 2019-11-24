module.exports = {
	criaConexao: function(){
		var mysql = require('mysql');

		var con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'DBPatrimonioSMS'
		});
		return con;
	},

	inserir: function(con, comando, cb){
		con.connect(function(err){
			if(err){console.log(err); cb(400); return;}
			// console.log("Conectado ao banco!");
			con.query(comando, function(err, res){
				if(err){ 
					switch(err.errno){
						case 1062:
							console.log("Erro de entrada duplicada: " + err);
							cb(418);
							return;
						default:
							console.log(err + "\nErrno: " + err.errno);
							cb(400);
							return;
					}
				}				
				// console.log("Deu bom inserindo");
				con.end();
				cb(200, res.insertId);
			});
		});
	},

	buscar: function(con, comando, cb){
		con.connect(function(err){
			if(err) throw err;
			// console.log("Conectado ao banco!");
			con.query(comando, function(err, res){
				if(err){console.log("Erro " + err); cb(null); return;}
				// console.log("Deu bom buscando");
				con.end();
				cb(res);
			});
		});
	},

	email: function(email, mensagem, assunto, cb){
		var nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'info.saude@gmail.com',
				pass: 'senhaEmail123'
			}
		});

		const mailOptions = {
			from: 'sistema.pronn@gmail.com',
			to: email,
			subject: assunto,
			html: mensagem
		};

		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				console.log(err);
				cb(400);				
			}else{
				console.log(info);
				cb(200);
			}
		});
	}
}