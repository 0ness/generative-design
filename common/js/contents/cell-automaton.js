(function () {
	"use strict";

	
	var lib = new Planet();

	


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


	/* @object paramMaster
	 * 描画処理のパラメータを管理する
	*/
	var param = {
		//描画要素
		composition:"source-over",
		cellSize:6,
		calcType:4,
		drawType:3,

		//色
		fillColor:lib.getRndRGB(255),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(100),
		fillAlpha:1,
		bgAlpha:1,

		//分岐
		flgArcFill:true,
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgAnim:false
	};


	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI();
	
	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.addColor(param, 'fillColor');
	gui.addColor(param,"bgColor");
	gui.add(param, 'fillAlpha',0,1);
	gui.add(param, 'bgAlpha',0,1);
	gui.add(param,"cellSize",1,20).onChange(function(_p){
		ctx.clearRect(0,0,n_iw,n_ih);
		cellSize	= _p|0;
		cellAry 	= [];
		numX 		= Math.floor(n_iw / cellSize);
		numY 		= Math.floor(n_ih / cellSize);
		CellMember.size 		= cellSize;
		CellMember.radius		= CellMember.size >> 1;
		restart();
	});
	gui.add(param,"calcType",[1,2,3,4]).onChange(function(_val){
		param.calcType = parseInt(_val);
		resetup();
		draw();
	});
	gui.add(param,"drawType",[1,2,3]).onChange(function(_val){
		param.drawType = parseInt(_val);
		resetup();
	});
	gui.add(param,'flgAnim',false).onChange(function(){
		loop();
	});

	

	
	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d");	
	
	
	
	
	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		n_ih = window.innerHeight || document.body.clientHeight,//ウィンドウ高さ
		n_PI = (Math.PI/180)*360,
		n_noiseRange= 0,
		n_noiseSeed = 0,
		cellSize	= param.cellSize,
		cellAry		= [],
		numX 		= Math.floor(n_iw / cellSize),
		numY 		= Math.floor(n_ih / cellSize);
	
	
	
	
	/*Class
	--------------------------------------------------------------------*/

	/**
	 * セルオブジェクト
	 * @param {Number} _x 横位置
	 * @param {Number} _y 縦位置
	 */
	var Cell = function(_x,_y){
		this.x = _x * this.size + (this.size >> 1);
		this.y = _y * this.size + (this.size >> 1);
		this.gridX = _x;
		this.gridY = _y;
		this.outSideCells = [];
		
		this.type			= true;
		//this.state			= (Math.random()*2 < 1) ? false : true;
		this.stateContinue	= 0;
		this.color			= lib.getRndRGB();
		this.switchCount	= 1;
		
		this.state 		= (Math.random()*3>>0)+1;
		if(this.state === 4) this.state = 1;
		this.nextState 	= this.state;
		this.waveLevel	= Math.random()*255>>0;
		this.avarageColor	= "#000000";
//		console.log(this.waveLevel);
	},
		CellMember = Cell.prototype;

	CellMember.ctx			= ctx;
	CellMember.size 		= cellSize;
	CellMember.radius		= CellMember.size >> 1;
	CellMember.arcEndPoint 	= Math.PI<<1;

	CellMember.collectOutSideCells = function(){
		var _gx = this.gridX,
			_gy = this.gridY,
			_adove 	= _gy - 1,
			_below 	= _gy + 1,
			_left	= _gx - 1,
			_right	= _gx + 1,
			_cells	= cellAry;

		if(_adove < 0)  _adove = numY - 1;
		if(_below >= numY)  _below = 0;
		if(_left < 0)  _left = numX - 1;
		if(_right >= numX) _right = 0;
		
		this.outSideCells = [
			_cells[_left][_adove],
			_cells[_left][_gy],
			_cells[_left][_below],
			_cells[_right][_adove],
			_cells[_right][_gy],
			_cells[_right][_below],
			_cells[_gx][_adove],
			_cells[_gx][_below]
		];
	};

	/**
	 * 周辺の状況を把握して、自身の状態を計算する
	 */
	CellMember.calcNextState = function(){
		var _type = param.calcType;
		if(_type === 1) this.gameOfLife();
		else if(_type === 2) this.vichniacVote();
		else if(_type === 3) this.braiansBrain();
		else if(_type === 4) this.avarageWave();
	};
	
	/**
	 * セル・オートマトンの計算方法
	 * Game Of Life：奇跡の計算
	 */
	CellMember.gameOfLife = function(){
		var _liveCount = 0,
			_cells	= this.outSideCells;
		
		for(var i = 0; i< _cells.length; i++){
			if(_cells[i].state === 1) _liveCount++;
		};		
		
		if(this.state === 1){
			if(_liveCount === 2 || _liveCount === 3) this.nextState = 1;
			else this.nextState = 2,this.switchCount++;
		}else {
			if(_liveCount === 3) this.nextState = 1,this.switchCount++;
			else this.nextState = 2;
		}
		
//		this.changeNextState();
	};
	
	/**
	 * セル・オートマトンの計算方法02
	 * ヴィシュニアク・ヴォート：マジョリティの計算
	 */
	CellMember.vichniacVote = function(){
		var _liveCount = 0,
			_continueCount = 0,
			_cells	= this.outSideCells,
			_baseLength = 4;
		
		for(var i = 0; i< _cells.length; i++){
			var _cell = _cells[i];
			if(_cell.state === 1) _liveCount++;
			if(_cell.stateContinue > 100) _continueCount++;
		};
		if(this.state === 1) _liveCount++;
		if(this.stateContinue > 100) _continueCount++;
		
		//状態の分岐
		if(_liveCount <= _baseLength) this.nextState = 2;
		else this.nextState = 1;
		
		if( _liveCount === _baseLength || _liveCount === (_baseLength+1)) {
			if(this.nextState === 1) this.nextState = 2;
			else this.nextState = 1;
		}
	};
	
	/**
	 * セル・オートマトンの計算方法03
	 * ブライアンの脳：発火・休息・オフの状態変化
	 */
	CellMember.braiansBrain = function(){
		var _cells 		= this.outSideCells,
			_fireCount 	= 0;
		
		if(this.state === 1) this.nextState = 2;
		else if(this.state === 2) this.nextState = 3;
		else{
			for(var i=0; i<_cells.length; i++) {
				if(_cells[i].state === 1) _fireCount++;
			}
			if(_fireCount == 2) this.nextState = 1;
			else this.nextState  = this.state;
		};
	};
	
	
	/**
	 * 波（平均化）
	 */
	CellMember.avarageWave = function(){
		var _cells  = this.outSideCells,
			_wavePoints = this.waveLevel,
			_avarage	= 0;
		for(var i=0; i<_cells.length; i++){
			_wavePoints += _cells[i].waveLevel;
		};
		this.avarageColor = _wavePoints / 9 |0;
	};
	
	
	/**
	 * 状態を継続し続けたセルに変異を生み出す
	 */
	CellMember.changeNextState = function(){
		var _continueCount = 0,
			_cells	= this.outSideCells;

		if(this.nextState === this.state) this.stateContinue++;
		else this.switchCount++;

		if(_continueCount === 4){
			for(var i = 0; i< _cells.length; i++){
				_cells[i].state = _cells[i].nextState = !this.nextState;
				_cells[i].stateContinue = 0;
			}
			this.state = this.nextState;
			this.stateContinue = 0;
		}
	};
	

	/**
	 * 描画：方法の選択
	 */
	CellMember.draw = function(){
		var _type = param.drawType;
		if(_type === 1) this.drawType_01();
		else if(_type === 2) this.drawType_02();
		else if(_type === 3) this.drawType_wave();
		this.state = this.nextState;
	};
	
	
	/**
	 * 描画：単純に発火のセルに点を置く
	 */
	CellMember.drawType_01 = function(){
		var _c = this.ctx,
			_alpha		= 0,
			_fillStyle 	= "";
		

		if(this.state === 1){
			_alpha = param.fillAlpha;
			_fillStyle = param.fillColor;
		}else if(this.state === 2){ 
			_alpha = param.fillAlpha;
			_fillStyle = param.bgColor;
		}else {
			_alpha = param.bgAlpha;
			_fillStyle = "#000";
		}
		
		_c.globalAlpha 	= _alpha;
		_c.fillStyle 	= _fillStyle;
		
		if(this.size >= 10){
			_c.beginPath();
			_c.arc(this.x,this.y,this.radius,0,this.arcEndPoint,false);
			_c.fill();
		}else {
			var _rect = this.radius;
			_c.fillRect(this.x + _rect/2,this.y,_rect,_rect*2);
			_c.fillRect(this.x,this.y+_rect/2,_rect*2,_rect);
		}
	};
	
	/**	
	 * 描画：変化の激しいセルを拡大させ、点を置く
	 */
	CellMember.drawType_02 = function(){
		var _c = this.ctx;

		if(this.state === 1){
			_c.globalAlpha = param.bgAlpha;
			_c.fillStyle = param.fillColor;
		}else {
			_c.globalAlpha = param.bgAlpha;
			_c.fillStyle = param.bgColor;
		}
		
		var _size = this.radius*(this.switchCount/10);
		if(this.size >= 10){
			_c.beginPath();
			_c.arc(this.x,this.y,_size,0,this.arcEndPoint,false);
			_c.fill();
		}else {
			var _rect = _size>>1;
			_c.fillRect(this.x + _rect/2,this.y,_rect,_rect*2);
			_c.fillRect(this.x,this.y+_rect/2,_rect*2,_rect);
		}
	};

	/**	
	 * 描画：波の挙動を描画する
	 */
	CellMember.drawType_wave = function(){
		var _c = this.ctx,
			_color = this.avarageColor;

//		_c.globalAlpha = param.bgAlpha;
		_c.globalAlpha = 1;
		_c.fillStyle = "rgb("+_color+","+_color+","+_color+")";

		var _size = this.radius*(this.switchCount/10);
		if(this.size >= 10){
			_c.beginPath();
			_c.arc(this.x,this.y,_size,0,this.arcEndPoint,false);
			_c.fill();
		}else {
			var _rect = _size>>1;
			_c.fillRect(this.x + _rect/2,this.y,_rect,_rect*2);
			_c.fillRect(this.x,this.y+_rect/2,_rect*2,_rect);
		}
	};

	
	
	
	/*flow CANVAS操作
	--------------------------------------------------------------------*/

	/* 初期化 */
	var setup = function(){
		ctx.clearRect(0,0,n_iw,n_ih);
		restart();
		draw();
//		if(param.flgAnim === false) loop();
	};

	
	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};
	
	
	var restart = function(){
				
		for(var x = 0; x<numX; x++){
			cellAry[x] = [];
			for(var y = 0; y<numY; y++){
				cellAry[x][y] = new Cell(x,y);
			}
		}
		for(var x = 0; x<numX; x++){
			for(var y = 0; y<numY; y++){
				cellAry[x][y].collectOutSideCells();
			}
		}
	};

	/* 描画 */	
	var draw = function(){
		var _c 		= ctx,
			_cells	= cellAry;
//		_c.fillStyle 	= param.bgColor;
//		_c.fillStyle 	= "#000000";
		_c.globalAlpha 	= param.bgAlpha;
		_c.globalCompositeOperation = param.composition;
		_c.fillRect(0,0,n_iw,n_ih);

		for(var x = 0; x<numX; x++){
			for(var y = 0; y<numY; y++){
				_cells[x][y].calcNextState();
			}
		}
		
		for(var x = 0; x<numX; x++){
			for(var y = 0; y<numY; y++){
				_cells[x][y].draw();
			}
		}
	};
	
	/* ループ関数 */
	var loop = function(){
		stats.begin();
		draw();
		stats.end();
		if(param.flgAnim === true) window.requestAnimationFrame(loop);
	};

	
	/* リサイズ */
	var resize = function(){
		n_iw = window.innerWidth || document.body.clientWidth;
		n_ih = window.innerHeight || document.body.clientHeight;
		canvas.width = n_iw;
		canvas.height = n_ih;
	};
	
	
	


	/*flow 開始
	--------------------------------------------------------------------*/
	resetup();
	window.addEventListener("resize",resetup);
	
	
	
	
}());

