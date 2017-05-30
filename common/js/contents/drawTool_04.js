/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	xStart 	= Math.random() * 10,
	yNoise 	= Math.random() * 10,
	xNoise 	= Math.random() * 10,

	winWidth 	= window.innerWidth,
    winHeight 	= window.innerHeight,
	radiusBase 	= 100,
	radius 		= radiusBase,
	pointLen 	= 9,
	angle		= (Math.PI / 180) * (360 / pointLen),
	maxRandom 	= 10,
	minRandom 	= 5,
	pressCount	= 0,
	
	fillColorRange 	= 255,
	fillAlpha 	= 255,
	strokeAlpha = 80,
	strokeWidth = 0.75,

	fillColor 	= "rgba(255,255,255,0.9)",
	bgColor		= "#d0d0d0",
	
	isPressed	= false,
	isStroke	= true,
	isFill		= false,
	isPoint 	= true,
	isAutoMove	= false,
	canInteraction = true,
	
	points 		= [],
	pointerX 	= 0,
	pointerY 	= 0,
	autoMoveY	= 1,
	
	canvas,
	ctx;




/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeight);
	canvas =  document.getElementById('defaultCanvas0');
	ctx = canvas.getContext("2d");

    myCanvas.parent("canvas-container");
	
	//マウスイベント修正
	canvas.addEventListener('mousedown', function(e) {isPressed = true;
		pointerX = mouseX;
		pointerY = mouseY;
	},false);
	canvas.addEventListener('mouseup', function(e) {isPressed = false;},false);
	canvas.addEventListener('mouseleave', function(e) {isPressed = false},false);
	canvas.addEventListener('mousemove', function(e) {
		if(!isPressed) return false;
		pointerX = mouseX;
		pointerY = mouseY;
	},false);
	
	//スタイル指定
	noStroke();
	fill(bgColor);
	noFill();
	// rect(0,0,winWidth,winHeigt);
	
	strokeWeight(0.75);
	noFill();
	
	ctx.globalCompositeOperation = "xor";
	
	//円のポイントを作成
	radius 	= (radiusBase + noise(xNoise,yNoise) *10 - 4)|0;
	initPoints();
};


/**
 * ポイントを生成
 */
var initPoints = function(){
	var _interval = window.innerWidth / (pointLen-1);
	points = [];

	for (var i=0; i<=pointLen; i=(i+1)|0) {
		var _max= 50,
			_min= -25,
			//_y		= ((Math.random() * _max + _min)|0);
			_y		= (Math.random()*5|0)*20 + (i*10),
			_maxY 	= (winHeight /2 + Math.random()*(winHeight - _y) / 2 | 0) + (i);
		
		points[i] = {
			x	: _interval * i | 0,
			y	: _y,
			maxY: (_maxY < winHeight / 2) ?  winHeight >> 1: _maxY
		};
	};
};

/**
 * ランダム値を計算した半径の値を生成
 * @returns {number} 計算後の半径
 */
var updatePoints = function() {
	var _points = points;
	for (var i=0; i<pointLen; i=(i+1)|0) {
		var _p 	= _points[i],
			_randomX= ((Math.random()*10 - 5)|0)/5,
			_randomY= ((Math.random()*80 - 40)|0)/5,
			//_plusY	= _randomY * ( pointerY / winHeigt) * 1.2;
			_plusY	= (_randomY * ( pressCount / winHeight) * 2)|0;

		_p.x += 0;
		_p.y += _plusY;
		if(_p.y+pointerY > _p.maxY) _p.y = _p.maxY-pointerY;
	};
};

var movePointer = function() {
	pointerY += autoMoveY;

	if(pointerY < winHeight + 100) return false;
	isAutoMove = false;
	// pointerY = 0;
};

/**
 * 描画
 */
var draw = function() {
	
	//描画条件を判定
	if(!canInteraction) return false;
	if(isPressed === false && !isAutoMove) return false;
	if(isAutoMove) movePointer();

	//mousedown中に変化のポイントを追加していく
	var _randomCount = (Math.random() * 10 - 5)|0;
	pressCount += _randomCount;
	//pressCount += 1;
	if(pressCount>winHeight) pressCount = winHeight;

	// radius 	= (radiusBase + noise(xNoise,yNoise) *20)|0;
	// xNoise +=  ((Math.random()*10 - 5)|0)/100;
	// yNoise +=  ((Math.random()*10 - 5)|0)/100;
	
	var _points = points,
		_mouseY	= pointerY,
		_len 	= _points.length,
		_p		= _points[_len - 1],
		_sw 	= strokeWidth *  (pointerY / winHeight/2);
	
	//シェイプを作成
	strokeWeight(strokeWidth);
	//beginShape();
	//line(_p.x,_p.y+_mouseY);
	ctx.fillStyle = fillColor;

	for (var i=0; i<_len-1; i=(i+1)|0) {
		_p = _points[i];
		line(_p.x,_p.y+_mouseY,_points[i+1].x,_points[i+1].y+_mouseY);
		//if((_p.y+_mouseY)|0 % 2 === 0) ctx.fillRect(_p.x,_p.y+_mouseY,1,1);
		if(isPoint) ctx.fillRect(_p.x,_p.y+_mouseY,1,1);
	};
	//endShape();
	
	//描画
	var _red 	= (Math.random() * 60 - 25 + 120) | 0,
		_green 	= (Math.random() * 160 - 25 + 50) | 0,
		_blue 	= (Math.random() * 40 - 20 + 50) | 0;
	if(isStroke) stroke(_red,_green,_blue, strokeAlpha);
	if(isFill) fill(Math.random()*fillColorRange,fillAlpha);
	
	updatePoints();
};

/**
 * パラメータ維持で表示をリセット
 */
var clear = function(){};



/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
// DAT.add(window,"radiusBase",5,500).onChange(function(){
// 	initPoints();
// });
DAT.add(window,"pointLen",3,100).onChange(function(_val){
	pointLen 	= pointLen|0;
	angle		= (Math.PI / 180) * (360 / pointLen),
	initPoints();
});
DAT.add(window,"isStroke").onChange(function (_val) {
	if(!_val) noStroke();
})
DAT.add(window,"strokeWidth",0.1,5);
DAT.add(window,"strokeAlpha",0,255);
DAT.add(window,"isFill").onChange(function (_val) {
	if(!_val) noFill();
});
DAT.add(window,"isPoint");
DAT.add(window,"fillColorRange",5,255);
DAT.add(window,"fillAlpha",5,255);
DAT.add(window,"initPoints").onChange(function(){
	pressCount = 0;
	initPoints();
});
DAT.add(window,"clear").onChange(function(){
	initPoints();
});
DAT.addColor(window,"fillColor");
DAT.addColor(window,"bgColor").onChange(function(_val) {
	document.getElementById("wrapper").style.background = _val;
});
DAT.add(window,"isAutoMove");
DAT.add(window,"autoMoveY",.2,10);
DAT.add(window,"canInteraction");



