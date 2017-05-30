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
		noiseStepX:0.075,
		noiseStepY:0.1,
		noiseAnimeStep:0.02,
		noiseX:0.1,
		noiseY:0.1,
		
		randomTranslateX:100,
		randomTranslateY:100,
		
		//ステップ数
		stepX:15,
		stepY:15,
		
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		r:10,
		g:Math.random()*200|0 + 55,
		b:Math.random()*200|0 + 55,
		bgColor:lib.getRndRGB(50,205),
		
		//分岐
		flgArcFill:true,
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgAnim:false,
		rotateType:"01"
	};
	var param = new ParamMaster();

	
	/* @object
	 * dat.GUI用オブジェクト
	 */
	var gui = new dat.GUI(),
//		paramLineWidth 	= gui.add(param, 'lineWidth',0.1,50),
		paramNoiseLevel = gui.add(param,'noiseLevel',1,300),
		paramNoiseRange = gui.add(param,'noiseRange',0,0.1),
		paramNoiseX	= gui.add(param,"noiseX",0,0.1),
		paramNoiseY	= gui.add(param,"noiseY",0,0.1),
		paramNoiseStepX	= gui.add(param,"noiseStepX",0,0.1),
		paramNoiseStepY	= gui.add(param,"noiseStepY",0,0.1),
		paramRandomTranslateX	= gui.add(param,"randomTranslateX",0,200),
		paramRandomTranslateY	= gui.add(param,"randomTranslateY",0,200),
		paramNoiseAnimStep	= gui.add(param,"noiseAnimeStep",0.001,0.1),
		paramStepX		= gui.add(param,"stepX",1,100),
		paramStepY		= gui.add(param,"stepY",1,100),
		paramArcFill	= gui.add(param,"flgArcFill");

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(param,'rotateType',["01","02","03","04"]);
	gui.add(param,'r',0,255);
	gui.add(param,'g',0,255);
	gui.add(param,'b',0,255);
	gui.addColor(param, 'bgColor');
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
	paramNoiseX.onChange(function(val){
		param.noiseX = val;
		draw();
	});
	paramNoiseY.onChange(function(val){
		param.noiseY = val;
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
		
		c.setTransform(1, 0, 0, 1, 0, 0);

		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.fillRect(0,0,n_iw,n_ih);
		c.globalCompositeOperation = "source-over";
		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		
		var	_colorNoise = Math.random()*10|0,
			_xNoiseStep = param.noiseStepX,
			_yNoiseStep = param.noiseStepY,
			_xStep		= param.stepX,
			_yStep		= param.stepY,
			_size 		= 40,
			_limitSize 	= param.limitSize,
			_PI 		= ((Math.PI*360)*100|0)/100,
			_PI_02 		= Math.PI / 180;

		//ステップ数毎にxとy軸にシェイプを描画
		for(var y=0; y<n_ih; y=(y+_yStep)|0){
			
			yNoise += _yNoiseStep;
			xNoise = xStartNoise;
			
			for(var x=0; x<n_iw; x=(x+_xStep)|0){
				xNoise += _xNoiseStep;
				_colorNoise += _xNoiseStep;

				//各描画のプロパティにノイズを加える
				var _alpha 	= Math.abs(noise.perlin2(xNoise,yNoise)*20|0)/5,
					_width 	= (200 * noise.perlin2(p.noiseX,p.noiseY))|0,
					_height	= (20 * noise.perlin2(p.noiseX,p.noiseY))|0,
					_x 		= x + ((Math.random()*100|0) * noise.perlin2(p.noiseX,p.noiseY))|0,
					_y 		= y + ((Math.random()*100|0) * noise.perlin2(p.noiseX,p.noiseY))|0;

				//見た目に影響の無い範囲で塗りを間引く
				if(_alpha < 0.03) continue;
				
				var _rad = (((180*noise.perlin2(xNoise,yNoise)|0) * _PI_02 )-180),
					_rndTranslateX = p.randomTranslateX,
					_rndTranslateY = p.randomTranslateY,
					_translateX = ((_x + _width * 0.5)  + (Math.random()*_rndTranslateX) - (_rndTranslateX>>1))|0,
					_translateY = ((_y + _height * 0.5)  + (Math.random()*_rndTranslateY) - (_rndTranslateY>>1))|0,
					_check	= Math.random()*4|0,
					_rnd = Math.random()*100|0,
					_rnd_half = _rnd>>1,
					_r = (param.r + (Math.random()*_rnd|0)- _rnd_half)|0,
					_g = (param.g + (Math.random()*_rnd|0)- _rnd_half)|0,
					_b = (param.b + (Math.random()*_rnd|0)- _rnd_half)|0;
				
				_r = (_r > 255)?"255":_r;
				_g = (_g > 255)?"255":_g;
				_b = (_b > 255)?"255":_b;
				
				if(_check === 0) {
					_r = 255;
					_g = 200;
					_b = 100;
				}
				
				
//				c.fillStyle = lib.getRndRGBA_02(param.r,param.g,param.b,_alpha);
				c.fillStyle = "rgba("+_r+","+_g+","+_b+","+_alpha+")";
				c.beginPath();
								
				if(p.rotateType === "01"){
					c.save();//状態保存
					c.translate(_translateX, _translateY);//原点は座標に図形の半分のサイズを足した位置に設定する
					c.rotate(_rad);//回転処理
					c.translate(-_translateX, -_translateY);// 描画位置は図形の半分のサイズを引いた値に設定する
					c.fillRect(_translateX, _translateY, _width, _height);//位置調整を考慮した座標に塗り
					c.restore();//状態復元
				}else if(p.rotateType === "02"){
					c.save();
					c.translate(-_translateX, -_translateY);
					c.rotate(_rad);
					c.translate(-_translateX, -_translateY);
					c.fillRect(-_translateX, -_translateY, _width, _height);
					c.restore();
				}else if(p.rotateType === "03"){
					c.save();
					c.translate(_translateX, _translateY);
					c.rotate(_rad);
					c.fillRect(-_translateX, -_translateY, _width, _height);
					c.translate(-_translateX, -_translateY);
					c.restore();
				}
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

