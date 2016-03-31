(function () {
	"use strict";
	

	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
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
		limitSize:200,
		lineWidth:1,
		bgAlpha:1,
		composition:"source-over",
		
		//ノイズ要素
		noiseRange:0.1,
		noiseLevel:2,
		noiseStepX:0.02,
		noiseStepY:0.02,
		noiseAnimeStep:0.01,
		
		//ステップ数
		stepX:15,
		stepY:15,
		
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(10,200),
		r:255,
		g:255,
		b:255,
		
		//分岐
		flgArcFill:true,
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
//		paramLineWidth 	= gui.add(param, 'lineWidth',0.1,50),
		paramNoiseLevel = gui.add(param,'noiseLevel',1,300),
		paramNoiseRange = gui.add(param,'noiseRange',0,0.1),
		paramNoiseStepX	= gui.add(param,"noiseStepX",0,0.1),
		paramNoiseStepY	= gui.add(param,"noiseStepY",0,0.1),
		paramNoiseAnimStep	= gui.add(param,"noiseAnimeStep",0.001,0.1),
		paramLimitSize 	= gui.add(param,'limitSize',1,300),
		paramColorRed	= gui.add(param,"r",0,255),
		paramColorBlue	= gui.add(param,"g",0,255),
		paramColorGreen	= gui.add(param,"b",0,255),
		paramStepX		= gui.add(param,"stepX",1,100),
		paramStepY		= gui.add(param,"stepY",1,100),
		paramArcFill	= gui.add(param,"flgArcFill");


	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
//	gui.add(param, 'flgStroke',false);
//	gui.add(param, 'flgFill',false);
//	gui.addColor(param, 'fillColor');
//	gui.addColor(param, 'strokeColor');
	gui.add(param, 'flgBG',false);
	gui.add(param, 'bgAlpha',0,1);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
//	paramLineWidth.onChange(function(val){
//		param.lineWidth = (val < 1)? val:val>>0;
//	});
	paramNoiseLevel.onChange(function(val){
		param.noiseLevel = val>>0;
		draw();
	});
	paramNoiseStepX.onChange(function(val){
		param.noiseStepX = val;
		draw();
	});
	paramNoiseStepY.onChange(function(val){
		param.noiseStepY = val;
		draw();
	});
	paramNoiseAnimStep.onChange(function(val){
		param.noiseAnimeStep = val;
	});
	paramColorRed.onChange(function(val){
		param.r = val;
		draw();
	});
	paramColorGreen.onChange(function(val){
		param.g = val;
		draw();
	});
	paramColorBlue.onChange(function(val){
		param.b = val;
		draw();
	});
	paramStepX.onChange(function(val){
		param.stepX = val;
		draw();
	});
	paramStepY.onChange(function(val){
		param.stepY = val;
		draw();
	});
	paramNoiseRange.onChange(function(val){
		param.noiseRange = Math.round(val * 1000) / 1000;
		draw();
	});
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
		loop();
	});
	paramLimitSize.onChange(function(val){
		param.limitSize = val;
		draw();
	});
	paramArcFill.onChange(function(val){
		param.flgArcFill = val;
		draw();
	});
	

	
	/*flow CANVAS操作
	--------------------------------------------------------------------*/

	/* 初期化 */
	var setup = function(){
		ctx.clearRect(0,0,n_iw,n_ih);
		loop();
	};

	
	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};
	

	/* ノイズ関数 */
//	var noise = function(_seed){
//		var num = ( perlin.noise(_seed,0) * param.noiseLevel );
//		return num;
//	};

	//ノイズの開始値と変化するノイズ値
	var xStartNoise = Math.random()*10,
		xNoise = xStartNoise,
		yNoise = 1;
	
	
	/* 描画 */
	var draw = function(){
		var c = ctx,
			p = param;

		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.fillRect(0,0,n_iw,n_ih);
		c.globalCompositeOperation = "source-over";
		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		
		var	_colorNoise = Math.random()*10|0,
			_xNoiseStep = param.noiseStepX,
			_yNoiseStep = param.noiseStepY,
			_xStep	= param.stepX,
			_yStep	= param.stepY,
			_size 	= 40,
			_limitSize = param.limitSize,
			_PI = ((Math.PI*360)*100|0)/100;

		//ステップ数毎にxとy軸にシェイプを描画
		for(var y=0; y<n_ih; y+=_yStep){
			
			yNoise += _yNoiseStep;
			xNoise = xStartNoise;
			
			for(var x=0; x<n_iw; x+=_xStep){
				xNoise += _xNoiseStep;
				_colorNoise += _xNoiseStep;

				//各描画のプロパティにノイズを加える
				var _alpha 	= Math.abs(noise.perlin2(xNoise,yNoise)*100|0)/100,
					_size 	= Math.abs( (Math.random()*_limitSize) * noise.perlin2(xNoise,yNoise)),
					_x 		= x + ((Math.random()*20|0) * noise.perlin2(xNoise,yNoise))|0,
					_y 		= y + ((Math.random()*20|0) * noise.perlin2(xNoise,yNoise))|0;

				//見た目に影響の無い範囲で塗りを間引く
				_size 	= (_size*10|0)/10;
				if(_size < 0.5 || _alpha < 0.03) continue;
				
				c.fillStyle = lib.getRndRGBA_02(p.r,p.g,p.b,_alpha);
				c.beginPath();
				
				//シェイプをパラメータで分岐
				if(p.flgArcFill){ 
					c.arc(_x,_y,_size,0,_PI,false);
					c.closePath();
					c.fill();
				}else c.fillRect(x,y,_size,_size);
			}
		}
		yNoise = xStartNoise;
		xStartNoise += param.noiseAnimeStep;
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

