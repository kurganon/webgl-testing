"use strict";

function defender() {
	this.dx = 0;	//Updatevariable
	this.dy = 0;
	this.missiles = [];	//Geschosse
	
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 15;
	this.tri = 3;	//Anzahl Dreiecke
	
	this.frames = 1;	//Anzahl frames
	this.frameNow = 1;	//Aktuelles frame
	this.step = 15;	//Schrittgröße bei Bewegung
	this.maxX = 0;		//Maximalwerte des Spielfelds
	this.mayY = 0;
	
	this.spieler = true;	//Erster Spieler oder zweiter Spieler
	this.vis = false;	//sichtbar
	
	this.color = [Math.random(), Math.random(), Math.random(),1];	//Farbe
	this.form = [
		0, 0,
		10, 15,
		30, 15,

		0, 30,
		10, 15,
		30, 15,
	];	//Form
	
	this.init = function(px, py, vis, mx, my){
		this.posx = px;
		this.posy = py;
		this.vis = vis;
		this.maxX = mx;
		this.mayY = my;
		this.events();
	};	//initialisierung

	this.shoot = function(){
	};	//missile abschuss

	this.getForm = function(){
		this.form = this.formS(this.framenow);
		return this.form;
	};

	this.formS = function(index){
		if(defender.frames == 1 || index + 1 >= defender.frames){
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
	};
	
	this.events = function(){
		document.addEventListener('keydown', (event) => {
			const keyName = event.key;
			if(keyName === 's' || keyName === 'S'){
				this.dy = this.step;
			}
			if(keyName === 'w' || keyName === 'W'){
				this.dy = -1 * this.step;
			}

			if(keyName === 'ArrowDown'){
				this.dy = this.step;
			}
			if(keyName === 'ArrowUp'){
				this.dy = -1 * this.step;
			}
			if(keyName === ' '){
				this.shoot();
			}
			this.posy += this.dy;
			if(this.posy >= this.mayY){
				this.posy = this.mayY;
			} else if(this.posy <= 0){
				this.posy = 0;
			}
		}, false);

		document.addEventListener('keyup', (event) => {
			const keyName = event.key;
			if(keyName === 's' || keyName === 'S' || keyName === 'w' || keyName === 'W'){
				this.dy = 0;
			}
			if(keyName === 'ArrowDown' || keyName === 'ArrowUp'){
				this.dy = 0;
			}
			if(keyName === ' '){
			}
		}, false);
	}
}
