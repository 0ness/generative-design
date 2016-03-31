(function () {
	"use strict";
	

	/*const 共通定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win 	= window,
		doc 	= document,
		canvas 	= doc.getElementById("myCanvas"),
		ctx 	= canvas.getContext("2d"),
		LIB 	= new Planet(),
		SEED	= {
			x:0.01,
			y:0.01,
			startX:0,
			startY:0
		};

	
	
	
	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth,  //ウィンドウ幅
		n_ih = win.innerHeight || doc.body.clientHeight,
		endAngle = Math.PI * 180;

	


	/*object
	--------------------------------------------------------------------*/
	
	/* @object Stats
	 * 処理速度確認用
	*/
	var stats = new Stats();
	stats.setMode( 0 );
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "fixed";
	stats.domElement.style.right = "0";
	stats.domElement.style.bottom = "5px";


	
	/* @object
	 * dat.GUI用オブジェクト
	*/
	var PARAM = {
		bgColor		:"#000000",
		bgAlpha		:1,
		xLength		:40,
		yLength		:30,
		radiusScale	:20,
		xMargin		:50,
		yMargin		:50,
		seedAnimStep:0.05,
		seedStepX	:0.0006,
		seedStepY	:0.0003,
		isAnimation:false
	},
		GUI = new dat.GUI();
	
	GUI.add(PARAM,"xLength",1,200).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"yLength",1,200).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"xMargin",1,200).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"yMargin",1,200).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"radiusScale",1,50).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"seedAnimStep",0,0.2).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"seedStepX",0,0.5).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"seedStepY",0,0.5).onChange(function(_val){
		if(PARAM.isAnimation === false) loop();
	});
	GUI.add(PARAM,"bgAlpha",0,1);
	GUI.add(PARAM,"isAnimation").onChange(function(_val){
		PARAM.isAnimation = _val;
		if(_val) loop();
	});

	
	
	
	/*SubClass Dot
	--------------------------------------------------------------------*/
	var Dot = function(_x,_y,_range){
		this.x = 0;
		this.y = 0;
		this.centerRange = _range;
		this.radius = 10;
		this.angle 	= 0;
	},
		DotMember = Dot.prototype;
	
	
	DotMember.blink = function(){
		
	};
	
	
	
	
	/*SubClass TryDot
	--------------------------------------------------------------------*/
	var TryDot = function(_x,_y){
		this.dot_01 = new Dot(_x,_y,this.centerRange);
		this.dot_02 = new Dot(_x,_y,this.centerRange);
		this.dot_03 = new Dot(_x,_y,this.centerRange);
	},
		TryDotMember = TryDot.prototype;
	
	TryDotMember.centerRange = 30;
	
	
	
	
	/*初期化
	--------------------------------------------------------------------*/
	var setup = function(){
		loop();
	};	
	
	
	
	
	
	/*描画
	--------------------------------------------------------------------*/
	var baseDraw = function(){
		var _c = ctx,
			_p = PARAM;
			
		_c.fillStyle 	= _p.bgColor;
		_c.globalAlpha 	= _p.bgAlpha;
		_c.globalCompositeOperation = "source-over";
		_c.fillRect(0,0,n_iw,n_ih);
		
		_c.globalAlpha 	= 1;
		_c.fillStyle 	= "#ffffff";
	};
	
	
	//円描画
	var drawCircle = function(x,y,radius){
		var _c 			= ctx,
			_p			= PARAM,
			_noiseRadius= ((noise.perlin2(SEED.x,SEED.y))*_p.radiusScale|0) /*+ (Math.random()*5|0)*/,
			_radius 	= ((radius - _noiseRadius) <= 0)? radius : radius - _noiseRadius;
		
		_c.fillStyle = "#ffffff";
		_c.beginPath();
		_c.arc(x,y,_radius,0,endAngle,false);
		_c.fill();
//		SEED.x += 0.00001;
//		SEED.y += 0.00001;

	};
	
	//円描画をリピートする
	var drawCircleRepeat = function(){
		var _p			= PARAM,
			_radius		= 1,
			_xMargin	= _p.xMargin,
			_yMargin	= _p.yMargin,
			_xLength 	= _p.xLength,
			_yLength 	= _p.yLength,
			_xDistance 	= ((n_iw - _xMargin*2) - ((_xLength-1) * (_radius*2))) / _xLength,
			_yDistance 	= ((n_ih - _yMargin*2) - ((_yLength-1) * (_radius*2))) / _yLength;
		
		for( var x = 0; x<_xLength; x++){
			
			SEED.y += _p.seedStepX;
			SEED.x = SEED.startX;
			
			for(var y = 0; y<_yLength; y++){
				SEED.x += _p.seedStepX;

				var _x = ((x*_radius*2) + (x*_xDistance) + (_xDistance/2) + _xMargin)|0,
					_y = ((y*_radius*2) + (y*_yDistance) + (_yDistance/2) + _yMargin)|0;
								
				drawCircle(_x,_y,_radius);
			}
		}
//		SEED.x += _p.seedStepX;
		SEED.y 		= SEED.startX;
		SEED.startX += _p.seedAnimStep;
//		SEED.y += _p.seedStepY;
//		SEED.y 
	};

	

	
	/*ループ
	--------------------------------------------------------------------*/
	var loop = function(){
		stats.begin();
		
		baseDraw();
		drawCircleRepeat();

		if(PARAM.isAnimation === true) win.requestAnimationFrame(loop);
		stats.end();
	}

	
	
	
	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){
		this.winCheck();
		this.canvasResize();
	};
	Resizer.prototype = {
		winCheck:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
		},
		canvasResize:function(){
			canvas.width = n_iw;
			canvas.height = n_ih;
		}
	};
	var resizer = new Resizer();
	

	/*event リサイズ実行
	--------------------------------------------------------------------*/
	var reset = function(){
		resizer.winCheck();
		resizer.canvasResize();
		setup();
	};
	win.addEventListener("resize",reset);

	
	
	/*開始
	--------------------------------------------------------------------*/
	reset();

	
}());

