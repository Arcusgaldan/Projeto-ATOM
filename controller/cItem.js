module.exports = {
	trataOperacao: function(usuario, operacao, msg, cb){ //Encaminha a execução para a operação passada pelo servidor (esta função também é responsável por fazer o controle de acesso às funções restritas apenas a usuários logados)
		var resposta = {};
		switch(operacao){
			case 'INSERIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.inserir(msg, function(codRes, id){
					resposta.codigo = codRes;
					resposta.msg = id;
					if(resposta.codigo == 200){
						require('./controller.js').proximoID("Item", function(id){						
							msg.id = parseInt(id) - 1;
							let log = {
								id: 0,
								chave: parseInt(id) - 1,
								tabela: "TBItem",
								operacao: "INSERIR",
								mudanca: JSON.stringify(msg),
								data: require('./cData.js').dataHoraAtual(),
								codUsuario: usuario.id
							}

							require('./cLog.js').inserir(log, function(codRes){
								if(codRes == 200){
									cb(resposta);	
									return;																
								}else{
									resposta.codigo = 416;
									cb(resposta);
									return;
								}
							});
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'ALTERAR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.alterar(msg, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBItem",
							operacao: "ALTERAR",
							mudanca: JSON.stringify(msg),
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								cb(resposta);	
								return;																
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'EXCLUIR':
				if(!usuario){
					resposta.codigo = 413;
					cb(resposta);
				}
				this.excluir(msg, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBItem",
							operacao: "EXCLUIR",
							mudanca: '-',
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								cb(resposta);		
								return;															
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			case 'LISTAR':
				this.listar(function(res){
					if(res){
						resposta.codigo = 200;
						resposta.msg = JSON.stringify(res);
					}else{
						resposta.codigo = 400;
					}
					cb(resposta);
				});
				break;
			case 'BUSCAR':
				this.buscar(msg, function(res){
					if(res){
						resposta.codigo = 200;
						resposta.msg = JSON.stringify(res);
					}else{
						resposta.codigo = 400;
					}
					cb(resposta);
				});
				break;
			case 'DESCARTAR':
				this.descartar(msg.id, function(codRes){
					resposta.codigo = codRes;
					if(resposta.codigo == 200){
						let log = {
							id: 0,
							chave: msg.id,
							tabela: "TBItem",
							operacao: "DESCARTAR",
							mudanca: '-',
							data: require('./cData.js').dataHoraAtual(),
							codUsuario: usuario.id
						}
						require('./cLog.js').inserir(log, function(codRes){
							if(codRes == 200){
								cb(resposta);		
								return;															
							}else{
								resposta.codigo = 416;
								cb(resposta);
								return;
							}
						});
					}else{
						cb(resposta);
						return;
					}
				});
				break;
			default:
				resposta.codigo = 410;
				cb(resposta);
		}
	},

	validar: function(item){ //Valida os campos necessários em seu formato ideal
		if(!item){
			return false;
		}

		var validates = require('./../validates.js');

		if(!validates.req(item.id) || !validates.exact(item.patrimonio, 6) || !validates.req(item.codTipoItem)){
			return false;
		}else{
			return true;
		}
	},

	inserir: function(item, cb){ //Insere as informações passadas pelo servidor
		if(!this.validar(item)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}
		require('./controller.js').inserir("Item", item, function(codRes, id){
			cb(codRes, id);
		});
	},

	alterar: function(item, cb){ //Altera as informações passadas por servidor
		if(!this.validar(item)){ //Se os dados não forem válidos, para a execução e retorna código de erro
			cb(412);
			return;
		}

		require('./controller.js').alterar("Item", item, function(codRes){
			cb(codRes);
		});
	},

	excluir: function(item, cb){ //Exclui o registro cujo ID seja igual o ID fornecido pelo servidor
		if(!item)
			cb(412);
		else if(!item.id)
			cb(412);
		require('./controller.js').excluir("Item", item, function(codRes){
			cb(codRes);
		});
	},

	listar: function(cb){ //Lista todos os registros da tabela;
		require('./controller.js').listar("Item", function(res){
			cb(res);
		}, 
		{campos: "TBItem.*, ti.nome tipoNome, s.id setorId, s.nome setorNome, l.id localId, l.nome localNome", 
		joins: 
			[
				{tabela: "TBTipoItem ti", on: "ti.id = TBItem.codTipoItem"}, 
				{tabela: "TBLogTransferencia lt", on: "lt.codItem = TBItem.id"}, 
				{tabela: "TBSetor s", on: "s.id = lt.codSetor", tipo: "LEFT"},
				{tabela: "TBLocal l", on: "l.id = lt.codLocal"}
			], 
		where: "lt.atual = 1 AND TBItem.ativo = 1",
		orderBy: [{campo: "patrimonio", sentido: "asc"}]});
	},

	buscar: function(argumentos, cb){ //Busca registros na tabela baseado nos argumentos recebidos pelo servidor
		require('./controller.js').buscar("Item", argumentos, function(res){
			cb(res);
		});		
	},

	descartar: function(id, cb){
		sql = "UPDATE TBItem SET ativo = 0 WHERE id = " + id;
		let dao = require('./../dao.js');
		dao.inserir(dao.criaConexao(), sql, function(codRes){
			cb(codRes);
		});
	}
}