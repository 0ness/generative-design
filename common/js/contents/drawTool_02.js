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
	
	fillColorRange 	= 255,
	fillAlpha 	= 255,
	strokeAlpha = 80,
	strokeWidth = 0.75,
	
	bgColor		= "#eee",
	
	isPressed	= false,
	isStroke	= true,
	isFill		= false,
	
	points 		= [],
	
	canvas;




/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeihgt);
	canvas =  document.getElementById('defaultCanvas0');

    myCanvas.parent("canvas-container");
	
	//マウスイベント修正
	canvas.addEventListener('mousedown', function(e) {isPressed = true;},false);
	canvas.addEventListener('mouseup', function(e) {isPressed = false;},false);
	canvas.addEventListener('mouseleave', function(e) {isPressed = false},false);
	
	//スタイル指定
	noStroke();
	fill(bgColor);
	rect(0,0,winWidth,winHeihgt);
	
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
	points = [];
	for (var i=0; i<pointLen; i=(i+1)|0) {
		points[i] = {
			x: Math.cos(angle * i) * radius,
			y: Math.sin(angle * i) * radius
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
		var _p = _points[i];
		_p.x += ((Math.random()*20 - 10)|0)/10
		_p.y += ((Math.random()*20 - 10)|0)/10
	};
};

/**
 * 描画
 */
var draw = function() {
	
	radius 	= (radiusBase + noise(xNoise,yNoise) *10 - 4)|0;
	
	if(isPressed === false) return false;
	xNoise +=  ((Math.random()*10 - 5)|0)/100;
	yNoise +=  ((Math.random()*10 - 5)|0)/100;
	
	var _points = points,
		_mouseX	= mouseX,
		_mouseY	= mouseY,
		_len 	= _points.length,
		_p 		= _points[_len-1];
	
	//シェイプを作成
	strokeWeight(strokeWidth);
	beginShape();
	curveVertex(_p.x+_mouseX,_p.y+_mouseY);
	
	for (var i=0; i<_len; i=(i+1)|0) {
		_p = _points[i];
		curveVertex(_p.x+_mouseX,_p.y+_mouseY);
	};
	curveVertex(_points[0].x + _mouseX,_points[0].y + _mouseY);
	curveVertex(_points[1].x + _mouseX,_points[1].y + _mouseY);
	endShape();
	
	//描画
	if(isStroke) stroke(0, 80);
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
DAT.add(window,"radiusBase",5,500).onChange(function(){
	initPoints();
});
DAT.add(window,"pointLen",3,50).onChange(function(_val){
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
})
DAT.add(window,"fillColorRange",5,255);
DAT.add(window,"fillAlpha",5,255);
DAT.add(window,"clear").onChange(function(){
	initPoints();
});

