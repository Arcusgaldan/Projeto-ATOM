module.exports = {
	senhaHash: function(senha){
		var crypto = require('crypto');
    	var hash = crypto.createHash('sha256');

	    if(senha == null)
	        return "";

	    hash.update(senha);
	    var retorno = hash.digest('hex');
	    return retorno;
	},

	opcoesHTTP: function(texto){
		var retorno = {
			hostname: "172.17.16.2",
		    port: 8080,
		    //mode: 'no-cors',
		    //Access-Control-Allow-Origin: "http://localhost",
		    method: 'POST',
		    headers: {
		      'Content-Type': 'text/plain',    
		      'Content-Length': Buffer.byteLength(texto),
		      // 'Objeto': null,
		      // 'Operacao': null,
		      'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Objeto, Operacao',
		      'Access-Control-Allow-Origin': 'localhost',
		      'Access-Control-Allow-Credentials': true,
		      'Access-Control-Allow-Methods': 'OPTION, GET, POST'
	    	}
	    };
		return retorno;
	},

	enviaRequisicao: function(objeto, operacao, dados, cb){
		var http = require('http');
		var opcoesHTTP;
		var texto;
		
		if(dados == ""){			
			opcoesHTTP = this.opcoesHTTP("");
			texto = "";
		}else{
			if(dados.msg){
				console.log("Há mensagem a ser enviada, msg = " + JSON.stringify(dados.msg));
				dados.msg.contInc = localStorage.contInc;
				dados.msg = this.criptoAES(localStorage.chave, JSON.stringify(dados.msg));
			}
			texto = JSON.stringify(dados);
			opcoesHTTP = this.opcoesHTTP(texto);
		}

		opcoesHTTP.headers.Objeto = objeto;
		opcoesHTTP.headers.Operacao = operacao;

		var req = http.request(opcoesHTTP, (res) => {
			if(objeto != "Token" && res.statusCode != 410 && dados.msg){
				localStorage.contInc++;
			}
			if(res.statusCode == 417){
				localStorage.removeItem('contInc');
				localStorage.removeItem('chave');
				localStorage.removeItem('token');
			}
			cb(res);
		});

		if(texto != ""){
			req.write(texto);
		}
		req.end();
	},

	enumOperador: function(cod){
		switch(cod){
			case '0':
				return '=';
			case '1':
				return '<>';
			case '2':
				return '<';
			case '3':
				return '<=';
			case '4':
				return '>';
			case '5':
				return '>=';
			default:
				return '';
		}
	},

	completaZero: function (valor, qtd){
		valor += "";
		let resultado = valor;
		while(resultado.length < qtd){
			resultado = "0" + resultado;
		}
		return resultado;
	},

	formataData: function(data){
		if(!data){
			return "-";
		}
		// var separado = data.substring(0, 10).split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0];

		let d = new Date(data);
		let resultado = this.completaZero(d.getDate(), 2) + "/" + this.completaZero(d.getMonth() + 1, 2) + "/" + this.completaZero(d.getFullYear(), 4);
		return resultado;
	},

	formataDataHora: function(data){
		if(!data){
			return "-";
		}

		// var diaMes = data.substring(0, 10);
		// var hora = data.substring(11, 19);
		// var separado = diaMes.split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0] + " " + hora;

		let d = new Date(data);
		let resultado = this.completaZero(d.getDate(), 2) + "/" + this.completaZero(d.getMonth() + 1, 2) + "/" + this.completaZero(d.getFullYear(), 4) + " " + this.completaZero(d.getHours(), 2) + ":" + this.completaZero(d.getMinutes(), 2) + ":" + this.completaZero(d.getSeconds(), 2);
		return resultado;
	},

	fomataDataISO: function(data){
		if(!data){
			return "-";
		}
		// var separado = data.substring(0, 10).split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0];

		let d = new Date(data);
		let resultado = this.completaZero(d.getFullYear(), 4) + "-" + this.completaZero(d.getMonth() + 1, 2) + "-" + this.completaZero(d.getDate(), 2);
		return resultado;
	},

	formataDataHoraISO: function(data){
		if(!data){
			return "-";
		}

		// var diaMes = data.substring(0, 10);
		// var hora = data.substring(11, 19);
		// var separado = diaMes.split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0] + " " + hora;

		let d = new Date(data);
		let resultado = this.completaZero(d.getFullYear(), 4) + "-" + this.completaZero(d.getMonth() + 1, 2) + "-" + this.completaZero(d.getDate(), 2) + "T" + this.completaZero(d.getHours(), 2) + ":" + this.completaZero(d.getMinutes(), 2) + ":" + this.completaZero(d.getSeconds(), 2);
		//console.log("Em formataDataHoraISO, data = " + data + " e resultado = " + resultado);
		return resultado;
	},

	formataDataHoraSQL: function(data){
		if(!data){
			return "-";
		}

		// var diaMes = data.substring(0, 10);
		// var hora = data.substring(11, 19);
		// var separado = diaMes.split('-');
		// var resultado = separado[2] + "/" + separado[1] + "/" + separado[0] + " " + hora;

		let d = new Date(data);
		let resultado = this.completaZero(d.getFullYear(), 4) + "-" + this.completaZero(d.getMonth() + 1, 2) + "-" + this.completaZero(d.getDate(), 2) + " " + this.completaZero(d.getHours(), 2) + ":" + this.completaZero(d.getMinutes(), 2) + ":" + this.completaZero(d.getSeconds(), 2);
		//console.log("Em formataDataHoraISO, data = " + data + " e resultado = " + resultado);
		return resultado;
	},

	comparaData: function(a, b){//
		a = a.split('-');
		b = b.split('-');

		if(parseInt(a[0]) < parseInt(b[0])){
			return -1;
		}else if(parseInt(a[0]) > parseInt(b[0])){
			return 1;
		}else{
			if(parseInt(a[1]) < parseInt(b[1])){
				return -1;
			}else if(parseInt(a[1]) > parseInt(b[1])){
				return 1;
			}else{
				if(parseInt(a[2]) < parseInt(b[2])){
					return -1;
				}else if(parseInt(a[2]) > parseInt(b[2])){
					return 1;
				}else{
					return 0;
				}
			}
		}
	},

	geraAES: function(){
		let chave = [];
		for(let i = 0; i < 24; i++){
			chave.push(Math.floor(Math.random() * 255));
		}
		return chave;
	},

	criptoAES: function(chaveString, msg){
		let chave = JSON.parse(chaveString);
		let aes = require('aes-js');
		let textoBytes = aes.utils.utf8.toBytes(msg);

		var aesCtr = new aes.ModeOfOperation.ctr(chave, new aes.Counter());
		var bytesCriptografados = aesCtr.encrypt(textoBytes);

		var hexCriptografado = aes.utils.hex.fromBytes(bytesCriptografados);
		return hexCriptografado;
	},

	descriptoAES: function(chaveString, msg){
		let chave = JSON.parse(chaveString);
		let aes = require('aes-js');		
		bytesCriptografados = aes.utils.hex.toBytes(msg);
		var aesCtr = new aes.ModeOfOperation.ctr(chave, new aes.Counter());

		var bytesDescriptografados = aesCtr.decrypt(bytesCriptografados);
		var textoDescriptografado = aes.utils.utf8.fromBytes(bytesDescriptografados);
		return textoDescriptografado;
	},

	criptoRSA: function(msg){
		let rsa = require('node-rsa');
		let publicKey = "-----BEGIN RSA PUBLIC KEY-----\n"+
		"MIIBCgKCAQEAyT0Ios5P/qKKnoIAvwB1K14IaR33P+aNJbW8Di+pVom3zUuIHzHk\n"+
		"qfhNrHPzFnOMwnw6DYB0F9luXcpqZe0nbSauauMObo80W/+kPtnkJgGyjoDo2FwZ\n"+
		"X+vWGnAgCTqlrc9n738+8FXYUxpzb0MP3er3ClAiJv5y87g7RGI8d8qYJL0l2klP\n"+
		"iWd5yVWJe7vtBAaWJjxmdvqG6DnDsxaYaeyEP1i/IlXfD/ePlzgYW3EfUALFc0y2\n"+
		"hBM0OIMI83U1Qao/cPCFx2fut5w2UqLSowdCxurFZ4T6HFBlrX2zVtzce2wkxiAf\n"+
		"aEghTU14LpiE/ulVH2enxekza3qnvTk+bwIDAQAB\n"+
		"-----END RSA PUBLIC KEY-----";

		var key = new rsa();
		key.importKey(publicKey, 'pkcs1-public');
		let msgCripto = key.encrypt(msg, 'base64');

		return msgCripto;
	}
};