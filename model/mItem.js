module.exports = {
	novo: function(){
		var final = {};
		final.id = 0;
		final.patrimonio = '';
		final.marca = '';
		final.modelo = '';
		final.descricao = '';
		final.codTipoItem = 0;
		final.ativo = 1;
		return final;
	},

	isString: function(atributo){
		var strings = ['patrimonio', 'marca', 'descricao', 'modelo'];
		for(let i = 0; i < strings.length; i++){
			if(atributo == strings[i])
				return true;
		}
		return false;
	}
}