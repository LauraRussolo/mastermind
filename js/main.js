var dificuldade = 4;
var tipo = "cores";

var cores = ["#c2e261", "#5ae4ed", "#e9afdc", "#fc554c", "#37c77b", "#478af0", "#fec161", "#9900cc"]; 

var palpiteGroup = [];

var campoSelecionado = null;

$(function(){

	lerParametros();

	$("#btnSenha").click(novoJogo);
	$("#btnGuess").click(validarGuess);
	$("#config").click(function(){$(".menuConfig").slideToggle()});
	$("#arrego").click(soltaOFrango);

	geraBotoes();
	
	geraCamposGuess();

	novoJogo();

});

lerParametros = function(){
	parametros = location.search;
	if(parametros != ""){

		if(parametros.search("tipo")>-1 && parametros.search("qtd")>-1){
			partes = parametros.slice(1).split('&');

			tipo = partes[0].slice(5,partes[0].length);

			dificuldade = partes[1].slice(4,partes[1].length);
		} else{
			alert("escolha tipo e quantidade, seu animal de teta");
		}
	}
}

novoJogo = function(){

	$(".mostraSenha").hide();
	$("#senhaDoArregao").children().remove();

	senhaGerada = geraSenha(dificuldade);

	apagaGuess();

	$("#palpitesAnteiores").children().remove();
}

geraBotoes = function(){
	buttonGroup = $("#botoesAlternativas");

	for(x=0; x<8; x++){
		botao = $("<button>");
		botao.addClass("botaoAlternativa");

		if(tipo == "numeros") {
			botao.text(x+1);
			botao.click(function(){preencheCampoNumero($(this).text());});
		} else {
			botao.css("background-color", cores[x]);
			botao.click(function(){preencheCampoCor($(this).css("background-color"))});
		}

		buttonGroup.append(botao);
	}
}


geraCamposGuess = function(){
	containerCamposGuess = $("#guessGroup");

	for(i=0; i<dificuldade; i++){
		campo = $("<div>");
		campo.addClass("guess");
		campo.attr("tabindex", i);
		campo.click(selecionaCampo);

		palpiteGroup.push(campo);

		containerCamposGuess.append(campo);
	}
}


preencheCampoNumero = function(valor){
	if(campoSelecionado != null){
		campoSelecionado.text(valor);
		campoSelecionado = null;
	} else {
		for(i=0; i<palpiteGroup.length; i++){
			if($(palpiteGroup[i]).text() === ""){
				$(palpiteGroup[i]).text(valor);
				break;
			}
		}
	}
}

preencheCampoCor = function(cor){
	if(campoSelecionado != null){
		campoSelecionado.css("background-color", cor);
		campoSelecionado = null;
	} else {
		for(i=0; i<palpiteGroup.length; i++){
			var corCampo = $(palpiteGroup[i]).css("background-color");
			if(ehBranco(corCampo)){
				$(palpiteGroup[i]).css("background-color", cor);
				break;
			}
		}
	}
}


selecionaCampo = function(){
	if(tipo == "numeros"){
		if($(this).text() === ""){
			campoSelecionado = $(this);
		} else {
			$(this).blur();
			$(this).text("");
		}		
	} else {
		var corCampo = $(this).css("background-color");
		if(ehBranco(corCampo)){
			campoSelecionado = $(this);
		} else {
			$(this).blur();
			$(this).css("background-color", "white");
		}	
	}
}


validarGuess = function(){
	palpite = [];

	if(tipo == "numeros"){
		for(i=0; i<dificuldade; i++){
			if(palpiteGroup[i].text() != ""){
				palpite[i] = palpiteGroup[i].text();
			} else {
				alert("preenche a porra toda, seu arrombado");
				return;
			}	
		}		
	} else {
		for(i=0; i<dificuldade; i++){
			var corCampo = palpiteGroup[i].css("background-color");
			if(!ehBranco(corCampo)){
				for(j=0; j<8; j++){
					corCampoHex = rgb2hex(corCampo);
					if(corCampoHex	== cores[j]){
						palpite[i] = j+1;
					}
				}
			} else {
				alert("preenche as cor tudo, seu arrombado");
				return;
			}
		}
	}

	senhaValidar = Object.values(jQuery.extend(true, {}, senha));

	palpite1 = Object.values(jQuery.extend(true, {}, palpite));

	resultados = validar(palpite1, senhaValidar);

	resultados1 = Object.values(jQuery.extend(true, {}, resultados));

	mostraResultado(palpite, resultados1);

	setTimeout(function(){
		if(resultados[0] == dificuldade){
			alert("ganhou, viado!");
		} 
	},100)

	apagaGuess();
}

apagaGuess = function(){
	for(i=0; i<dificuldade; i++){
		if(tipo == "numeros"){
			palpiteGroup[i].text("");
		} else {
			palpiteGroup[i].css("background-color", "white");
		}
	}
}

mostraResultado = function(senha, resultados){
	linha = $("<div>");
	linha.addClass("linha");

	comboPalpites = $("<div>");
	comboPalpites.addClass("guessGroup");

	resultado = $("<div>");
	resultado.addClass("resultado");

	for(i=0; i<dificuldade; i++){

		campoPalpite = $("<div>");
		campoPalpite.addClass("guess");
		if(tipo == "numeros"){
			campoPalpite.text(senha[i]);
		} else {
			campoPalpite.css("background-color", cores[senha[i]-1]);
		}

		comboPalpites.append(campoPalpite);

		bolinhaResultado = $("<div>");
		bolinhaResultado.addClass("resultadoBolinha");

		if(resultados[0]>0){
			bolinhaResultado.addClass("posicaoCorreta");
			resultados[0]--;
		} else if(resultados[1]>0){
			bolinhaResultado.addClass("valorCorreto");
			resultados[1]--;
		}

		resultado.append(bolinhaResultado);

	}

	linha.append(comboPalpites);
	linha.append(resultado);

	containerPalpitesAnteiores = $("#palpitesAnteiores");
	containerPalpitesAnteiores.append(linha);
}

soltaOFrango = function(){
	$("#senhaDoArregao").children().remove();
	$(".mostraSenha").show();

	for(i=0; i<dificuldade; i++){
		campoPalpite = $("<div>");
		campoPalpite.addClass("guess");
		if(tipo == "numeros"){
			campoPalpite.text(senha[i]);
		} else {
			campoPalpite.css("background-color", cores[senha[i]-1]);
		}
		$("#senhaDoArregao").append(campoPalpite);
	}

	//$("#senhaDoArregao").text(senha);
}


//funções suporte
ehBranco = function(corValidar){
	if(corValidar == "white" || corValidar == "rgba(0, 0, 0, 0)" || corValidar == "rgb(255, 255, 255)"){
		return true;
	} else {
		return false;
	}
}

rgb2hex = function(rgb) {
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
     }
}