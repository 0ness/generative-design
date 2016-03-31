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
		strokeColor:LIB.getRndRGB(200),
		bgColor:LIB.getRndRGB(135,120),
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
		paramNoiseRange = DAT.add(PARAM, 'noiseRange',0,0.1);

	DAT.add(PARAM,'composition',["source-over","xor","lighter","multiply","difference"]);
	DAT.add(PARAM, 'flgStroke',false);
	DAT.add(PARAM, 'flgFill',false);
	DAT.addColor(PARAM, 'fillColor');
	DAT.addColor(PARAM, 'strokeColor');
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
	})



	/*flow CANVAS操作
	--------------------------------------------------------------------*/

	/* 初期化 */
	var setup = function(){
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
	var draw = function(){
		var _c = ctx,
			_p = PARAM,
			_s = STATE;

		_c.fillStyle = _p.bgColor;
		_c.globalAlpha = _p.bgAlpha;
		_c.globalCompositeOperation = "source-over";
		_c.fillRect(0,0,_s.width,_s.height);

		_c.globalAlpha = 1;
		_c.globalCompositeOperation = _p.composition;
		
		circle();
		circle_02();
		circle_03();
		circle_04();
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


	//通常の円
	var circle = function(){
		var _c = ctx,
			_state = STATE,
			_radius= 50,
			_rad = 0*Math.PI/180,
			_x = 100 + (_radius * Math.cos(_rad)),
			_y = 100 + (_radius * Math.sin(_rad)),
			_lastX = -999,
			_lastY = -999;
		
		_c.beginPath();
		_c.moveTo(_x,_y);
		for(var i=0; i<=360; i+=5){
			_rad = i*Math.PI/180;
			_x = 100 + (_radius * Math.cos(_rad));
			_y = 100 + (_radius * Math.sin(_rad));
			_c.lineTo(_x,_y);
		};
		_c.closePath();
		_c.stroke();
	};
	
	//螺旋の円
	var circle_02 = function(){
		var _c = ctx,
			_state = STATE,
			_radius= 0,
			_rad = 0*Math.PI/180,
			_x = 220 + (_radius * Math.cos(_rad)),
			_y = 100 + (_radius * Math.sin(_rad)),
			_lastX = -999,
			_lastY = -999;

		for(var i=0; i<=1440; i+=5){
			_rad = i*Math.PI/180;
			_radius += 0.20;
			_x = 220 + (_radius * Math.cos(_rad));
			_y = 100 + (_radius * Math.sin(_rad));
			
			if(_lastX > -999){
				_c.beginPath();
				_c.moveTo(_x,_y);
				_c.lineTo(_lastX,_lastY);
				_c.closePath();
				_c.stroke();
			}
			_lastX = _x;
			_lastY = _y;
		};
	};
	
	//螺旋の円
	var circle_03 = function(){
		var _c = ctx,
			_state = STATE,
			_radius= 15,
			_rad = 0*Math.PI/180,
			_x = 340 + (_radius * Math.cos(_rad)),
			_y = 100 + (_radius * Math.sin(_rad)),
			_lastX = -999,
			_lastY = -999;

		for(var i=0; i<=1440; i+=15){
			_rad = i*Math.PI/180;
			_radius += 0.1*(perlin.noise(i,0)*50);
			_x = 340 + (_radius * Math.cos(_rad));
			_y = 100 + (_radius * Math.sin(_rad));

			if(_lastX > -999){
				_c.beginPath();
				_c.moveTo(_x,_y);
				_c.lineTo(_lastX,_lastY);
				_c.closePath();
				_c.stroke();
			}
			_lastX = _x;
			_lastY = _y;
		};
	};

	//螺旋の円
	var circle_04 = function(){
		var _c = ctx,
			_state = STATE,
			_radius,
			_x = 0,
			_y = 0,
			_lastX = 0,
			_lastY = 0,
			_radiusNoise = 0;

		for(var i=0; i<100; i++){
			
			_radiusNoise = Math.random()*10;
			_radius = 10;
			_lastX = -999;
			_lastY = -999;
			
			var _startAngle = Math.random()*360>>0,
				_endAngle 	= 1440 + (Math.random()*1440)>>0,
				_angleStep 	= 5 + (Math.random()*3>>0);
			
			for(var l=_startAngle; l<=_endAngle; l+=_angleStep){
				
				_radiusNoise += 0.05;
				_radius += 0.5;
				
				var _nowRadius = _radius + (perlin.noise(_radiusNoise,_radiusNoise) * 20) - 10,
					_rad = l * Math.PI / 180;

				_x = 460 + (_nowRadius * Math.cos(_rad));
				_y = 100 + (_nowRadius * Math.sin(_rad));

				if(_lastX > -999){
					_c.strokeStyle = "rgba(0,0,0,0.2)";
					_c.beginPath();
					_c.moveTo(_x,_y);
					_c.lineTo(_lastX,_lastY);
					_c.closePath();
					_c.stroke();
				}
				_lastX = _x;
				_lastY = _y;
			}
		};
	};


	
	
	resetup();
	

	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);
}());

