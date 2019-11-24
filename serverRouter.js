var http = require('http');
var fs = require('fs');

var paginas = {
	"/": "frontEnd/index.html",
	"/index": "frontEnd/index.html",
	"/login": "frontEnd/login.html",
	"/usuarios": "frontEnd/cadastroUsuario.html",
	"/senhaExpirada": "frontEnd/senhaExpirada.html",
	"/setores": "frontEnd/cadastroSetor.html",
	"/itens": "frontEnd/cadastroItem.html",
	"/computadores": "frontEnd/cadastroComputador.html"
};

var agrupamentos = {
	"backup": "frontEnd/cadastroBackup.html",
	"procedimento": "frontEnd/cadastroProcedimento.html"
};

function mimeType(arquivo){
	if(arquivo.match("^.*\.js.*$")){
		return "text/javascript";
	}else if(arquivo.match("^.*\.css.*$") || arquivo.match("^.*\.scss.*$")){
		return "text/css";
	}else if(arquivo.match("^.*\.html.*$") || arquivo.match("^.*\.htm.*$")){
		return "text/html";
	}else if(arquivo.match("^.*\.jpg.*$") || arquivo.match("^.*\.jpeg.*$")){
		return "image/jpeg";
	}else{
		return null;
	}
}

// function buscaRecurso(url){
// 	for(var key in paginas){
// 		if(key == url){
// 			console.log("Achei um match: " + key + " e o valor é " + paginas[key]);
// 			return paginas[key];
// 		}
// 	}
// }

http.createServer(function(req, res){
	var url = req.url;
	var agrupamento = url.split("/")[1];
	if(agrupamentos[agrupamento]/* && mimeType(url) == null*/){
		console.log("Agrupamento requisitado está na lista: " + url);
		fs.readFile(agrupamentos[agrupamento], function(err, data) {
			if(err){
				console.log("Erro: " + err);
				res.writeHead(500);	
				res.end();
			}else{
			    res.writeHead(200, {'Content-Type': 'text/html'});
			    res.write(data);
			    res.end();
			}
	 	});
	}else{
		var pagina = paginas[url];
		if(pagina){
			console.log("Página requisitada está na lista: " + url);
			fs.readFile(pagina, function(err, data) {
				if(err){
					console.log("Erro: " + err);
					res.writeHead(500);	
					res.end();
				}else{
				    res.writeHead(200, {'Content-Type': 'text/html'});
				    res.write(data);
				    res.end();
				}
		 	});
		}else{
			console.log("Página requisitada NÃO está na lista: " + url);
			var tipoArquivo = mimeType(url);
			fs.readFile("frontEnd" + url, function(err, data){
				if(err){
					if(err.code === 'ENOENT' /*&& tipoArquivo == null*/){ //Se erro for página não existente, envia a página 404
						console.log("Erro: " + err);
						fs.readFile("frontEnd/404.html", function(err, data){
							if(err){
								console.log("Erro ao ler página de 404: " + err);
								res.writeHead(500);
								res.end();
							}else{
								res.writeHead(404, {'Content-Type': 'text/html'});
								res.write(data);
								res.end();
							}
						});
					}else{ //Se erro não for página não encontrada, envia erro 500 padrão
						console.log("Erro: " + err);
						res.writeHead(500);	
						res.end();
					}
				}else{
					res.writeHead(200, {'Content-Type': tipoArquivo});
				    res.write(data);
				    res.end();
				}
			});
		}
	}
}).listen(80);