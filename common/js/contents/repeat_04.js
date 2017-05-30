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
		endAngle 	= Math.PI * 180,
		twoPi		= Math.PI * 2;
	
	
	
	
	/*SubClass Dot
	--------------------------------------------------------------------*/
	var LineGrid = function(){
		this.elements		= [];
		this.size			= 40;
		this.radius			= 8;
		this.lineWidth		= 2;
		this.lineWidth_02	= 2;
		this.lineWidthLimit	= 20;
		this.lineCap		= "round";
		this.strokeAlpha	= 1;
		this.fillColor 		= LIB.getRndHEX(125);
		this.fillColor_02	= LIB.getRndHEX(15);
		this.bgColor 		= "rgb(240, 240, 240)";
		this.doTwinColor	= false;
		this.doPosNoise		= false;
		this.posNoiseLimit	= 4;
		this.xRatio			= 0;
		this.moveLimit		= 30;
		
		window.addEventListener("resize",this.resizeEvent.bind(this));
		window.addEventListener("mousemove",this.dinamicParamChange.bind(this));
		this.init();
	},
		Member = LineGrid.prototype;
	
	Member.bgAlpha		= 1;
	Member.xLength		= 40;
	Member.yLength		= 30;
	Member.xMargin		= 0;
	Member.yMargin		= 0;
	Member.baseRadius	= 40;
	Member.baseRadius2	= 5;
	Member.seedAnimStep = 0.05;
	Member.seedStepX	= 0.0006;
	Member.seedStepY	= 0.0003;
	Member.isAnimation 	= false;
	
	
	/**
	 * starting method
	 */
	Member.init = function(){
		var _size	= this.size,
			_xLen	= winWidth/_size,
			_yLen	= winHeight/_size;

		this.elements = [];
		
		for(var _x=0; _x < _xLen; _x++){
			for(var _y=0; _y < _yLen; _y++){
				this.elements.push({
					x:_x,
					y:_y,
					type:Math.random()*4|0,
					type2:Math.random()*4|0
				})
			}
		}

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
		_c.lineWidth 	= (this.lineWidth * 100 | 0) / 100;
		_c.lineCap		= this.lineCap;
		_c.fillStyle	= _c.strokeStyle 	= this.fillColor;
	};

	/**
	 * 描画
	 * @param {object} _elm 要素単体
	 */
	Member.drawElement = function(_elm){
		var _c 			= ctx,
			_size		= this.size,
			_radius 	= this.radius,
			_type		= _elm.type,
			_type2		= _elm.type2,
			_posNoise	= (this.doPosNoise)?(Math.random()*this.posNoiseLimit-this.posNoiseLimit/2 *10|0)/10:0,
			_x			= (_elm.x * _size + _posNoise) + _size/2 - _radius/2,
			_y			= (_elm.y * _size + _posNoise) + _size/2 - _radius/2,
			_moveNoise	= this.xRatio * this.moveLimit;
		
		if(_type === 0) _x += _moveNoise;
		else if(_type === 1) _x -= _moveNoise;
		else if(_type === 2) _y += _moveNoise;
		else _y -= _moveNoise;
		
		_c.beginPath();
		_c.fillStyle = this.fillColor;
		_c.arc(_x,_y,_radius,0,endAngle,false);
		_c.fill();
		
		if(_type2 === 0) _x += _moveNoise;
		else if(_type2 === 1) _x -= _moveNoise;
		else if(_type2 === 2) _y += _moveNoise;
		else _y -= _moveNoise;

		_c.beginPath();
		_c.fillStyle = this.fillColor_02;
		_c.arc(_x,_y,this.baseRadius2,0,endAngle,false);
		_c.fill();

	};
	
	/**
	 * 各要素を描画
	 */
	Member.drawRepeat = function(){
		var _c 			= ctx,
			_elements	= this.elements;
		_c.globalAlpha = this.strokeAlpha;
		for(var _i=0; _i<_elements.length; _i++){
			this.drawElement(_elements[_i]);
		}
	};

	/**
	 * animation loop
	 */
	Member.loop = function(){
		this.baseDraw();
		this.drawRepeat();
		if(this.isAnimation === true) window.requestAnimationFrame(this.loop.bind(this));
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
		
		this.xRatio 	= _point.x / winWidth;
		this.yRatio		= _point.y / winHeight;
		this.radius     = this.baseRadius * this.yRatio;
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
	
	
	
	
	window.LineGrid = LineGrid;
}());

var INDEX = new LineGrid();


/*develop object
	--------------------------------------------------------------------*/
/* @object
	 * dat.GUI用オブジェクト
	*/
var GUI = new dat.GUI();
GUI.add(INDEX,"size",1,100).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"baseRadius",1,50).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"baseRadius2",1,50).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"strokeAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"bgAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"bgColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"fillColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"fillColor_02").onChange(function(){ INDEX.loop() });
//GUI.addColor(INDEX,"fillColor_02").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doTwinColor").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"moveLimit",0,100).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doPosNoise").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"posNoiseLimit",1,80).onChange(function(){ INDEX.loop() });


