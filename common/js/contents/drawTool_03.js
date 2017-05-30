/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	xStart 	= Math.random() * 10,
	yNoise 	= Math.random() * 10,
	xNoise 	= Math.random() * 10,

	winWidth 	= window.innerWidth,
    winHeihgt 	= window.innerHeight,
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

	fillColor 	= "rgba(255,255,255,0.5)",
	bgColor		= "#eee",
	
	isPressed	= false,
	isStroke	= true,
	isFill		= false,
	isPoint 	= true,
	isAutoMove	= false,
	
	points 		= [],
	pointerX 	= 0,
	pointerY 	= 0,
	autoMoveY	= 1,
	
	canvas,
	ctx;




/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeihgt);
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
	// rect(0,0,winWidth,winHeihgt);
	
	strokeWeight(0.75);
	noFill();
	
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
		var _y= ((Math.random() * 200 - 100)|0) / 10;
		points[i] = {
			//x: Math.cos(angle * i) * radius,
			//y: Math.sin(angle * i) * radius
			x: _interval * i | 0,
			//y:_y
			y:_y
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
			_randomX= ((Math.random()*10 - 5)|0)/10,
			_randomY= ((Math.random()*80 - 40)|0)/10,
			_plusY	= _randomY * ( pointerY / winHeihgt) * 1.2;
			//_plusY	= _randomY * ( pressCount / winHeihgt) * 3;

		_p.x += _randomX;
		_p.y += _plusY;
	};
};

var movePointer = function() {
	pointerY += autoMoveY;

	if(pointerY < winHeihgt + 100) return false;
	isAutoMove = false;
	// pointerY = 0;
};

/**
 * 描画
 */
var draw = function() {
	
	//描画条件を判定
	if(isPressed === false && !isAutoMove) return false;
	if(isAutoMove) movePointer();

	//mousedown中に変化のポイントを追加していく
	var _randomCount = (Math.random() * 10 - 5)|0;
	pressCount += _randomCount;
	//pressCount += 1;
	if(pressCount>winHeihgt) pressCount = winHeihgt;

	// radius 	= (radiusBase + noise(xNoise,yNoise) *20)|0;
	// xNoise +=  ((Math.random()*10 - 5)|0)/100;
	// yNoise +=  ((Math.random()*10 - 5)|0)/100;
	
	var _points = points,
		_mouseY	= pointerY,
		_len 	= _points.length,
		_p		= _points[_len - 1],
		_sw 	= strokeWidth *  (pointerY / winHeihgt/2);
	
	//シェイプを作成
	strokeWeight(strokeWidth);
	beginShape();
	curveVertex(_p.x,_p.y+_mouseY);
	ctx.fillStyle = fillColor;

	for (var i=0; i<_len; i=(i+1)|0) {
		_p = _points[i];
		curveVertex(_p.x,_p.y+_mouseY);
		if(isPoint) ctx.fillRect(_p.x,_p.y+_mouseY,1,1);
	};
	endShape();
	
	//描画
	var _red 	= (Math.random() * 50 - 25 + 0) | 0,
		_green 	= (Math.random() * 50 - 25 + 50) | 0,
		_blue 	= (Math.random() * 40 - 20 + 130) | 0;
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
DAT.add(window,"autoMoveY",.2,10).onChange(function(_val){
	// autoMoveY = _val|0;
});
	


