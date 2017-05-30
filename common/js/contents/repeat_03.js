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
		this.size			= 50;
		this.lineWidth		= 10;
		this.lineWidth_02	= 10;
		this.lineWidthLimit	= 20;
		this.lineCap		= "round";
		this.strokeAlpha	= 1;
		this.strokeColor 	= LIB.getRndHEX(255);
		this.strokeColor_02 = LIB.getRndHEX(255);
		this.bgColor 		= "rgb(21, 21, 21)";
		this.doTwinColor	= false;
		this.doPosNoise		= false;
		this.posNoiseLimit	= 4;
		
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
					type:Math.random()*2|0
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
		_c.fillStyle	= _c.strokeStyle 	= this.strokeColor;
	};

	/**
	 * 描画
	 * @param {object} _elm 要素単体
	 */
	Member.drawElement = function(_elm){
		var _c 			= ctx,
			_size		= this.size,
			_radius 	= _size,
			_type		= _elm.type,
			_posNoise	= (this.doPosNoise)?(Math.random()*this.posNoiseLimit-this.posNoiseLimit/2 *10|0)/10:0,
			_x			= _elm.x * _radius + _posNoise,
			_y			= _elm.y * _radius + _posNoise;
		
		_c.beginPath();
		if(_type === 0){
			if(this.doTwinColor) _c.strokeStyle = this.strokeColor;
			_c.lineWidth = this.lineWidth;
			_c.moveTo(_x,_y);
			_c.lineTo(_x+_radius,_y+_radius);
		}else if(_type === 1){
			if(this.doTwinColor) _c.strokeStyle = this.strokeColor_02;
			_c.lineWidth = this.lineWidth_02;
			_c.moveTo(_x+_radius,_y);
			_c.lineTo(_x,_y+_radius);
		}
		_c.stroke();
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
		
		this.lineWidth		= (_point.x / winWidth * this.lineWidthLimit | 0);
		this.lineWidth_02	= (_point.y / winHeight * this.lineWidthLimit | 0);
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
GUI.add(INDEX,"lineWidthLimit",1,30).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"lineCap",["round","butt","square"]).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"strokeAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"bgColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"strokeColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"strokeColor_02").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doPosNoise").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"posNoiseLimit",1,100).onChange(function(){ INDEX.loop() });


