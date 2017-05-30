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
		this.size			= 200;
		this.patternRepeat 	= 10;
		this.patternMargin	= 3;
		this.centeringLevel	= 1;
		this.lineWidth		= 1;
		this.strokeAlpha	= 1;
		this.bgColor 		= "rgb(200, 200, 200)";
		this.strokeColor 	= "#000000";
		this.doFill			= false;
		this.doPosNoise		= false;
		this.posNoiseLimit	= 4;
		this.doArcNoise		= false;
		this.arcNoiseLimit	= 4;
		
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
					type:Math.random()*4|0
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
		_c.fillStyle	= _c.strokeStyle 	= this.strokeColor;
	};

	/**
	 * 描画
	 * @param {object} _elm 要素単体
	 */
	Member.drawElement = function(_elm){
		var _c 		= ctx,
			_size	= this.size,
			_radius = _size/2,
			_len	= (this.patternRepeat === 0)?1:this.patternRepeat,
			_type	= _elm.type,
			_x		= _elm.x,
			_y		= _elm.y;
		
		for(var i=0; i<_len; i++){
			var _margin 	= i*this.patternMargin,
				_margin2 	= _margin*this.centeringLevel,
				_posNoise	= (this.doPosNoise)?(Math.random()*this.posNoiseLimit-this.posNoiseLimit/2 *10|0)/10:0,
				_arcNoise	= (this.doArcNoise)?(Math.random()*this.arcNoiseLimit-this.arcNoiseLimit/2 *10|0)/10:0,
				_arcSize	= _radius - _margin + _arcNoise,
				_arcX		= _x*_size+_radius + _posNoise,
				_arcY 		= _y*_size+_radius + _posNoise;
			
			if(_arcSize<=0) continue; 
			
			_c.beginPath();
			if(_type === 0) _c.arc(_arcX,_arcY-_margin2,_arcSize,0,endAngle,false);
			else if(_type === 1) _c.arc(_arcX,_arcY+_margin2,_arcSize,0,endAngle,false);
			else if(_type === 2) _c.arc(_arcX-_margin2,_arcY,_arcSize,0,endAngle,false);
			else if(_type === 3) _c.arc(_arcX+_margin2,_arcY,_arcSize,0,endAngle,false);
			_c.closePath();
			
			if(this.doFill) _c.fill();
			else _c.stroke();
		}
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
		
		this.centeringLevel= (_point.y / winHeight * 100 | 0) / 100;
		this.patternRepeat = (_point.x / winWidth * 30 | 0);
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
GUI.add(INDEX,"size",4,200).onChange(function(){ INDEX.init() });
GUI.add(INDEX,"lineWidth",0.01,10).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"patternMargin",0,5).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"strokeAlpha",0.01,1).onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"bgColor").onChange(function(){ INDEX.loop() });
GUI.addColor(INDEX,"strokeColor").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doFill").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doPosNoise").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"posNoiseLimit",1,100).onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"doArcNoise").onChange(function(){ INDEX.loop() });
GUI.add(INDEX,"arcNoiseLimit",1,20).onChange(function(){ INDEX.loop() });


