(function () {
	"use strict";




	/*static property
	--------------------------------------------------------------------*/
	var canvas 		= document.getElementById("myCanvas"),
		ctx	 		= canvas.getContext("2d"),
		perlin 		= new SimplexNoise(),
		LIB 		= new Planet(),
		twoPi		= Math.PI * 2,
		winWidth	= window.innerWidth,
		winHeihgt	= window.innerHeight,
		
		
		colors		= [],
		sortMode 	= null,
		tileCount 	= 0,
		rectSize 	= 0,
		mousePoint	= {
			x:0,
			y:0
		};



	/*constructor
	--------------------------------------------------------------------*/
	var Index = function(){
		var _self = this;
		
		this.strokeColor= LIB.getRndRGB(255);
		this.bgColor	= "rgba(255, 255, 255, 0.47)";
		this.centerPoint= {
			x:window.innerWidth >> 1,
			y:window.innerHeight >> 1
		};
		
		this.img = new Image();
		this.img.src = "images/StaffPhoto.jpg";
		this.getImg = null;
		this.img.onload = function(){
			_self.init();
		};
		
		
	},
		Member = Index.prototype;




	/*method
	--------------------------------------------------------------------*/
	Member.init = function(){
		this.resize();
		this.imgDraw();
		this.draw();
		canvas.addEventListener('mousemove', this.mouseMove.bind(this));
	};
	
	Member.imgDraw = function(){
		var _c = ctx;
		_c.drawImage(this.img,0,0);
		_c.save();
	};

	/**
	 * 描画
	 */
	Member.draw = function(){
		var _c	= ctx,
			count 	= 0,
			_imgWidth = this.img.width;

		tileCount= (_imgWidth / (mousePoint.x,5)? mousePoint.x : 5) | 0;
//		tileCount= ((_imgWidth / mousePoint.x / 2) < 10)? 10 : (_imgWidth / mousePoint.x / 2);
		rectSize = _imgWidth / tileCount;
		
		this.imgDraw();

		_c.restore();
		
		var ylimit = this.img.height / rectSize;

		for (var gridY=0; gridY< ylimit; gridY=(gridY+1)|0) {
			for (var gridX=0; gridX< tileCount; gridX=(gridX+1)|0) {
				var _px 	= (gridX * rectSize) | 0,
					_py 	= (gridY * rectSize) | 0,
					_data 	= _c.getImageData(_px,_py,rectSize,rectSize).data;
				
				//ピクセルの色情報パース
				colors[count] = "rgb(" + _data[0]+","+_data[1]+","+_data[2]+")";
				count++;
			};
		};
		_c.save();
		
//		_c.globalAlpha  = 1;
		_c.fillStyle 	= this.bgColor;
		_c.fillRect(0,0,winWidth,winHeihgt);
		
		count = 0;
		for (var gridY=0; gridY< ylimit; gridY=(gridY+1)|0) {
			for (var gridX=0; gridX< tileCount; gridX=(gridX+1)|0) {
				_c.fillStyle = colors[count];
				
				var _px 	= (gridX * rectSize) /*+ Math.random()*4-2*/ | 0,
					_py 	= (gridY * rectSize) /*+ Math.random()*4-2*/ | 0,
					_size	= rectSize + Math.random()*20-15;

				_c.fillRect(_px , _py , _size , _size);
				
//				_c.beginPath();
//				_c.arc(gridX*rectSize,gridY*rectSize,rectSize/2,0,Math.PI*360,false);
//				_c.fill();
				count++;
			};
		};
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
	
	/**
	 * マウスムーブ処理
	 * @param {object} e イベントオブジェクト
	 */
	Member.mouseMove = function(e){
		mousePoint = LIB.getMousePoint(e);
		this.draw();
	};



	window.Index = Index;
}());

var INDEX = new Index();


/* @object
	 * dat.GUI用オブジェクト
	 */
var DAT = new dat.GUI();
DAT.add(INDEX,"draw");


