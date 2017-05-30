/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	winWidth 	= window.innerWidth,
    winHeight 	= window.innerHeight,
	
	maxCount 	= 5000,
	currentCount= 0,
	
	xPoints 	= [],
	yPoints		= [],
	rPoints		= [],
	gPoints		= [],
	closestIndex= [],
	
	minRadius 	= 5,
	maxRadius 	= (Math.random()*200|0),
	
	//for mouse and arrow up/down interaction
	mouseRect 	= 50,
	
	freeze 		= false,
	isPressed 	= false,
	isAnimating = false,
	isGap 		= true,
	
	isStroke 	= true,
	isStroke_02 = true,
	isFill 		= true,
	
	LIB 		= new Planet(),
	
	//fillColor 		= LIB.getRndRGBA_02(50,200,200,1,40),
	fillColor 		= LIB.getRndRGBA_02(0,0,0,1,40),
	strokeColor 	= LIB.getRndHEX(100),
	strokeColor 	= "#ffffff",
	strokeColor_02 	= LIB.getRndHEX(100),
	strokeWidth 	= .5,
	bgColor 		= "#ddd",
	
	canvas,
	ctx;




/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeight);
    myCanvas.parent("canvas-container");
	
	canvas 	=  document.getElementById('defaultCanvas0');
	ctx 	= canvas.getContext("2d");
	
	//マウスイベント修正
	canvas.addEventListener('mousedown', function(e) {isPressed = true;},false);
	canvas.addEventListener('mouseup', function(e) {
		isPressed = false;
		background(bgColor);
		drawLoop();
	},false);
	canvas.addEventListener('mouseleave', function(e) {
		isPressed = false;
		background(bgColor);
		drawLoop();
	},false);
	canvas.addEventListener('mousemove', function(e) {},false);
	
	//スタイル指定
	noStroke();
	noFill();
	background(bgColor);

	//for (var i=0; i<5; i=(i+1)|0) {
	//	var _x = Math.random() * winWidth |0,
	//		_y = Math.random() * winHeight |0,
	//		_r = Math.random() * 500 |0;
	//	ctx.beginPath();
	//	ctx.ellipse(_x, _y, _r, _r, 0, 0, 2 * Math.PI);
	//	//ctx.arc(_x,_y,_r, 0, Math.PI * 2, false);
	//};
	//ctx.fill();
	//ctx.clip();

};

var reset = function(){
	currentCount= 0;
	xPoints 	= [];
	yPoints		= [];
	rPoints		= [];
	gPoints		= [];
	closestIndex= [];
	background(bgColor);
};


/**
 * 描画
 */
var draw = function() {
	if(!isAnimating && !isPressed) return false;
	
	ctx.globalAlpha = 1;
	background(bgColor);
	
	// create a random positon
	var _newX = convertIntMultiple(random(maxRadius-50,winWidth - maxRadius + 100)),
		_newY = convertIntMultiple(random(maxRadius-50,winHeight - maxRadius + 100)),
		_newR = minRadius,
		_newG = {
			x:(Math.random()* 10 - 5)| 0,
			y:(Math.random()* 10 - 5)| 0
		};
	
	// create a random position according to mouse positon
	if(isPressed == true) {
		var _rectHalf = mouseRect >> 1;
		_newX = convertIntMultiple(random(mouseX - _rectHalf , mouseX + _rectHalf));
		_newY = convertIntMultiple(random(mouseY - _rectHalf , mouseY + _rectHalf));
		_newR = 1;
	};
	
	var _interSection = false;
	
	// find out, if new circle intersects with one of the others
	for (var i=0; i<currentCount; i=(i+1)|0) {
		var _d = convertIntMultiple( dist(_newX,_newY,xPoints[i],yPoints[i]));
		if(_d < (_newR + rPoints[i])){
			_interSection = true;
			break;
		}
	};
	
	// no intersection    add a new circle
	if(_interSection === false) {
		// get closest neighbour and closest possible radius
		var _newRadius 	= winWidth;
		for (var i=0; i<currentCount; i=(i+1)|0) {
			var _d = convertIntMultiple(dist(_newX,_newY,xPoints[i],yPoints[i]));
			if(_newRadius > _d - rPoints[i]){
				_newRadius = _d - rPoints[i];
				closestIndex[currentCount] = i;
			}
		};
		
		if(_newRadius > maxRadius) _newRadius = maxRadius;
		
		xPoints[currentCount] = _newX;
		yPoints[currentCount] = _newY;
		rPoints[currentCount] = _newRadius;
		gPoints[currentCount] = _newG;
		currentCount++;
	};
	
	//draw them
	drawLoop();
	
	//visualize the random range of the new positions
	if(isPressed == true) drawPressing();
	
	//if(currentCount >= maxCount) noLoop();
};


var drawLoop = function(){
	var _x = xPoints,
		_y = yPoints,
		_r = rPoints,
		_g = gPoints,
		_count = currentCount;

	if(isFill) fill(fillColor);
	else noFill();
	for (var i=0; i< _count; i=(i+1)|0) {
		
		if(isStroke){
			stroke(strokeColor)
			strokeWeight(strokeWidth);
		}else noStroke();
		
		var _alpha 	= ((_r[i] / maxRadius) * 100 | 0) / 100,
			_gap 	= _g[i],
			_xPoint = _x[i]/* + _gap.x*/,
			_yPoint = _y[i]/* + _gap.y*/;
		
		
		//ctx.globalAlpha = _alpha;
		
		ellipse(_xPoint,_yPoint,_r[i]*2,_r[i]*2);
		
		if(isStroke){
			stroke(strokeColor_02)
			strokeWeight(strokeWidth);
		}else noStroke();
		
		if(isStroke_02){
			var _n = closestIndex[i];
			line(_xPoint,_yPoint,_x[_n],_y[_n]);
		}
	};
};

var drawPressing = function(){
	var _rectHalf = mouseRect >> 1;
	stroke("#ffba00");
	strokeWeight(1);
	noFill();
	rect(mouseX - _rectHalf , mouseY - _rectHalf, mouseRect,mouseRect);
};




var keyPressed = function(){
	if(keyCode == UP_ARROW) mouseRect += 4;
	if(keyCode == DOWN_ARROW) mouseRect -= 4;
};

var convertIntMultiple = function(_src){
	var _unit = 2,
		_result = (_src / _unit | 0 ) * _unit;  // 結果 => 100
	return _result;
};


/**
 * パラメータ維持で表示をリセット
 */
var clear = function(){};



/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window,"maxRadius",1,300);
DAT.add(window,"mouseRect",10,800);
//DAT.add(window,"strokeWidth",0.1,5);
//DAT.add(window,"fillAlpha",5,255);
DAT.add(window,"isFill").onChange(function(){
	drawLoop();
});
DAT.addColor(window,"fillColor");
DAT.add(window,"isStroke").onChange(function(){
	drawLoop();
});
DAT.addColor(window,"strokeColor");
DAT.add(window,"isStroke_02").onChange(function(){
	drawLoop();
});
DAT.addColor(window,"strokeColor_02");
DAT.add(window,"strokeWidth",.1,5);
DAT.addColor(window,"bgColor");
DAT.add(window,"isAnimating");
DAT.add(window,"reset").onChange(function(){
	background(bgColor);
	
});


