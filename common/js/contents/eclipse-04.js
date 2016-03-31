(function () {
	"use strict";


	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
		perlin = new SimplexNoise(),
		LIB = new Planet();




	/*object
	--------------------------------------------------------------------*/

	var STATE = {
		width	:0,
		height	:0,
		centerX	:0,
		centerY	:0
	};


	/* @object Stats
	 * 処理速度確認用
	*/
	var STATS = new Stats();
	STATS.setMode( 0 );
	document.body.appendChild( STATS.domElement );
	STATS.domElement.style.position = "fixed";
	STATS.domElement.style.right = "0";
	STATS.domElement.style.bottom = "5px";


	/* @object PARAM
	 * 描画処理のパラメータを管理する
	*/
	var PARAM = {
		//描画要素
		lineWidth:1,
		bgAlpha:1,
		composition:"source-over",
		noiseRange:0.1,
		noiseLevel:50,
		//色
		fillColor:LIB.getRndRGB(200),
		strokeColor:LIB.getRndRGBA(150,0.4,105),
		bgColor:LIB.getRndRGBA(180,0.8,75),
		//分岐
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgAnim:false
	};


	/* @object
	 * dat.GUI用オブジェクト
	 */
	var DAT = new dat.GUI(),
		paramLineWidth = DAT.add(PARAM, 'lineWidth',0.1,50),
		paramNoiseLevel = DAT.add(PARAM, 'noiseLevel',1,300),
		paramNoiseRange = DAT.add(PARAM, 'noiseRange',0,0.1),
		paramStrokeColor= DAT.addColor(PARAM, 'strokeColor'),
		paramBGColor	= DAT.addColor(PARAM, 'bgColor');


	DAT.add(PARAM,'composition',["source-over","xor","lighter","multiply","difference"]);
	DAT.add(PARAM, 'flgStroke',false);
	DAT.add(PARAM, 'flgFill',false);
	DAT.addColor(PARAM, 'fillColor');
	DAT.add(PARAM, 'flgBG',false);
	DAT.add(PARAM, 'bgAlpha',0,1);
	var paramFlgAnim = DAT.add(PARAM, 'flgAnim',false);

	//数値の変更処理
	paramLineWidth.onChange(function(val){
		PARAM.lineWidth = (val < 1)? val:val>>0;
	});
	paramNoiseLevel.onChange(function(val){
		PARAM.noiseLevel = val>>0;
		setup();
	});
	paramNoiseRange.onChange(function(val){
		PARAM.noiseRange = Math.round(val * 1000) / 1000;
		setup();
	});
	paramFlgAnim.onChange(function(val){
		PARAM.flgAnim = val;
		loop();
	});
	paramStrokeColor.onChange(function(val){
		PARAM.strokeColor = val;
		loop();
	});
	paramBGColor.onChange(function(val){
		PARAM.bgColor = val;
		loop();
	});



	/*flow CANVAS操作
	--------------------------------------------------------------------*/

	/* 初期化 */
	var setup = function(){
		ctx.fillStyle 	= PARAM.bgColor;
		ctx.fillRect(0,0,STATE.width,STATE.height);
		loop();
	};


	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};


	/* ノイズ関数 */
	var noise = function(_seed){
		var _num = ( perlin.noise(_seed,0) * PARAM.noiseLevel ) >> 0;
		return _num;
	};


	/* 描画 */
	var pointLength = 0;
	var draw = function(){
		var _c = ctx,
			_p = PARAM,
			_s = STATE;

		_c.fillStyle 	= _p.bgColor;
		_c.globalAlpha 	= _p.bgAlpha;
		_c.globalCompositeOperation = "source-over";
		_c.fillRect(0,0,_s.width,_s.height);

		_c.globalAlpha = 1;
		_c.globalCompositeOperation = _p.composition;
		
		drawCircle(pointLength);
		pointLength++;
		if(pointLength >180) pointLength = 1;
	};


	/* ループ関数 */
	var loop = function(){
		STATS.begin();
		draw();
		STATS.end();
		if(PARAM.flgAnim === true) window.requestAnimationFrame(loop);
	};


	/* リサイズ */
	var resize = function(){
		var _winW = window.innerWidth || document.body.clientWidth,
			_winH = window.innerHeight || document.body.clientHeight;
		canvas.width 	= _winW;
		canvas.height 	= _winH;
		STATE.width 	= _winW;
		STATE.height 	= _winH;
		STATE.centerX 	= _winW >> 1;
		STATE.centerY 	= _winH >> 1;
	};

	
	var	_xnoise = 0,
		_ynoise = 0,
		_angnoise = 0,
		_radiusnoise = 0,
		_strokeCol = 254,
		_strokeChange =	-1;

	//円を描く
	var drawCircle = function(_pointLength){
		var _c = ctx,
			_state = STATE,
			_radius =300,
			_x = 0,
			_y = 0,
			_radians = Math.PI/180,
			_angle 	 = -(Math.PI / 2),
			_centerX = STATE.centerX,
			_centerY = STATE.centerY,
			_xnoise = 0,
			_ynoise = 0,
			_angStep		= (Math.random()*40 >> 0) + 10,
			_angnoise 		= 0,
			_radiusnoise	= 0,
			_strokeCol 		= 254,
			_strokeChange 	= -1,
			_pointLength = _pointLength;
		

		for(var i=0; i<=_pointLength; i+=1){
			
			var _rad = i*_radians;
			_x = (_centerX + (_radius * Math.sin(_rad)))>>0;
			_y = (_centerY + (_radius * Math.cos(_rad)))>>0;
			
			var _opprad = _rad+Math.PI,
//			var _opprad = _rad*Math.PI,
				_x2 = (_centerX + (_radius * Math.sin(_opprad)))>>0,
				_y2 = (_centerY + (_radius * Math.cos(_opprad)))>>0;
			
			var _col = perlin.noise(0.1,0)*20 >> 0;
			_c.strokeStyle = LIB.getRndRGB(_col,50);

//			_c.lineWidth= Math.random()*6>>0;
			_c.beginPath();
			_c.moveTo(_x,_y);
			_c.lineTo(_x2,_y2);
			_c.closePath();
			_c.stroke();
		};
	};

	
	
	resetup();
	

	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);
}());

