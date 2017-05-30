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
		console.log(val);
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

		_c.fillStyle 	= _p.bgColor;
		_c.globalAlpha 	= _p.bgAlpha;
		_c.globalCompositeOperation = "source-over";
		_c.fillRect(0,0,_s.width,_s.height);

		_c.globalAlpha = 1;
		_c.globalCompositeOperation = _p.composition;
		
		drawSpiral();
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


	//螺旋を描く
	var drawSpiral = function(){
		var _c = ctx,
			_state = STATE,
			_radius,
			_x = 0,
			_y = 0,
			_lastX = 0,
			_lastY = 0,
			_stepLength	= 1800,
			_radiusNoise = 0,
			_radians = Math.PI/180,
			_centerX = STATE.centerX,
			_centerY = STATE.centerY;

		_c.strokeStyle = PARAM.strokeColor;
		_c.fillStyle = PARAM.strokeColor;
		
		for(var i=0; i<30; i++){
			
			_radiusNoise = Math.random()*10>>0;
			_radius = 50;
			_lastX = -999;
			_lastY = -999;
			
			//螺旋の大きさを決める値
			var _startAngle = Math.random()*360>>0,	//中心角
				_endAngle 	= _stepLength + (Math.random()*_stepLength)>>0,
				_angleStep 	= 3 + (Math.random()*10>>0);

			//ランダムじゃない値
//			var _startAngle = 0,
//				_endAngle 	= _stepLength,
//				_angleStep 	= 1;

//			_c.beginPath();

			for(var l=_startAngle; l<=_endAngle; l+=_angleStep){

				//角度を増加させる
				_radiusNoise += 0.05;
				_radius += 0.5;
//				
				//角度にノイズを与える
				var _nowRadius = _radius + (perlin.noise(_radiusNoise,_radiusNoise) * 50) - 20,
					_rad = l * _radians;
				
				//ノイズの値をリセット
//				_nowRadius = _radius;
				_x = _centerX + (_nowRadius * Math.cos(_rad));
				_y = _centerY + (_nowRadius * Math.sin(_rad));

				//線描画
//				if(_lastX > -999) _c.lineTo(_lastX,_lastY);
//				else _c.moveTo(_x,_y);
				
				_c.beginPath();
				_c.fillStyle = LIB.getRndRGBA(255,0.8,0);
				var _arcRadius = (5*Math.random())>>0;
				_c.arc(_x,_y,_arcRadius,0,360*Math.PI/180,false);
				_c.fill();

				//次の
				_lastX = _x;
				_lastY = _y;
			}
//			_c.stroke();
		};
	};


	
	
	resetup();
	

	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);
}());

