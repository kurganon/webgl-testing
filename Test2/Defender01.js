"use strict";

var defender = {
	dx:0,	//Updatevariable
	dy:0,
	missiles:[],	//Geschosse
	
	posx:0,		//Aktuelle Position
	posy:0,
	ox:15,	//Originverschiebung
	oy:15,
	tri:3,	//Anzahl Dreiecke
	
	frames:1,	//Anzahl frames
	frameNow:1,	//Aktuelles frame
	step:15,	//Schrittgröße bei Bewegung
	maxX:0,		//Maximalwerte des Spielfelds
	mayY:0,
	
	spieler:true,	//Erster Spieler oder zweiter Spieler
	vis:false,	//sichtbar
	
	color:[Math.random(), Math.random(), Math.random(),1],	//Farbe
	form:[
		0, 0,
		10, 15,
		30, 15,

		0, 30,
		10, 15,
		30, 15,
	],	//Form
	
	init:function(px, py, player, mx, my){
		this.posx = px;
		this.posy = py;
		this.spieler = player;
		this.vis = true;
		this.maxX = mx;
		this.mayY = my;
	},	//initialisierung
	shoot:function(){
	},	//missile abschuss
	getForm:function(){
		this.form = formS(this.framenow);
		return this.form;
	}
};

document.addEventListener('keydown', (event) => {
	const keyName = event.key;
	if(keyName === 's' || keyName === 'S'){
		defender.dy = defender.step;
	}
	if(keyName === 'w' || keyName === 'W'){
		defender.dy = -1 * defender.step;
	}

	if(keyName === 'ArrowDown'){
		defender.dy = defender.step;
	}
	if(keyName === 'ArrowUp'){
		defender.dy = -1 * defender.step;
	}
	if(keyName === ' '){
		defender.shoot();
	}
	defender.posy += defender.dy;
	if(defender.posy >= defender.mayY){
		defender.posy = defender.mayY;
	} else if(defender.posy <= 0){
		defender.posy = 0;
	}
}, false);

document.addEventListener('keyup', (event) => {
	const keyName = event.key;
	if(keyName === 's' || keyName === 'S' || keyName === 'w' || keyName === 'W'){
		defender.dy = 0;
	}
	if(keyName === 'ArrowDown' || keyName === 'ArrowUp'){
		defender.dy = 0;
	}
	if(keyName === ' '){
	}
}, false);

function formS(index){
	if(defender.frames == 1 || index + 1 >= defender.defender.frames){
		index = 1;
	} else {
		index++;
	}
	defender.frameNow = index;
	switch(index){
		default:
		case 1:
			return [
				0, 0,
				10, 15,
				30, 15,

				0, 30,
				10, 15,
				30, 15,
				
				15, 7,
				15, 23,
				25, 15,
			];
	}
}
