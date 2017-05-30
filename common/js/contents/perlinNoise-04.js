(function () {
	"use strict";
	

	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
		perlin = new SimplexNoise(),
		lib = new Planet();
	
	
	
	
	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = window.innerWidth || document.body.clientWidth,  //ウィンドウ幅
		n_ih = window.innerHeight || document.body.clientHeight,//ウィンドウ高さ
		n_PI = (Math.PI/180)*360,
		n_noiseRange = 0,
		n_noiseSeed = 0;



	

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
	function ParamMaster(){}
	ParamMaster.prototype = {
		//描画要素
		lineWidth:1,
		bgAlpha:1,
		composition:"source-over",
		noiseRange:0.1,
		noiseLevel:2,
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(135,120),
		//分岐
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgAnim:false
	};
	var param = new ParamMaster();

	
	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
		paramLineWidth = gui.add(param, 'lineWidth',0.1,50),
		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(param, 'noiseRange',0,0.1);

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(param, 'flgStroke',false);
	gui.add(param, 'flgFill',false);
	gui.addColor(param, 'fillColor');
	gui.addColor(param, 'strokeColor');
	gui.add(param, 'flgBG',false);
	gui.add(param, 'bgAlpha',0,1);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
	paramLineWidth.onChange(function(val){
		param.lineWidth = (val < 1)? val:val>>0;
	});
	paramNoiseLevel.onChange(function(val){
		param.noiseLevel = val>>0;
		setup();
	});
	paramNoiseRange.onChange(function(val){
		param.noiseRange = Math.round(val * 1000) / 1000;
		setup();
	});
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
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
//		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0;
		var num = ( perlin.noise(_seed,0) * param.noiseLevel );
		return num;
	};

	
	/* 描画 */
	var draw = function(){
		var c = ctx,
			p = param;

		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.globalCompositeOperation = "source-over";
//		c.fillRect(0,0,n_iw,n_ih);

		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		c.strokeStyle = "#ffffff";
		
		line();
		line_02();
		line_03();
		line_04();
		line_05();
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
	
	
	
	var _lineMargin = 20,
		_lineWidth 	= n_iw - _lineMargin;
	
	
	//noise無し　サインカーブ
	var line = function(){
		var c = ctx,
			_angle = 0,
			_lastX = -999,
			_lastY = -999;

		for(var i = _lineMargin; i<=_lineWidth; i++){
			var _rad = _angle*Math.PI/180,
				_y = 50 + (Math.sin(_rad) * 40);

			if(_lastX > -999){
				c.beginPath();
				c.moveTo(i,_y);
				c.lineTo(_lastX,_lastY);
				c.stroke();
			}
			_lastX = i;
			_lastY = _y;
			_angle++;
		}
	};
	
	//noise無し　コサインカーブ
	var line_02 = function(){
		var c = ctx,
			_angle = 0,
			_lastX = -999,
			_lastY = -999;

		for(var i = _lineMargin; i<=_lineWidth; i++){
			var _rad = _angle*Math.PI/180,
				_y = 200 + (Math.cos(_rad) * 40);

			if(_lastX > -999){
				c.beginPath();
				c.moveTo(i,_y);
				c.lineTo(_lastX,_lastY);
				c.stroke();
			}
			_lastX = i;
			_lastY = _y;
			_angle++;
		}
	};

	//noise無し　サインカーブ02
	var line_03 = function(){
		var c = ctx,
			_angle = 0,
			_lastX = -999,
			_lastY = -999;

		for(var i = _lineMargin; i<=_lineWidth; i++){
			var _rad = _angle*Math.PI/180,
				_y = 350 + (Math.pow(Math.sin(_rad),3) * 40);

			if(_lastX > -999){
				c.beginPath();
				c.moveTo(i,_y);
				c.lineTo(_lastX,_lastY);
				c.stroke();
			}
			_lastX = i;
			_lastY = _y;
			_angle++;
		}
	};

	//noise有り　サインカーブ02
	var line_04 = function(){
		var c = ctx,
			_angle = 0,
			_lastX = -999,
			_lastY = -999;

		for(var i = _lineMargin; i<=_lineWidth; i++){
			var _rad = _angle*Math.PI/180,
				_y 	= 500 + ( Math.pow(Math.sin(_rad),3) + perlin.noise(_rad/2,_rad/2) * 30);

			if(_lastX > -999){
				c.beginPath();
				c.moveTo(i,_y);
				c.lineTo(_lastX,_lastY);
				c.stroke();
			}
			_lastX = i;
			_lastY = _y;
			_angle++;
		}
	};

	//noise有り　サインカーブ02
	var line_05 = function(){
		var c = ctx,
			_angle = 0,
			_lastX = -999,
			_lastY = -999,
			_retVal = function(){
				var n = 1 - Math.pow(Math.random(1),5);
				return n;
			};

		for(var i = _lineMargin; i<=_lineWidth; i++){
			var _rad = _angle*Math.PI/180,
				_y 	= 650 + _retVal()*30

			if(_lastX > -999){
				c.beginPath();
				c.moveTo(i,_y);
				c.lineTo(_lastX,_lastY);
				c.stroke();
			}
			_lastX = i;
			_lastY = _y;
			_angle++;
		}
	};

	
	
	
	resetup();
	


	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);

	return false;
}());

