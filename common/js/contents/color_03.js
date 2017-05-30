(function () {
	"use strict";




	/*static property
	--------------------------------------------------------------------*/
	var canvas 		= document.getElementById("myCanvas"),
		ctx	 		= canvas.getContext("2d"),
		perlin 		= new SimplexNoise(),
		LIB 		= new Planet(),
		TwoPi		= Math.PI * 2,
		winWidth	= window.innerWidth,
		winHeight	= window.innerHeight;

	


	/*constructor
	--------------------------------------------------------------------*/
	var Index = function(){
		this.strokeColor= LIB.getRndRGB(255);
		
		this.radius		 = 300;
		this.xRatio		= 1;
		this.yRatio		= 1;
		
		this.bgColor	= "#ffffff";
		this.bgOpacity	= 1;
		this.hue		= 0;
		this.saturation = 100;
		this.lightness 	= 40;
		this.pieceLength= 180;
		this.mousePoint	= {
			x:0,
			y:0
		};
		this.centerPoint= {
			x:window.innerWidth >> 1,
			y:window.innerHeight >> 1
		};
		this.noiseLimit		= 10;
		this.posNoiseLimit	= 10;
		this.doPosNoise	= true;
		this.doHueNoise = true;
		this.doLigNoise = true;
		this.doSatNoise = true;
		this.doLineDraw = false;
		this.doAnimation= false;
		this.init();
	},
		Member = Index.prototype;
	



	/*method
	--------------------------------------------------------------------*/
	Member.init = function(){
		var _self = this;
		window.addEventListener("mousemove",function(e){
			_self.mousePoint = LIB.getMousePoint(e);
			_self.xRatio	= (_self.mousePoint.x / winWidth * 100 | 0 )/100;
			_self.yRatio	= (_self.mousePoint.y / winHeight * 100 | 0 )/100;
			_self.draw();
		});
		window.addEventListener("resize",this.resize.bind(this));
		this.resize();
		this.draw();
	};

	/**
	 * 描画
	 */
	Member.draw = function(){
		var _c	= ctx;
		_c.globalAlpha  = this.bgOpacity;
		_c.fillStyle 	= this.bgColor;
		_c.fillRect(0,0,winWidth,winHeight);
		this.drawPiece();
//		window.requestAnimationFrame(this.draw.bind(this));
	};
	
	/**
	 * 色のピースを描画
	 */
	Member.drawPiece = function(){
		var _c		= ctx,
			_len	= this.pieceLength | 0,
			_cp		= this.centerPoint,
			_radius		= this.radius,
			_angleBase	= 360 / _len,
			_endAngle	= Math.PI/180,
			_adustAngle	= (_len > 100)?1:0.1,
			_xRange 	= this.xRatio * 100,
			_yRange 	= this.yRatio * 100,
			_x,_y,_nx,_ny;
		
		_c.globalAlpha 	= this.bgOpacity;
		
		for(var i=0; i<_len; i++){
			var _angle		= i*_angleBase,
				_nextAngle	= (i+1)*_angleBase + _adustAngle,
				_radian 	= _angle *_endAngle,
				_nextRad	= _nextAngle *_endAngle,
				_posNoise	= (this.doPosNoise)? (Math.random()*_xRange - _xRange/2) | 0 : 0,
				_hueNoise	= (this.doHueNoise)? (Math.random()*_yRange - _yRange/2) | 0 : 0,
				_satNoise	= (this.doSatNoise)? (Math.random()*_yRange - _yRange/2) | 0 : 0,
				_ligNoise	= (this.doLigNoise)? (Math.random()*_yRange - _yRange/2) | 0 : 0,
				_hue		= ((_angle + _hueNoise) > 360)? 360 : _angle + _hueNoise,
				_color 		= this.convertHslToRgb(_hue,this.saturation+_satNoise,this.lightness+_ligNoise);
			
			_x 	= _cp.x + _posNoise + _radius * Math.cos(_radian);
			_y 	= _cp.y + _posNoise + _radius * Math.sin(_radian);
			_nx = _cp.x + _posNoise + _radius * Math.cos(_nextRad);
			_ny = _cp.y + _posNoise + _radius * Math.sin(_nextRad);
			
			_c.fillStyle = _c.strokeStyle = "rgb("+_color.r+","+_color.g+","+_color.b+")";
			_c.beginPath();
			_c.moveTo(_cp.x + _posNoise,_cp.y+_posNoise);
			_c.lineTo(_x,_y);
			_c.lineTo(_nx,_ny);
			_c.closePath();
			if(this.doLineDraw) _c.stroke();
			else _c.fill();
		};
	};

	/**
	 * 色変換　HSL→RGB
	 * @returns {string} 色番号
	 */
	Member.convertHslToRgb = function(h,s,l){
		var max,min,
			rgb = {'r':0,'g':0,'b':0};

		if(h == 360) h = 0;
		if(l <= 49){
			max = 2.55 * (l + l * (s / 100));
			min = 2.55 * (l - l * (s / 100));
		}else{
			max = 2.55 * (l + (100 - l) * (s / 100));
			min = 2.55 * (l - (100 - l) * (s / 100)); 
		}  

		if (h < 60){
			rgb.r = max;
			rgb.g = min + (max - min) * (h / 60) ;
			rgb.b = min;
		}else if (h >= 60 &&  h < 120){
			rgb.r = min + (max - min) * ((120 - h) / 60);
			rgb.g = max ;
			rgb.b = min;    
		}else if (h >= 120 &&  h < 180){
			rgb.r = min;
			rgb.g = max ;
			rgb.b = min + (max - min) * ((h - 120) / 60);        
		}else if (h >= 180 &&  h < 240){
			rgb.r = min;
			rgb.g = min + (max - min) * ((240 - h) / 60);
			rgb.b = max;     
		}else if (h >= 240 &&  h < 300){
			rgb.r = min + (max - min) * ((h - 240) / 60);
			rgb.g = min;
			rgb.b = max;     
		}else if (h >= 300 &&  h < 360){
			rgb.r = max;
			rgb.g = min;
			rgb.b = min + (max - min) * ((360 - h) / 60); 
		} 

		rgb.r =  Math.round(rgb.r);
		rgb.g =  Math.round(rgb.g);
		rgb.b =  Math.round(rgb.b);
		return rgb; 
	};

	/**
	 * リサイズ
	 */
	Member.resize = function(){
		canvas.width 	= winWidth	= window.innerWidth;
		canvas.height 	= winHeight	= window.innerHeight;
		this.centerPoint.x = winWidth >> 1;
		this.centerPoint.y = winHeight >> 1;
	};



	window.Index = Index;
}());

var INDEX = new Index();


/* @object
	 * dat.GUI用オブジェクト
	 */
var DAT = new dat.GUI();
DAT.add(INDEX,"pieceLength",3,360).onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"radius",10,500).onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"saturation",0,100).onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"lightness",0,100).onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"bgOpacity",0,1).onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"doLineDraw").onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"doPosNoise").onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"doHueNoise").onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"doLigNoise").onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"doSatNoise").onChange(function(){ /*INDEX.draw()*/});
DAT.add(INDEX,"noiseLimit",0,100).onChange(function(){ /*INDEX.draw()*/});
//DAT.add(INDEX,"doAnimation").onChange(function(){ INDEX.init()});


