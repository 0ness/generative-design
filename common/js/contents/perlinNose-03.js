(function () {
	"use strict";
	

	/*const 共通定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window,
		doc = document,
		canvas = doc.getElementById("myCanvas"),
		ctx = canvas.getContext("2d"),
		perlin = new SimplexNoise(),
		lib = new Planet();

	
	
	
	/*var 共通変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth,  //ウィンドウ幅
		n_ih = win.innerHeight || doc.body.clientHeight,//ウィンドウ高さ
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
		linePointLength:100,
		lineWidth:1,
		noiseLevel:10,
		noiseRange:0.005,
		bgAlpha:1,
		composition:"source-over",
		subX:1,
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(10,10),
		//分岐
		flgStroke:false,
		flgFill:true,
		flgBG:false,
		flgAnim:false
	};
	var param = new ParamMaster();

	
	/* @object
	 * dat.GUI用オブジェクト
	*/
	var gui = new dat.GUI(),
		paramLineWidth = gui.add(param, 'lineWidth',1,50),
		paramNoiseLevel = gui.add(param, 'noiseLevel',1,150),
		paramNoiseRange = gui.add(param, 'noiseRange',0,0.2),
		paramSubX = gui.add(param,"subX",0,10);

	
	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
	gui.addColor(param, 'bgColor');
	gui.add(param, 'bgAlpha',0,1);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
	paramLineWidth.onChange(function(val){
		param.lineWidth = val>>0;
		setup();
	});
	paramNoiseLevel.onChange(function(val){
		param.noiseLevel = val>>0;
		setup();
	});
	paramNoiseRange.onChange(function(val){
		param.noiseRange = Math.round(val * 1000) / 1000;
		setup();
	});
	paramSubX.onChange(function(val){
		param.subX = val>>0;
		setup();
	})
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
		loop();
	});

	
	/* @object */
	var Line = function(_x){
		this.x = _x;
	}
	Line.prototype = {
		x:0,
		y:0,
		w:0,
		h:n_ih,
		color:0,
		draw:function(){
			var c = ctx,
				t = this;
			c.fillStyle = t.color;
			c.fillRect(t.x,0,param.lineWidth,t.h);
			t.x -= param.subX;
			
			if(t.x >= 0) return false;
			var sx = - t.x - param.subX;
			t.x = n_iw + sx;
			t.color = noise(n_noiseSeed);
			return false;
		}
	};
	
	/* @object */
	var LineContainer = function(){};
	LineContainer.prototype = {
		ary:[],
		init:function(){
			this.ary = [];
			var plw = param.lineWidth;
			var i = 0;
			var len = (n_iw/plw >> 0);
			for (i = 0; i < len; i++) {
				var lw = (i+1)*plw;
//				console.log(lw);
				var l = new Line(lw);
				l.color = noise(n_noiseSeed);
				this.ary[i] = l;
			}
		},
		draw:function(){
			var i;
			var len = this.ary.length;
			for (i = 0; i < len; i++) {
				this.ary[i].draw();
			}
		}
	};
	var lineContainer = new LineContainer();
	
	
	
	
	/*初期化
	--------------------------------------------------------------------*/
	var n_lineLen,
		n_lineWidth,
		n_centY = n_ih>>1,
		n_PI = (Math.PI/180)*360,
		request;
	
	var setup = function(){
		ctx.strokeStyle = param.strokeColor;
		n_noiseSeed = 0;
		n_noiseRange = param.noiseRange;
		n_lineLen = param.linePointLength;
		n_lineWidth = n_iw/n_lineLen;
		lineContainer.init();
		draw();
		return false;
	};

	//ノイズ関数
	var noise = function(_seed){
		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0,
			rgb,
			plus;
		num = lib.abs(num) * 10;
		num = (num > 255) ?255:num;
		num = (num <= 0) ? 1 : num;
		
		plus = 255 - num;
		rgb = lib.getRndRGB(num,100);
		n_noiseSeed += n_noiseRange;
		return rgb;
	}
	
	
	
	
	/*描画
	--------------------------------------------------------------------*/
	var draw = function(){
		var c = ctx,
			p = param;
		
		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.globalCompositeOperation = "source-over";
		c.fillRect(0,0,n_iw,n_ih);
		
		c.globalAlpha = 1;
		c.globalCompositeOperation = p.composition;
		lineContainer.draw();
	};

	
	

	/*ループ
	--------------------------------------------------------------------*/
	var loop = function(){
		stats.begin();
		draw();
		if(param.flgAnim === true) win.requestAnimationFrame(loop);
		stats.end()
	}
	
	
	

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
	var reset = function(){
		resizer.winCheck();
		resizer.canvasResize();
		setup();
		return false;
	};
	win.addEventListener("resize",reset);

	
	
	/*開始
	--------------------------------------------------------------------*/
	reset();


	return false;
}());

