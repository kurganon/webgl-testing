
var sprites = [];
var updatarr = [];

var canvasX = 640, canvasY = 360;
var fps = 7;

var init = false;

var iden = 0;

//---------------------------

function sprite() {
	this.dx = 0;	//Updatevariable
	this.dy = 0;
	this.sizex = 0;	//Maße für Collisiondetection
	this.sizey = 0;
	
	this.posx = 0;		//Aktuelle Position
	this.posy = 0;
	this.ox = 15;	//Originverschiebung
	this.oy = 15;
	this.tri = 0;	//Anzahl Dreiecke
	
	this.minX = 0;	//Invader grenzen
	this.maxX = 0; 
	
	this.frames = 1;	//Anzahl frames
	this.frameNow = 1;	//Aktuelles frame
	this.delay = 5;	//Verzögerung zwischen den Framewechsel
	this.step = 15;	//Schrittgröße bei Bewegung
	this.scount = 0;	//stepcount
	
	this.richtung = 0;	//In welche Richtung die Action geht
	this.vis = true;	//sichtbar
	this.friendly = true;	//Spielerrakete oder Invaderrakete
	this.gup = false;	//bewegt es sich rauf?
	this.gdown = false;	//bewegt es sich runter?
	this.gleft = false;	//bewegt es sich nach links?
	this.gright = false;	//bewegt es sich nach rechts?
	this.gfire = false;	//wird geschossen?
	
	this.color = [Math.random()/2, 1, Math.random(), 1];	//Farbe
	this.form = [];	//Form
	
	this.init = function(posxi, posyi, oyi, trii, framesi, sizexi, sizeyi, stepi, richtungi, friendlyi, gdowni, colori){
		this.posx = posxi;
		this.posy = posyi;
		this.oy = oyi;
		this.tri = trii;
		this.frames = framesi;
		if(this.frames > 1){
			this.frameNow = (Math.random() * ((1 - this.frames) + 1) + this.frames);
			this.frameNow = Math.round(this.frameNow);
		}
		this.sizex = sizexi;
		this.sizey = sizeyi;
		this.step = stepi;
		this.richtung = richtungi;
		this.friendly = friendlyi;
		this.gdown = gdowni;
		this.color = colori;
		this.updateForm();
	};	//initialisierung
	
	this.initRoute = function(minXi, maxXi){
		this.minX = minXi;
		this.maxX = maxXi;
	};
	
	this.updatePos = function(){
		this.events();
		this.posx += this.dx;
		this.posy += this.dy;
	};
	
	this.events = function(){
		if(this.friendly && this.oy == 15){
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
			if(this.posy >= canvasY){
				this.posy = canvasY - 30;
			} else if(this.posy <= 0){
				this.posy = 0 + 30;
			}
			if(this.gfire == true){
				this.gfire = false;
			}
			this.gup = false;
			this.gdown = false;
			this.gfire = false;
		}else if(this.friendly == false && this.oy == 15){
			if(this.gdown){
				if(this.scount <= this.oy){
					this.dy = this.step;
					this.scount++;
				} else {
					this.gdown = false;
					this.dy = 0;
					this.scount = 0;
					if(this.posx == this.minX + this.ox){
						this.gright = true;
						this.gleft = false;
					} else if(this.posx == this.maxX - this.ox){
						this.gleft = true;
						this,gright = false;
					} else {
						this.gright = true;
						this.gleft = false;
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
			if(this.posy >= canvasY + this.oy){
				this.posy = 0 - (this.oy * 1.5);
				this.vis = true;
			}
		}else if(this.oy == 10){
			this.posx += this.step * this.richtung;
		}
	};
	
	this.update = function(){
		this.updateForm();
		this.updatePos();
	};
	
	this.updateForm = function(){
		if(this.friendly == false && this.oy == 15){
			if(this.delay <= 4){
			this.delay++;
			return;
			}else{
			this.delay = 0;
			}
			if(this.frames == 1 || this.frameNow + 1 > this.frames){
				this.frameNow = 1;
			} else {
				this.frameNow++;
			}
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
			switch(this.frameNow){
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
			this.form = bp;
		}
		if(this.friendly == true && this.oy == 15){
			if(this.frames == 1 || this.frameNow + 1 >= this.frames){
				this.frameNow = 1;
			} else {
				this.frameNow++;
			}
			switch(this.frameNow){
				default:
				case 1:
					this.form = [
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
		if(this.oy == 10){
			if(this.frames == 1 || this.frameNow + 1 >= this.frames){
				this.frameNow = 1;
			} else {
				this.frameNow++;
			}
			switch(this.frameNow){
				default:
				case 1:
					this.form = [
						0, 10,
						20, 5,
						20, 15,

						20, 20,
						20, 0,
						30, 10,
					];
			}
		}
	};
}

function initArray(){
	sprites.length = 0;
	sprites.push(new sprite());
	sprites.push(new sprite());
	sprites[0].init(30, 20, 15, 3, 1, 30, 30, 15, 1, true, false, 
				[Math.random()/2, 1, Math.random(), 1]);
	sprites[1].init((canvasX - 30), 20, 15, 3, 1, 30, 30, 15, -1, true, false, 
				[Math.random()/2, 1, Math.random(), 1]);
	
	//--------------
	
	var breite = 30; //Hardcode Breite der Invader
	var hoehe = breite; //Hardcode Höhe der Invader
	var midx = breite/2;	//Hardcode der X Originverschiebung
	var rand = breite * 2;
	var abstand = 6;
	var col = (canvasX - 2*rand)/(breite + abstand); 
	var row = canvasY/(hoehe + abstand);
	for(var i = 0; i < row + 1; i++){
		for(var j = 1; j < col - 1; j++){
			sprites.push(new sprite());
			var x = rand + midx + (j*breite) + (abstand * j);
			var y = 0 - (i*hoehe) - (abstand * i);
			var dir = Math.random();
			if(dir < 0.5){
				dir = -1;
			} else {
				dir = 1;
			}
			sprites[sprites.length - 1].init(x, y, 15, 5, 4, breite, hoehe, 1, dir, false, true, [1, Math.random()/2, Math.random()/2, 1]);
			
			var bl = x - (breite * 1.75);
			var br = x + (breite * 1.4);
			sprites[sprites.length - 1].initRoute(bl, br);
		}
	}
}


//-----------------------------------------------------------------
//-----------------------------------------------------------------

var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/test.html');
});

// GET static FILES 
app.use(express.static(path.join(__dirname, '/public')));
//-----------------------	
var ingame = setInterval(emitAgain, (1000/fps));
function emitAgain(){
	if(init == false){
		initArray();
		init = true;
	}
	updatarr.length = 0;
	for(var v = 0; v < sprites.length; v++){
		sprites[v].update();
		updatarr.push([sprites[v].posx, sprites[v].posy, sprites[v].vis, sprites[v].form]);
	}
	io.sockets.emit('broadcast', updatarr);
}
//-------------------------------------------------------------------
io.on('connection', function(socket){
	socket.send({iden, sprites});

	console.log('A user connected');
	
	socket.on('boolean', function(data){
		iden = data[0] + 1;

		sprites[data[0]].gup = data[1];
		sprites[data[0]].gdown = data[2];
	});
	
	socket.on('disconnect', function(){
		console.log('A user disconnected');
	});
	
	
});
//-------------------------------------------------------------------


http.listen(3000, function() {
	console.log('listening on localhost:3000');
});
