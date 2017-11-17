"use strict";

function defender() {
	this.dx = 0;	//Updatevariable
	this.dy = 0;
	
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 15;
	this.tri = 0;	//Anzahl Dreiecke
	
	this.frames = 1;	//Anzahl frames
	this.frameNow = 1;	//Aktuelles frame
	this.step = 15;	//Schrittgröße bei Bewegung
	this.maxX = 0;		//Maximalwerte des Spielfelds
	this.mayY = 0;
	
	this.richtung = 0;	//In welche Richtung die Action geht
	this.vis = false;	//sichtbar
	this.friendly = true;	//Spielerrakete oder Invaderrakete
	this.gup = false;	//bewegt es sich rauf?
	this.gdown = false;	//bewegt es sich runter?
	this.gfire = false;	//wird geschossen?
	
	this.color = [Math.random()/2, 1, Math.random(), 1];	//Farbe
	this.form = [];	//Form
	
	this.init = function(px, py, vis, mx, my, dir){
		this.posx = px;
		this.posy = py;
		this.vis = vis;
		this.maxX = mx;
		this.mayY = my;
		this.richtung = dir;
		this.initForm();
	};	//initialisierung

	this.shooting = function(){
		shot(this.posx, this.posy, this.richtung, this.friendly);
	};	//missile abschuss

	this.initForm = function(){
		this.form = this.formS(this.frameNow);
		this.tri = this.form.length / 6;
	};
	
	this.getForm = function(){
		this.form = this.formS(this.frameNow);
		this.tri = this.form.length / 6;
		return this.form;
	};

	this.formS = function(index){
		if(this.frames == 1 || index + 1 >= this.frames){
			index = 1;
		} else {
			index++;
		}
		this.frameNow = index;
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
	
	this.getSizeX = function(){
		var sx = 0;
		for(var i = 0; i < this.form.length; i += 2){
			if(form[i] > sx){
				sx = form[i];
			}
		}
		return sx;
	};
	
	this.getSizeY = function(){
		var sy = 0;
		for(var i = 1; i < this.form.length; i += 2){
			if(form[i] > sy){
				sy = form[i];
			}
		}
		return sy;
	};
	
	this.update = function(){
		this.events();
		if(this.gup && this.gdown){
			this.dy = 0;
		} else if(this.gup){
			this.dy = -1 * this.step;
		} else if(this.gdown){
			this.dy = this.step;
		} else {
			this.dy = 0;
		}
		this.posy += this.dy;
		if(this.posy >= this.mayY){
			this.posy = this.mayY;
		} else if(this.posy <= 0){
			this.posy = 0;
		}
		if(this.gfire == true){
			this.shooting();
			this.gfire = false;
		}
	};
	
	this.events = function(){
		switch(this.richtung){
			case 1:
			document.addEventListener('keydown', (event) => {
				const keyName = event.key;
				if(keyName === 's' || keyName === 'S'){
					this.gdown = true;
				}
				if(keyName === 'w' || keyName === 'W'){
					this.gup = true;
				}
				if(keyName === ' '){
				}
			}, false);

			document.addEventListener('keyup', (event) => {
				const keyName = event.key;
				if(keyName === 's' || keyName === 'S'){
					this.gdown = false;
				}
				if(keyName === 'w' || keyName === 'W'){
					this.gup = false;
				}
				if(keyName === ' '){
					this.gfire = true;
				}
			}, false);
				break;
			case -1:
			document.addEventListener('keydown', (event) => {
				const keyName = event.key;
				if(keyName === 'ArrowDown'){
					this.gdown = true;
				}
				if(keyName === 'ArrowUp'){
					this.gup = true;
				}
			}, false);

			document.addEventListener('keyup', (event) => {
				const keyName = event.key;
				if(keyName === 'ArrowDown' || keyName === 'ArrowUp'){
					this.gdown = false;
					this.gup = false;
				}
				if(keyName === ' '){
					this.gfire = true;
				}
			}, false);
				break;
			default:
				return;
		}
	};
}
