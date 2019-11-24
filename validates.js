module.exports = {
	max: function(palavra, valor){
		if(palavra == null)
			return false;

		if(palavra.length <= valor)
			return true;
		else
			return false;		
	},
	min: function(palavra, valor){
		if(palavra == null)
			return false;

		if(palavra.length >= valor)
			return true;
		else
			return false;
	},
	exact: function(palavra, valor){
		if(palavra == null)
			return false;

		if(palavra.length == valor)
			return true;
		else
			return false;
	},

	req: function(palavra){
		if(palavra == null || palavra === "")
			return false;
		return true;
	},

	minVal: function(valor, limite){
		if(isNaN(valor))
			return false;
		else if(valor >= limite)
			return true;
		else
			return false;
	},

	maxVal: function(valor, limite){
		if(isNaN(valor))
			return false;
		else if(valor <= limite)
			return true;
		else
			return false;
	},

	data: function(data){
		if(data == null || data === "")
			return false;
		var regex = /\d{4}-\d{2}-\d{2}/;
		if(data.match(regex))
			return true;
		return false;
	},

	dataHora: function(data){
		if(data == null || data === "")
			return false;
		var regex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2,3}/;
		if(data.match(regex))
			return true;
		return false;
	}

}