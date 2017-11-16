"use strict";

function missile() {
	this.dx = 5;	//Updatevariable
	this.dy = 5;
	
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 10;
	this.tri = 0;	//Anzahl Dreiecke
	
	this.frames = 1;	//Anzahl frames
	this.frameNow = 1;	//Aktuelles frame
	this.step = 15;	//Schrittgröße bei Bewegung
	this.maxX = 0;		//Maximalwerte des Spielfelds
	this.mayY = 0;
	
	this.richtung = 0;	//In welche Richtung die Action geht
	this.vis = false;	//sichtbar
	this.friendly = false;	//Spielerrakete oder Invaderrakete
	
	this.color;	//Farbe
	this.form = [];	//Form
	
	this.init = function(px, py, vis, mx, my, dir, friend){
		this.posx = px;
		this.posy = py;
		this.vis = vis;
		this.maxX = mx;
		this.mayY = my;
		this.richtung = dir;
		this.dx *= this.richtung;
		this.friendly = friend;
		this.initForm();
		switch(this.friendly){
			case true:
				this.color = [Math.random()/2, 0.5 + Math.random()/2, 1,1];
				break;
			case false:
				this.color = [1, Math.random()/4, Math.random()/4,1];
				break;
		}
	};	//initialisierung

	this.blowingUp = function(){
		switch(this.richtung){
			case 1:
				shot(this.posx, this.posy + this.oy, 1);
				break;
			case -1:
				shot(this.posx, this.posy + this.oy, -1);
				break;
			default:
				return;
		}
	};	//missile abschuss //in Collision detection umändern#

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
					0, 10,
					20, 5,
					20, 15,

					20, 20,
					20, 0,
					30, 10,
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
		this.posx += this.dx;
		if(this.posx > this.maxX + this.ox){
			this.vis = false;
		} else if(this.posx < 0 - this.ox){
			this.vis = false;
		}
	};
}
