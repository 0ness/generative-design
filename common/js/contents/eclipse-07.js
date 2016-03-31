(function () {
	"use strict";


	
	
	/*static property
	--------------------------------------------------------------------*/
	var canvas 	= document.getElementById("myCanvas"),
		ctx	 	= canvas.getContext("2d"),
		perlin 	= new SimplexNoise(),
		LIB 	= new Planet(),
		TwoPi		= Math.PI * 2,
		winWidth	= window.innerWidth,
		winHeihgt	= window.innerHeight;
	
	
	
	/*constructor
	--------------------------------------------------------------------*/
	var ShapeGenerator = function(){
//		this.nowVertex 	= 8;
		this.nowVertex 	= (Math.random()*this.vertexLimit | 0) + 4;
		this.nowRadius 	= Math.random()*50 | 0;
		this.glowRadius = (Math.random()*this.glowRLimit * 10 | 0) / 10;
		this.lineWidth  = (Math.random()*this.lineWLimit * 100 | 0) / 100;
		this.lineAlpha	= (Math.random()*this.alphaMin * 100 | 0) / 100;
		this.strokeColor= LIB.getRndRGB(255);
		this.bgColor	= "#eeeeee";
		this.centerPoint= {
			x:window.innerWidth >> 1,
			y:window.innerHeight >> 1
		};
		this.init();
	},
		Member = ShapeGenerator.prototype;
	
	Member.vertexLimit	= 5;
	Member.glowRLimit	= 1;
	Member.lineWLimit	= 1;
	Member.repeatLimit	= 100;
	Member.repeatMin	= 5;
	Member.alphaMin		= 0.5;
	Member.changeLimit 	= 30;
	Member.noiseLimit	= 4;
	Member.doPointNoise	= false;
	Member.doAngleNoise	= false;
	Member.doGlowNoise	= false;
	Member.doLineDraw	= true;
	Member.doArcDraw	= false;
	
	
	
	
	/*method
	--------------------------------------------------------------------*/
	Member.init = function(){
		this.resize();
		this.draw();
	};
	
	/**
	 * 描画
	 */
	Member.draw = function(){
		var _len = this.changeLimit,
			_c	= ctx;
		
		_c.globalAlpha  = 1;
		_c.fillStyle 	= this.bgColor;
		_c.fillRect(0,0,winWidth,winHeihgt);
		for(var i=0; i<_len; i++) this.drawShapeRepeat();
		
		this.nowRadius 	= Math.random()*50 | 0;
		this.nowVertex 	= (Math.random()*this.vertexLimit | 0) + 4;
	};
	
	/**
	 * 図形単体　描画
	 */
	Member.drawShape = function(){
		var _len		= this.nowVertex,
			_c 			= ctx,
			_noise		= this.noiseLimit,
			_angle 		= 0,
			_glowAngle 	= (360 / _len) | 0,
			_adjustAngle= (this.doAngleNoise)? (Math.random()*_noise - _noise/2) | 0 : 0,
			_adjustGlowR= (this.doGlowNoise)? (Math.random()*_noise - _noise/2) | 0 : 0,
			_pi 		= Math.PI / 180,
			_radian 	= (0 + _adjustAngle) * _pi,
			_point		= this.getShapePoint(_radian);
		
		_c.beginPath();
		if(this.doLineDraw) _c.moveTo(_point.x,_point.y);
		if(this.doArcDraw) _c.arc(_point.x,_point.y,10,0,TwoPi,false);
		
		for(var i=1; i<_len; i++){
			_angle 		+= _glowAngle;
			_radian 	= (_angle + _adjustAngle) * _pi;
			_point		= this.getShapePoint(_radian);
			if(this.doLineDraw) _c.lineTo(_point.x,_point.y);
			if(this.doArcDraw) _c.arc(_point.x,_point.y,10,0,TwoPi,false);
		};
		_c.closePath();
		_c.stroke();
		this.nowRadius += this.glowRadius + _adjustGlowR;
	};
	
	/**
	 * 図形連続　描画
	 */
	Member.drawShapeRepeat = function(){
		var _len 	= (Math.random()*this.repeatLimit) | 0 + this.repeatMin,
			_c		= ctx;
		
		_c.strokeStyle  = this.strokeColor;
		_c.globalAlpha  = this.lineAlpha;
		
		for(var i=0; i<_len; i++) this.drawShape();
		this.nowVertex 	+= (Math.random()*3 | 0) - 1;
		this.nowVertex 	= (this.nowVertex <= 3)? 3:this.nowVertex;
		this.nowRadius 	+= (Math.random()*50 | 0 - 25)
		this.glowRadius = (Math.random()*this.glowRLimit * 10 | 0) / 10;
		this.lineWidth  = (Math.random()*this.lineWLimit * 10 | 0) / 10;
		this.lineAlpha	= (Math.random()* this.alphaMin * 100 | 0) / 100;
		//		this.strokeColor= this.getColor();
	};
	
	/**
	 * 図形の頂点座標計算
	 * @param   {number} _radian ラジアン
	 * @returns {object} 座標オブジェクト
	 */
	Member.getShapePoint = function(_radian){
		var _nr 	= this.nowRadius,
			_cp 	= this.centerPoint,
			_noise	= this.noiseLimit,
			_xNoise	= (this.doPointNoise)? Math.random()*_noise - _noise/2 : 0,
			_yNoise	= (this.doPointNoise)? Math.random()*_noise - _noise/2 : 0,
			_x 		= ((Math.sin(_radian)*_nr + _cp.x + _xNoise)*10 | 0) / 10,
			_y		= ((Math.cos(_radian)*_nr + _cp.y + _yNoise)*10 | 0) / 10;
		return {x:_x,y:_y};
	};
	
	/**
	 * 色取得
	 * @returns {string} 色番号
	 */
	Member.getColor = function(){
		return LIB.getRndRGB_02(0,255,255);
	};
	
	/**
	 * リサイズ
	 */
	Member.resize = function(){
		canvas.width 	= winWidth	= window.innerWidth;
		canvas.height 	= winHeihgt	= window.innerHeight;
		this.centerPoint.x = winWidth >> 1;
		this.centerPoint.y = winHeihgt >> 1;
	};
	


	window.ShapeGenerator = ShapeGenerator;
}());

var INDEX = new ShapeGenerator();


/* @object
	 * dat.GUI用オブジェクト
	 */
var DAT = new dat.GUI();
DAT.add(INDEX, 'changeLimit',1,100).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'repeatLimit',1,200).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'repeatMin',1,100).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'glowRLimit',0.1,5).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'lineWLimit',0.1,3).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'alphaMin',0.1,1).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'doPointNoise').onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'doGlowNoise').onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'doAngleNoise').onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'noiseLimit',0.1,20).onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'doLineDraw').onChange(function(){INDEX.draw();});
DAT.add(INDEX, 'doArcDraw').onChange(function(){INDEX.draw();});
DAT.add(INDEX,"draw");


