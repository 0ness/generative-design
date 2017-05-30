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
		this.fillAlpha		= 0.8;
		this.fillColor 		= LIB.getRndHEX(125);
		this.bgColor 		= "rgb(240, 240, 240)";
		this.doPosNoise		= false;
		this.doStroke		= false;
		this.xRatio			= 0;
		this.moveLimit		= 30;
		this.breakDownLimit = 100;
		this.composition	= "multiply";
		
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
			_yLen	= winHeight/_size,
			_breakLimit = this.breakDownLimit;

		this.elements = [];
		
		for(var _x=0; _x < _xLen; _x++){
			for(var _y=0; _y < _yLen; _y++){
				this.elements.push({
					x:_x,
					y:_y,
					px_01:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					px_02:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					px_03:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					px_04:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					py_01:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					py_02:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					py_03:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
					py_04:(Math.random()*_breakLimit-(_breakLimit>>1))|0,
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
			_x			= (_elm.x * _size),
			_y			= (_elm.y * _size),
			_moveNoise	= this.xRatio * this.moveLimit,
			_px_1 		= (_elm.px_01 * this.yRatio * 10 | 0) /10,
			_px_2 		= (_elm.px_02 * this.yRatio * 10 | 0) /10,
			_px_3 		= (_elm.px_03 * this.yRatio * 10 | 0) /10,
			_px_4 		= (_elm.px_04 * this.yRatio * 10 | 0) /10,
			_py_1 		= (_elm.py_01 * this.yRatio * 10 | 0) /10,
			_py_2 		= (_elm.py_02 * this.yRatio * 10 | 0) /10,
			_py_3 		= (_elm.py_03 * this.yRatio * 10 | 0) /10,
			_py_4 		= (_elm.py_04 * this.yRatio * 10 | 0) /10;

		if(_type === 0) _x += _moveNoise;
		else if(_type === 1) _x -= _moveNoise;
		else if(_type === 2) _y += _moveNoise;
		else _y -= _moveNoise;
		
		_c.beginPath();
		_c.fillStyle = this.fillColor;
		_c.moveTo(_x+_px_1,_y+_py_1);
		_c.lineTo(_x+_size+_px_2,_y+_py_2);
		_c.lineTo(_x+_size+_px_3,_y+_size+_py_3);
		_c.lineTo(_x+_px_4,_y+_size+_py_4);
		_c.closePath();
		
		if(this.doStroke) _c.stroke();
		else _c.fill();
	};
	
	/**
	 * 各要素を描画
	 */
	Member.drawRepeat = function(){
		var _c 			= ctx,
			_elements	= this.elements;
		_c.globalCompositeOperation = this.composition;
		_c.globalAlpha = this.fillAlpha;
		_c.lineWidth = 1;
		
		for(var _i=0; _i<_elements.length; _i=(_i+1)|0){
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
GUI.add(INDEX,"fillAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"bgAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"bgColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"fillColor").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"moveLimit",0,100).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"breakDownLimit",0,200).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"doStroke").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"composition",["source-over","lighter","multiply"]).onChange(function(){ INDEX.loop() });


