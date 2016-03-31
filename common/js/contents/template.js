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
		winHeihgt	= window.innerHeight;



	/*constructor
	--------------------------------------------------------------------*/
	var Index = function(){
		this.strokeColor= LIB.getRndRGB(255);
		this.bgColor	= "#eeeeee";
		this.centerPoint= {
			x:window.innerWidth >> 1,
			y:window.innerHeight >> 1
		};
		this.init();
	},
		Member = Index.prototype;




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



	window.Index = Index;
}());

var INDEX = new Index();


/* @object
	 * dat.GUI用オブジェクト
	 */
var DAT = new dat.GUI();
DAT.add(INDEX,"draw");


