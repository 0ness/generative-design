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
		this.boxRatio	= 1;
		this.boxColor	= "#000000";
		this.bgColor	= "#eeeeee";
		this.boxOpacity	= 1;
		this.bgOpacity	= 1;
		this.saturation = 100;
		this.lightness 	= 40;
		this.mousePoint	= {
			x:0,
			y:0
		};
		this.centerPoint= {
			x:window.innerWidth >> 1,
			y:window.innerHeight >> 1
		};
		this.doLineDraw = false;
		this.init();
	},
		Member = Index.prototype;




	/*method
	--------------------------------------------------------------------*/
	Member.init = function(){
		var _self = this;
		window.addEventListener("mousemove",function(e){
			_self.mousePoint = LIB.getMousePoint(e);
		});
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
		this.drawBox();
		this.styleChange();
		window.requestAnimationFrame(this.draw.bind(this));
	};
	
	/**
	 * ボックス描画
	 */
	Member.drawBox = function(){
		var _c	= ctx,
			_ratio	= this.boxRatio,
			_width	= winWidth * _ratio,
			_height = winHeight * _ratio,
			_xMargin = (winWidth - _width) / 2,
			_yMargin = (winHeight - _height) / 2;
			
		_c.globalAlpha 	= 1;
		_c.fillStyle 	= _c.strokeStyle = this.boxColor;
		if(this.doLineDraw){
			_c.beginPath();
			_c.rect(_xMargin,_yMargin,_width,_height);
			_c.stroke();
		}else{
			_c.fillRect(_xMargin,_yMargin,_width,_height);
		}
	};
	
	/**
	 * マウス座標からの計算
	 */
	Member.styleChange = function(){
		var _ratio 		= 1 - (this.mousePoint.y / winHeight * 100 | 0) /100,
			_hue 		= (_ratio * 360) | 0,
			_saturation	= this.saturation,
			_lightness	= this.lightness,
			_boxC 		= this.convertHslToRgb((_hue | 0),_saturation,_lightness),
			_bgC 		= this.convertHslToRgb((360-_hue | 0),_saturation,_lightness);

		this.boxColor 	= "rgba("+_boxC.r+","+_boxC.g+","+_boxC.b+","+this.boxOpacity+")";
		this.bgColor 	= "rgb("+_bgC.r+","+_bgC.g+","+_bgC.b+")";
		this.boxRatio 	= 1 - (this.mousePoint.x / winWidth * 100 | 0) /100;
	};

	/**
	 * 色変換　HSL→RGB
	 * @returns {string} 色番号
	 */
	Member.convertHslToRgb = function(h,s,l){
		var max,min,
			rgb = {'r':0,'g':0,'b':0};

		if (h == 360) h = 0;

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
DAT.add(INDEX,"boxOpacity",0,1);
DAT.add(INDEX,"bgOpacity",0,1);
DAT.add(INDEX,"saturation",0,100);
DAT.add(INDEX,"lightness",0,100);
DAT.add(INDEX,"doLineDraw");


