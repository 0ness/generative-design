(function () {
	"use strict";
	

	/*const 共通定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window,
		doc = document,
		canvas = doc.getElementById("myCanvas"),
		ctx = canvas.getContext("2d");
	
	
	
	
	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth,  //ウィンドウ幅
		n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ




	/*function 拡張関数
	--------------------------------------------------------------------*/
	win.requestAnimFrame = (function(){
		return	win.requestAnimFrame ||
				win.webkitRequestAnimFrame ||
				win.msRequestAnimFrame ||
				function(callback,element){
					win.setTimeout(callback,1000/60);
				};
	})();

	

	
	/*function モジュール関数
	--------------------------------------------------------------------*/
	var getRGB = function(_rnd,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			rgb = "rgb("+r+", "+g+", "+b+")";
		return rgb;
	};

	var getRGBA = function(_rnd,_alpha,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	};
	
	var abs = function(_num){
		var a = _num;
		a = a>0?a:-a;
		return a;
	};

	var getPointDistance = function(_p1,_p2){
		var p1 = _p1,
			p2 = _p2,
			a = 0,
			b = 0,
			d = 0;
		a = p1.x - p2.x;
		b = p1.y - p2.y;
		d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
		return d;
	};



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
		//色
		fillColor:getRGB(200),
		strokeColor:getRGB(100,100),
		bgColor:getRGB(20),
		//分岐
		flgStroke:true,
		flgFill:false,
		flgBG:false
	};
	var param = new ParamMaster();

	
	/* @object
	 * dat.GUI用オブジェクト
	*/
	var gui = new dat.GUI(),
		paramLineWidth = gui.add(param, 'lineWidth',0.1,50);

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.add(param, 'flgStroke',false);
	gui.add(param, 'flgFill',false);
	gui.addColor(param, 'fillColor');
	gui.addColor(param, 'strokeColor');
	gui.addColor(param, 'bgColor');
	gui.add(param, 'flgBG',false);
	gui.add(param, 'bgAlpha',0,1);

	//数値の変更処理
	paramLineWidth.onChange(function(val){
		param.lineWidth = (val < 1)? val:val>>0;
	});
	
	
	
	
	/*function 初期化
	--------------------------------------------------------------------*/
	var n_centX = n_iw >> 1,
		n_centY = n_ih >> 1,
		n_diam = 10,
		n_PI = (Math.PI/180)*360,
		n_alpha = 0;
	
	var setup = function(){
		n_centX = n_iw >> 1;
		n_centY = n_ih >> 1;
		n_diam = 10;
		n_alpha = 0;
		
		draw();
		return false;
	};

	

	
	/*function 描画
	--------------------------------------------------------------------*/
	var draw = function(){
		stats.begin();
		
		canvas.style.background = param.bgColor;
		ctx.strokeStyle = param.strokeColor;
//		ctx.clearRect(0,0,n_iw,n_ih);
		ctx.globalAlpha = 0;
		
		var len = 40;
		for(var i=0; i<len; i++){
			n_alpha += 1.4/len;
			//canvas操作
			ctx.globalAlpha = n_alpha;
			ctx.beginPath();
			ctx.arc(n_centX,n_centY,n_diam,0,n_PI,false);
			ctx.closePath();
			ctx.stroke();
			n_diam += 10;
		}	
			
		win.requestAnimFrame(draw);
		stats.end();
		return false;
	};

	


	/*object リサイズ用オブジェクト
	--------------------------------------------------------------------*/
	var Resizer = function(){
		this.winCheck();
		this.canvasResize();
	};
	Resizer.prototype = {
		winCheck:function(){
			n_iw = win.innerWidth || doc.body.clientWidth;
			n_ih = win.innerHeight || doc.body.clientHeight;
			return false;
		},
		canvasResize:function(){
			canvas.width = n_iw;
			canvas.height = n_ih;
			return false;
		}
	};
	var resizer = new Resizer();


	/*event リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		resizer.winCheck();
		resizer.canvasResize();
		setup();
		return false;
	};
	win.addEventListener("resize",resizeFunc);

	
	
	
	/*開始
	--------------------------------------------------------------------*/
	resizeFunc();
	setup();
	
	
	

	return false;
}());

