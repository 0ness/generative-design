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
	gui.addColor(param, 'fillColor');
	gui.add(param, 'bgAlpha',0,1);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);
	
	
	
	
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
	
	
	var cellSize	= 10,
		cellAry	= [],
		numX 		= Math.floor(n_iw / cellSize),
		numY 		= Math.floor(n_ih / cellSize);
	
	/* 描画 */	
	var draw = function(){
		var _c 	= ctx,
			_p 	= param;		
	};
	
	var restart = function(){
		cellAry = new Cell(numX,numY);
		
		for(var x = 0; x<numX; x++){
			for(var y = 0; y<numY; y++){
				
			}
			
		}
		
	};
	
	
	/* ループ関数 */
	var loop = function(){
		stats.begin();
		draw();
		stats.end();
//		if(param.flgAnim === true) window.requestAnimationFrame(loop);
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

