/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	winWidth 	= window.innerWidth,
    winHeight 	= window.innerHeight,
	
	maxCount 	= 5000,
	currentCount= 0,
	
	pixels 		= [],
	points 		= [],
	closestIndex= [],
	
	minRadius 	= 2,
	maxRadius 	= 1,
	gridUnit 	= 5,
	
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
	
	createImageBitmap();
	
	//スタイル指定
	noStroke();
	noFill();
	background(bgColor);
};

var reset = function(){
	currentCount= 0;
	points		= [];
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
		_newR = maxRadius,
		_newG = {
			x:(Math.random()* 10 - 5)| 0,
			y:(Math.random()* 10 - 5)| 0
		};
	
	// create a random position according to mouse positon
	if(isPressed == true) {
		var _rectHalf = mouseRect >> 1;
		_newX = convertIntMultiple(random(mouseX - _rectHalf , mouseX + _rectHalf));
		_newY = convertIntMultiple(random(mouseY - _rectHalf , mouseY + _rectHalf));
		_newR = maxRadius;
	};
	
	var _interSection = false;
	
	// find out, if new circle intersects with one of the others
	for (var i=0; i<currentCount; i=(i+1)|0) {
		var _p 		 = points[i],
			_distance= convertIntMultiple( dist(_newX,_newY,_p.x,_p.y));
		if(_distance < (_newR + _p.r)){
			_interSection = true;
			break;
		}
	};
	

	// no intersection    add a new circle
	if(_interSection === false) {
		// get closest neighbour and closest possible radius
		var _newRadius 	= winWidth;
		for (var i=0; i<currentCount; i=(i+1)|0) {
			var _p 	 		= points[i],
				_distance 	= convertIntMultiple(dist(_newX,_newY,_p.x,_p.y));
			if(_newRadius > _distance - _p.r){
				_newRadius = _distance - _p.r;
				closestIndex[currentCount] = i;
			}
		};
		
		if(_newRadius > maxRadius) _newRadius = maxRadius;

			var point = {
				x:_newX,
				y:_newY,
				r:_newRadius,
				gap:_newG,
				fillColor:fillColor,
				strokeColor:strokeColor_02
			};
			points[currentCount] = point;
			currentCount++;
	};
	
	//draw them
	drawLoop();
	
	//visualize the random range of the new positions
	if(isPressed == true) drawPressing();
	
	//if(currentCount >= maxCount) noLoop();
};


var drawLoop = function(){
	var _points = points;

	for (var i=0; i< currentCount; i=(i+1)|0) {
		
		var _p 		= _points[i],
			_gap 	= _p.gap,
			_x 		= _p.x,
			_y 		= _p.y,
			_radius = _p.r*2,
			_fColor  = _p.fillColor,
			_sColor  = _p.strokeColor;
				
		if(isStroke){
			stroke(strokeColor)
			strokeWeight(strokeWidth);
		}else noStroke();
						
		if(isFill) fill(_fColor);
		else noFill();
		
		ctx.fillRect(_x,_y,1,1);
		
		ellipse(_x,_y,_radius,_radius);
		
		if(isStroke_02){
			var _n = closestIndex[i];
			if(_n == null) _n = i;
			stroke(_sColor)
			strokeWeight(strokeWidth);
			line(_x,_y,_points[_n].x,_points[_n].y);
		}else {
			noStroke();
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
	var _unit = (gridUnit < maxRadius )? maxRadius : gridUnit,
		_result = (_src / _unit | 0 ) * _unit;  // 結果 => 100
	return _result;
};



/**
 * canvasの描画済みのエリアかどうか判定する
 * @param   {Array}   _pixel 色配列
 *　@returns {boolean} 描画済みかどうか正否値
 */
var onDrawArea = function(_x,_y) {
	var _pixel = ctx.getImageData(_x,_y,1,1).data;
	//var _pixel = pixels[_x*4 + _y*4 - 1];
	//console.log(_pixel);
	return _pixel[3] < 10;
};

/**
 * 画像でビットマップの下地を作成
 */
var createImageBitmap = function(){
	var _c 		= ctx,
		_img 	= new Image();

	_img.src = "images/bird_04.png";
	_img.onload = function(){
		var _x = (winWidth - _img.width) >> 2,
			_y = ((winHeight - _img.height) >> 1) - 70;
		_c.drawImage(_img,_x,_y);
		var imageData = _c.getImageData(0, 0, winWidth, winHeight);
		pixels = imageData.data;
		_c.clearRect(0, 0, winWidth, winHeight);
	};
};

/**
 * 画像の塗の上にオブジェクトが居るか判断
 * @param   {number} x x座標
 * @param   {number} y y座標
 * @returns {boolean} 
 */
var onBlackColor = function(x, y) {
	var _base 	= ((y|0) * winWidth + (x|0)) * 4,
		_p 		= pixels,
		_color  = _p[_base + 0] + _p[_base + 1] + _p[_base + 2] + _p[_base + 3],
		_flg 	= (_color == 255)? true : false;
	return _flg;
};


/**
 * パラメータ維持で表示をリセット
 */
var clear = function(){};



/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window,"maxRadius",1,100);
DAT.add(window,"mouseRect",10,800);
DAT.add(window,"gridUnit",2,40);
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


