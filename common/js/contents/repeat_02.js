(function () {
	"use strict";
	

	/* static properties
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var canvas 	= document.getElementById("myCanvas"),
		ctx 	= canvas.getContext("2d"),
		LIB 	= new Planet(),
		SEED	= {
			x:0.01,
			y:0.01,
			startX:0,
			startY:0
		},
		winWidth 	= window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		winHeight	= window.innerHeight || document.body.clientHeight,
		endAngle 	= Math.PI * 180;
	
	
	
	
	/*SubClass Dot
	--------------------------------------------------------------------*/
	var LineGrid = function(){
		this.init();
	},
		Member = LineGrid.prototype;
	
	Member.bgColor 		= "rgba(0,0,0,1)";
	Member.bgAlpha		= 1;
	Member.xLength		= 40;
	Member.yLength		= 30;
	Member.radiusScale	= 20;
	Member.xMargin		= 0;
	Member.yMargin		= 0;
	Member.lineWidth	= 5;
	Member.strokeColor  = "#ffffff";
	Member.seedAnimStep = 0.05;
	Member.seedStepX	= 0.0006;
	Member.seedStepY	= 0.0003;
	Member.isAnimation 	= false;
	
	
	/**
	 * starting method
	 */
	Member.init = function(){
		window.addEventListener("resize",this.resizeEvent.bind(this));
		window.addEventListener("mousemove",this.dinamicParamChange.bind(this));
		this.resizeEvent();
		this.loop();
	};
	
	/**
	 * canvas template draw
	 */
	Member.baseDraw = function(){
		var _c = ctx;
		_c.fillStyle 	= this.bgColor;
		_c.globalAlpha 	= this.bgAlpha;
		_c.globalCompositeOperation = "source-over";
		_c.fillRect(0,0,winWidth,winHeight);
		_c.globalAlpha 	= 1;
		_c.lineWidth 	= this.lineWidth;
		_c.fillStyle	= _c.strokeStyle 	= this.strokeColor;
	};
	
	
	Member.drawElement = function(x,y,radius){
		var _c 			= ctx,
			_noiseRadius= ((noise.perlin2(SEED.x,SEED.y))*this.radiusScale|0) /*+ (Math.random()*5|0)*/,
			//			_radius 	= ((radius - _noiseRadius) <= 0)? radius : radius - _noiseRadius,
			_radius 	= radius,
			_judge		= (Math.random()*2),
			_level		= ((Math.random()*5)>>0)+2,
			_lw			= 10;

		_level = 1;
		//		_c.lineCap = "butt";
		//		_c.fillStyle =  "#f70000";
		//		_c.fillRect(x,y,_radius,_radius);
		_c.lineCap = "round";
		//		_c.lineWidth 	= _p.lineWidth;

		_c.beginPath();
		if(_judge >= 1){
			_c.moveTo(x,y);
			_c.lineTo((x+_radius*_level),(y+_radius*_level));
		}else{
			//			_c.lineCap = "square";
			_c.moveTo((x+_radius),y);
			_c.lineTo(x,(y+_radius));
		}
		_c.stroke();

		//		SEED.x += 0.00001;
		//		SEED.y += 0.00001;
	};

	//円描画をリピートする
	Member.drawRepeat = function(){
		var _xMargin	= this.xMargin,
			_yMargin	= this.yMargin,
			_xLength 	= this.xLength,
			_radius		= winWidth / _xLength,
			_yLength 	= (winHeight / _radius >> 0) + 1,//this.yLength,
			_xDistance 	= ((winWidth - _xMargin*2) - ((_xLength-1) * (_radius*2))) / _xLength,
			_yDistance 	= ((winHeight - _yMargin*2) - ((_yLength-1) * (_radius*2))) / _yLength;

//		_xDistance = _yDistance = 1;

		for( var x = 0; x<_xLength; x++){
			SEED.y += this.seedStepX;
			SEED.x = SEED.startX;

			for(var y = 0; y<_yLength; y++){
				SEED.x += this.seedStepX;
//				var _x = ((x*_radius*2) + (x*_xDistance) + (_xDistance/2) + _xMargin)|0,
//					_y = ((y*_radius*2) + (y*_yDistance) + (_yDistance/2) + _yMargin)|0;
				var _x = x * _radius,
					_y = y * _radius;
				this.drawElement(_x,_y,_radius);
			}
		}
		//		SEED.x += this.seedStepX;
		SEED.y 		= SEED.startX;
		SEED.startX += this.seedAnimStep;
		//		SEED.y += this.seedStepY;
		//		SEED.y 
	};
	
	/**
	 * animation loop
	 */
	Member.loop = function(){
		stats.begin();
		this.baseDraw();
		this.drawRepeat();
		if(this.isAnimation === true) window.requestAnimationFrame(this.loop.bind(this));
		stats.end();
	};
	
	/**
	 * param change method
	 * @param {object} e event object
	 */
	Member.dinamicParamChange = function(e){
		var _point = {
				x:0,
				y:0
			};
		_point.x = e.pageX;
		_point.y = e.pageY;
		var _width =  (_point.y / winHeight * 1200 | 0) / 100;
		this.lineWidth = _width;
		this.loop();
	};
	
	/**
	 * canvas resized function
	 */
	Member.resizeEvent = function(){
		winWidth = window.innerWidth || document.body.clientWidth;
		winHeight = window.innerHeight || document.body.clientHeight;
		canvas.width = winWidth;
		canvas.height = winHeight;
	};
	
	
	
	
	/*develop object
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
	var GUI = new dat.GUI();

	GUI.add(LineGrid,"xLength",1,200).onChange(function(_val){
		if(LineGrid.isAnimation === false) LineGrid.loop();
	});
	GUI.add(LineGrid,"lineWidth",1,20).onChange(function(_val){
		if(LineGrid.isAnimation === false) LineGrid.loop();
	});
	GUI.addColor(LineGrid,"strokeColor").onChange(function(_val){
		if(LineGrid.isAnimation === false) LineGrid.loop();
	});
	GUI.addColor(LineGrid,"bgColor").onChange(function(_val){
		if(LineGrid.isAnimation === false) LineGrid.loop();
	});
	//	GUI.add(PARAM,"yLength",1,200).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"xMargin",1,200).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"yMargin",1,200).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"radiusScale",1,50).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"seedAnimStep",0,0.2).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"seedStepX",0,0.5).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	//	GUI.add(PARAM,"seedStepY",0,0.5).onChange(function(_val){
	//		if(PARAM.isAnimation === false) loop();
	//	});
	GUI.add(LineGrid,"bgAlpha",0,1);
	GUI.add(LineGrid,"isAnimation").onChange(function(_val){
		LineGrid.isAnimation = _val;
		if(_val) LineGrid.loop();
	});


	
	
	
	window.LineGrid = LineGrid;
}());

var LG = new LineGrid();