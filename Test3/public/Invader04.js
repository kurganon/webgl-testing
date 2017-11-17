"use strict";

function invader() {
	this.dx = 0;	//Updatevariable
	this.dy = 0;
	
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 15;
	this.tri = 0;	//Anzahl Dreiecke
	
	this.frames = 4;	//Anzahl frames
	this.frameNow = 1;	//Aktuelles frame
	this.frameDuration = 2;	//Framedauer
	this.frameCounter = 0;	//
	this.step = 1;		//Schrittgröße bei Bewegung
	this.scount = 0;	//stepcount
	
	this.minX = 0;		//Linksseitige Grenze
	this.maxX = 0;		//Rechtsseitige Grenze
	this.mayY = 0;		//Spielfeldhöhe
	
	this.richtung = 0;	//In welche Richtung die Action geht
	this.vis = false;	//sichtbar
	this.friendly = false;	//Spielerrakete oder Invaderrakete
	this.gup = false;	//bewegt es sich rauf?
	this.gdown = true;	//bewegt es sich runter?
	this.gleft = false;	//bewegt es sich nach links?
	this.gright = false;	//bewegt es sich nach rechts?
	
	this.color = [1, Math.random()/2, Math.random()/2, 1];	//Farbe
	this.form = [];	//Form
	
	this.init = function(px, py, vis, minx, mx, my){
		this.posx = px;
		this.posy = py;
		this.vis = vis;
		this.minX = minx;
		this.maxX = mx;
		this.mayY = my;
		
		var dir = Math.random();
		if(dir < 0.5){
			this.richtung = -1;
		} else {
			this.richtung = 1;
		}
		
		this.initForm();
	};	//initialisierung

	this.shooting = function(){
		shot(this.posx + this.sizew, this.posy, this.richtung, this.friendly);
	};	//missile abschuss

	this.initForm = function(){
		this.form = this.formS(this.frameNow);
		this.tri = this.form.length / 6;
	};
	
	this.getForm = function(){
		if(this.frameCounter >= this.frameDuration){
			this.form = this.formS(this.frameNow);
			this.tri = this.form.length / 6;
			this.frameCounter = 0;
		} else {
			this.frameCounter++;
		}
		return this.form;
	};

	this.formS = function(index){
		if(this.frames == 1 || index + 1 > this.frames){
			index = 1;
		} else {
			index++;
		}
		this.frameNow = index;
		var bp = [
				0, 20,
				30, 20,
				10, 30,

				0, 20,
				30, 20,
				20, 30,
				
				15, 0,
				0, 10,
				30, 10,
			];
		switch(index){
			default:
			case 1:
				bp.push(0);
				bp.push(15);

				bp.push(5);
				bp.push(20);

				bp.push(5);
				bp.push(10);


				bp.push(30);
				bp.push(15);

				bp.push(25);
				bp.push(20);

				bp.push(25);
				bp.push(10);
				break;
			case 2:
				bp.push(0);
				bp.push(15);

				bp.push(10);
				bp.push(20);

				bp.push(10);
				bp.push(10);


				bp.push(15);
				bp.push(15);

				bp.push(10);
				bp.push(20);

				bp.push(10);
				bp.push(10);
				break;
			case 3:
				bp.push(10);
				bp.push(15);

				bp.push(15);
				bp.push(10);

				bp.push(15);
				bp.push(20);


				bp.push(20);
				bp.push(15);

				bp.push(15);
				bp.push(10);

				bp.push(15);
				bp.push(20);
				break;
			case 4:
				bp.push(30);
				bp.push(15);

				bp.push(20);
				bp.push(20);

				bp.push(20);
				bp.push(10);


				bp.push(15);
				bp.push(15);

				bp.push(20);
				bp.push(20);

				bp.push(20);
				bp.push(10);
				break;
		}
		return bp;
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
	/*	if(this.gup && this.gdown){
			this.dy = 0;
		} else if(this.gup){
			this.dy = -1 * this.step;
	} else */if(this.gdown){
			if(this.scount <= this.oy*2){
				this.dy = this.step;
				this.scount++;
			} else {
				this.gdown = false;
				this.dy = 0;
				this.scount = 0;
				if(this.posx == this.minX + this.ox){
					this.gright = true;
				} else if(this.posx == this.maxX - this.ox){
					this.gleft = true;
				} else {
					this.gright = true;
				}
			}
		} else {
			this.dy = 0;
		}
		
		if(this.gleft && this.gright){
			this.dx = 0;
		} else if(this.gleft){
			this.dx = -1 * this.step;
		} else if(this.gright){
			this.dx = this.step;
		} else {
			this.dx = 0;
		}

		this.posx += this.dx;
		if(this.posx + this.ox >= this.maxX){
			this.posx = this.maxX - this.ox;
			this.gright = false;
			this.gdown = true;
		} else if(this.posx - this.ox <= this.minX){
			this.posx = this.minX + this.ox;
			this.gleft = false;
			this.gdown = true;
		}

		this.posy += this.dy;
		if(this.posy >= this.mayY + this.oy){
			this.posy = 0 - (this.oy * 1.5);
		}
	};
	
	this.events = function(){
	};
}
