/*marrom
verde
amarelo
azul
laranja
preto
branco
vermelho*/
var senha = []; //variável global

limpaArray = function(caixinha){
	novoArray = [];
	for(i=0; i<caixinha.length; i++){
		if(caixinha[i] !== ""){
			novoArray.push(caixinha[i]);
		}
	}
	return novoArray;
}



geraSenha = function(tamanho){
	for(i=0; i<tamanho; i++){
		senha[i] = Math.floor(Math.random()*8)+1;
	}
	return senha;
}



validar = function(guess, senhaValidar){
	posicaoCorreta = 0;
	corCorreta = 0;

	for(i=0;i<senhaValidar.length;i++){
		if(guess[i] == senhaValidar[i]){
			posicaoCorreta++;
			guess[i] = "";
			senhaValidar[i] = "";
		}
	}

	guess2 = limpaArray(guess);
	senhaValidar2 = limpaArray(senhaValidar);

	for(i=0; i<guess2.length; i++){
		for(j=0; j<senhaValidar2.length; j++){
			if(guess2[i] == senhaValidar2[j]){
				corCorreta++;
				senhaValidar2[j] = "";
				break;
			}
		}
	}

	resultado = [];
	resultado[0] = posicaoCorreta;
	resultado[1] = corCorreta;
	return(resultado);
}


/*

Testes:

senha: 7,0,7,3
guess: 0,0,0,7

*/
