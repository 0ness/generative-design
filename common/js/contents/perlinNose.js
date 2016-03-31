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
		n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

	


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
		noiseLevel:50,
		noiseRange:0.01,
		bgAlpha:1,
		composition:"source-over",
		//色
		fillColor:lib.getRndRGB(200),
		strokeColor:lib.getRndRGB(200),
		bgColor:lib.getRndRGB(10,10),
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
		paramPointLength = gui.add(param,'linePointLength',10,1000),
		paramLineWidth = gui.add(param, 'lineWidth',0.1,200),
		paramNoiseLevel = gui.add(param, 'noiseLevel',1,300),
		paramNoiseRange = gui.add(param, 'noiseRange',0,0.1);

	gui.add(param,'composition',["source-over","xor","lighter","multiply","difference"]);
//	gui.add(param, 'flgStroke',false);
//	gui.add(param, 'flgFill',false);

//	gui.addColor(param, 'fillColor');
	gui.addColor(param, 'strokeColor');
	gui.addColor(param, 'bgColor');
//	gui.add(param, 'flgBG',false);
	gui.add(param, 'bgAlpha',0,1);
	var paramFlgAnim = gui.add(param, 'flgAnim',false);

	//数値の変更処理
	paramPointLength.onChange(function(val){
		param.linePointLength = val>>0;
		setup();
	});
	paramLineWidth.onChange(function(val){
		param.lineWidth = (val < 1)? val:val>>0;
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
	paramFlgAnim.onChange(function(val){
		param.flgAnim = val;
		setup();
	});

	
	
	
	/*初期化
	--------------------------------------------------------------------*/
	var n_lineLen,
		n_lineWidth,
		n_centY = n_ih>>1,
		n_posNoiseY,
		n_noiseRange;
	
	var setup = function(){
		ctx.strokeStyle = param.strokeColor;
		n_noiseRange = param.noiseRange;
		n_posNoiseY = Math.random()*10;
		n_lineLen = param.linePointLength;
		n_lineWidth = n_iw/n_lineLen;
		draw();
		return false;
	};

	var noise = function(_seed){
		var num = ( perlin.noise(_seed,0) * param.noiseLevel ) >> 0;
		return num;
	}
	

	
	/*描画
	--------------------------------------------------------------------*/
	var draw = function(){
		stats.begin();
		
		var c = ctx,
			p = param,
			randY = n_centY + noise(n_posNoiseY);

		
		c.fillStyle = p.bgColor;
		c.globalAlpha = p.bgAlpha;
		c.globalCompositeOperation = "source-over";
		c.fillRect(0,0,n_iw,n_ih);
		
		
		c.globalAlpha = 1;
		c.lineWidth = p.lineWidth;
		c.strokeStyle = p.strokeColor;
		c.globalCompositeOperation = p.composition;
		c.beginPath();
		c.moveTo(0,randY);
		
		for(var i=0; i<n_lineLen; i++){
			n_posNoiseY += n_noiseRange;
			randY = n_centY + noise(n_posNoiseY);
			c.lineTo(i*n_lineWidth,randY);
		}
		randY = n_centY + noise(n_posNoiseY);
		c.lineTo(n_iw,randY);
		c.stroke();
		
		if(param.flgAnim === true) win.requestAnimationFrame(draw);
		stats.end()
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

