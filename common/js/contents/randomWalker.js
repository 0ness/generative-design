(function () {
	"use strict";
	
//	var test = new SimpleNoise();

	/*const 共通定数
	--------------------------------------------------------------------*/
	var canvas = document.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
//		perlin = new SimpleNoise(),
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
		objLength:50,
		objRange:1,
		objSpd:1,
		objSize:1,
		objVecX:"random",
		objVecY:"random",
		lineWidth:1,
		bgAlpha:0,
		composition:"source-over",
		noiseRange:0.1,
		noiseLevel:50,
		//色
		fillColor:lib.getRndRGB(255),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(20,10),
		//分岐
		flgStroke:true,
		flgFill:false,
		flgBG:false,
		flgColor:false,
		flgAnim:true
	};
	var param = new ParamMaster();

	
	/* @object dat.GUI用オブジェクト */
	var gui = new dat.GUI(),
		paramObjLength = gui.add(param, 'objLength',1,300),
		paramObjSpd = gui.add(param, 'objSpd',0,20),
		paramObjSize = gui.add(param, 'objSize',0,10),
		paramObjRange = gui.add(param, 'objRange',0,20),
		paramObjVecX = gui.add(param, 'objVecX',["random","left","right"]),
		paramObjVecY = gui.add(param, 'objVecY',["random","top","bottom"]);
//		paramLineWidth = gui.add(param, 'lineWidth',0.1,50),
//		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
//		paramNoiseRange = gui.add(param, 'noiseRange',0,0.1);

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
//	gui.add(param, 'flgStroke',false);
//	gui.add(param, 'flgFill',false);
//	gui.addColor(param, 'strokeColor');
	gui.add(param, 'flgColor',false);
//	gui.add(param, 'flgBG',false);
	gui.addColor(param, 'fillColor');
	gui.addColor(param, 'bgColor');
	gui.add(param, 'bgAlpha',0,0.01);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
	paramObjLength.onChange(function(val){
		param.objLength = val>>0;
		resetup();
	});
	paramObjSpd.onChange(function(val){
		param.objSpd = val>>0;
	});
	paramObjSize.onChange(function(val){
		param.objSize = val>>0;
	});
	paramObjRange.onChange(function(val){
		param.objRange = val>>0;
		resetup();
	});
//	paramObjVecX.onChange(function(val){
//		param.objVecX= val;
//	});
//	paramObjVecY.onChange(function(val){
//		param.objVecY = val;
//	});
//	paramLineWidth.onChange(function(val){
//		param.lineWidth = (val < 1)? val:val>>0;
//	});
//	paramNoiseLevel.onChange(function(val){
//		param.noiseLevel = val>>0;
//		setup();
//	});
//	paramNoiseRange.onChange(function(val){
//		param.noiseRange = Math.round(val * 1000) / 1000;
//		setup();
//	});
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
		loop();
	});
	
	
	/* @object Walker */
	var Walker = function(){
		this.x = Math.random()*n_iw >> 0;
		this.y = Math.random()*n_ih >> 0;
		this.color = lib.getRndRGB_02(225,225,225,30);
	};
	Walker.prototype = {
		x:0,
		y:0,
		color:null,
		step:function(){
			var c = ctx,
				p = param,
				t = this,
				size = p.objSize;
			
			if(p.flgColor === true) c.fillStyle = t.color;
			else c.fillStyle = p.fillColor;
			c.fillRect(t.x,t.y,size,size);

			//8方向移動
			var stepX,
				stepY,
				vecX = p.objVecX,
				vecY = p.objVecY;
			
			if(vecX === "random") stepX = (Math.random()*3>>0)-1;
			else if(vecX === "right") stepX = (Math.random()*2>>0);
			else stepX = -(Math.random()*2>>0);

			if(vecY === "random") stepY = (Math.random()*3>>0)-1;
			else if(vecY === "bottom") stepY = (Math.random()*2>>0);
			else stepY = -(Math.random()*2>>0);

			t.x += stepX*p.objRange;
			t.y += stepY*p.objRange;
			
			//画面外に出た際の処理
			if(t.x < 0) t.x = n_iw-1;
			else if(t.x >= n_iw) t.x = 0;
			if(t.y < 0) t.y = n_ih-1;
			else if(t.y >= n_ih) t.y = 0;
			
			c.fillStyle = "rgb(255,255,255)";
			c.fillRect(t.x,t.y,size,size);
		}
	};
	
	
	/* @object WalkerContainer */
	var WalkerContainer = function(){};
	WalkerContainer.prototype = {
		ary:[],
		init:function(){
			this.ary = [];
			var i,
				len = param.objLength;
			for (i = 0; i < len; i++) {
				this.ary[i] = new Walker();
			}
		},
		draw:function(){
			var i,
				l,
				len = this.ary.length,
				spdLevel = param.objSpd,
				ary = this.ary;
			for (i = 0; i < spdLevel; i++) {
				for (l = 0; l < len; l++) ary[l].step();
			}
		}
	}
	var wCont = new WalkerContainer();
	

	
	/*flow CANVAS操作
	--------------------------------------------------------------------*/

	/* 初期化 */
	var setup = function(){
		wCont.init();
		draw();
	};
	

	/* ノイズ関数 */
	var noise = function(_seed){
		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0;
		return num;
	};

	
	/* 描画 */
	var draw = function(){
		var c = ctx,
			p = param;

		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.globalCompositeOperation = "source-over";
		c.fillRect(0,0,n_iw,n_ih);

		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		wCont.draw();
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
	
	
	/* リセット */
	var resetup = function(){
		resize();
		setup();
	};



	/*flow 開始
	--------------------------------------------------------------------*/
	window.addEventListener("resize",resetup);
	resetup();
	loop();
	
	return false;
}());

