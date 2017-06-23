/*
DOM オブジェクトを Canvas に描画する - HTML | MDN - https://developer.mozilla.org/ja/docs/Web/HTML/Canvas/Drawing_DOM_objects_into_a_canvas
styleタグのCSSや外部CSSの値を取得 - 三等兵 http://d.hatena.ne.jp/sandai/20100616/p1
 */


/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	winWidth 	= window.innerWidth,
    winHeight 	= window.innerHeight,
	
	lifeLetter  = 180,
	maxLife		= 0,
	maxCount 	= 5000,
	lifeCount 	= maxLife,
	lifeSpd 	= 1,
	loopCount 	= 0,
	currentCount= 0,
	drawHeight  = 0,
	
	pixels 		= [],
	drawPixels  = [],
	points 		= [],
	closestIndex= [],
	
	minRadius 	= 2,
	maxRadius 	= 1,
	gridUnit 	= 4,
	
	//for mouse and arrow up/down interaction
	mouseRectSize 	= 50,
	
	freeze 		= false,
	isPressed 	= false,
	isAnimating = false,
	isGap 		= true,	
	isStroke 	= false,
	isStroke_02 = true,
	isFill 		= true,
	onGrid 		= true,

	LIB 			= new Planet(),
	OFFSET_CANVAS 	= new OffsetCanvasCss(),
	
	//fillColor 	= LIB.getRndRGBA_02(50,200,200,1,40),
	fillColor 		= LIB.getRndRGBA_02(0,0,0,1,40),
	strokeColor 	= LIB.getRndHEX(100),
	strokeColor 	= "#ffffff",
	strokeColor_02 	= LIB.getRndHEX(100),
	strokeWidth 	= .5,
	bgColor 		= "#ddd",
	
	fontStyle		= {
		fontSize:60,
		lineHeight:1,
		letterSpacing:0,
		marginX:0,
		marginY:10
	},
	
	canvas,
	ctx;




/*function
--------------------------------------------------------------------*/
var setup = function() {
	var myCanvas = createCanvas(winWidth, document.getElementById("canvas-container").offsetHeight);
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

	// canvas.addEventListener('mousemove', function(e) {},false);
	//createImageBitmap();
		background(bgColor);
};

var reset = function(){
	currentCount= 0;
	points		= [];
	closestIndex= [];
	loopCount 	= 0;
	background(bgColor);
};

var radomNum = function(){
	var _max = 250,
		_min = 125,
		_num = (Math.random()*_max - _min) + (Math.random()*_max - _min) + (Math.random()*_max - _min) + (Math.random()*_max - _min);
	return _num / 4 | 0;
};


/**
 * 描画
 */
var draw = function() {
	if(!isAnimating && !isPressed) return false;
	for (var i=0; i<20; i=(i+1)|0) baseDraw();
};


var baseDraw = function(){
	// create a random positon
	var _rndPoint 	= Math.random()*drawPixels.length|0,
		_point 		= drawPixels[_rndPoint],
		_rndX 		= radomNum(),
		_rndY 		= radomNum(),
		_newX 		= convertIntMultiple(_point.x),
		_newY 		= convertIntMultiple(_point.y),
		_newR 		= maxRadius,
		_newG 		= {
			x:(Math.random()* 10 - 5)| 0,
			y:(Math.random()* 10 - 5)| 0
		};

	// create a random position according to mouse positon
	if(isPressed == true) {
		var _rectHalf = mouseRectSize >> 1;
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

		//draw them
		drawPoint(point);
		
		//文字描画を止める
	};
	
	lifeCount -= lifeSpd|0;
	if(lifeCount <= 0){
		loopCount++;
		lifeCount = maxLife;
		changeCanvasText();
	}

	//visualize the random range of the new positions
	if(isPressed == true) drawPressing();
}


var drawPoint = function(_p){
	var _gap 	= _p.gap,
		_x 		= _p.x,
		_y 		= _p.y,
		_radius = _p.r*2,
		_fColor  = _p.fillColor,
		_sColor  = _p.strokeColor;

	if(isStroke){
		strokeWeight(strokeWidth);
		stroke(strokeColor)
	}else noStroke();

	if(isFill) fill(_fColor);
	else noFill();

	// ctx.fillRect(_x,_y,1,1);

	if(isStroke_02){
		if(points.length === 1) return;
		var _n = closestIndex[currentCount-1];
		strokeWeight(strokeWidth);
		stroke(_sColor)
		line(_x,_y,points[_n].x,points[_n].y);
	}else {
		noStroke();
	}

	noStroke();
	// ellipse(_x,_y,_radius,_radius);	
	ctx.fillRect(_x-_radius,_y-_radius,_radius*2,_radius*2);
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
		
		//ctx.fillRect(_x,_y,1,1);
		//ellipse(_x,_y,_radius,_radius);
		ctx.fillRect(_x-_radius,_y-_radius,_radius*2,_radius*2);
		
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
	var _rectHalf = mouseRectSize >> 1;
	stroke("#ffba00");
	strokeWeight(1);
	noFill();
	rect(mouseX - _rectHalf , mouseY - _rectHalf, mouseRectSize,mouseRectSize);
};

var keyPressed = function(){
	if(keyCode == UP_ARROW) mouseRectSize += 4;
	if(keyCode == DOWN_ARROW) mouseRectSize -= 4;
};

var convertIntMultiple = function(_src){
	var _unit = (gridUnit < maxRadius )? maxRadius : gridUnit,
		_result = (_src / _unit | 0 ) * _unit;  // 結果 => 100
	
	if(onGrid == false) _result = _src;
	return _result;
};

/**
 * 画像でビットマップの下地を作成
 */
var createCanvasText= function(_callback){	

	setRandomParam();

	OFFSET_CANVAS.init({
		type:"text",
		text:getRandomStrings(),
		x:100,
		style:{
			"font-size":fontStyle.fontSize + "px",
			"line-height":fontStyle.lineHeight,
			"letter-spacing":fontStyle.letterSpacing+"px"
		},
		callback:function(){
			drawPixels = OFFSET_CANVAS.getDrawPixels();
			drawHeight = OFFSET_CANVAS.height + fontStyle.marginY;
			_callback();
		}
	});
};

var changeCanvasText = function(){
	var _rndX = (Math.random()*2) * 10 | 0,
		_rndY = (Math.random()*40 - 20) | 0;

	setRandomParam();

	OFFSET_CANVAS.init({
		type:"text",
		// text:getRandomStrings(),
		text:getRandomStrings(),
//		x:fontStyle.marginX + (_rndX*loopCount) + 100,
		x:100,
		y:drawHeight + fontStyle.marginY,
		style:{
			"font-size":fontStyle.fontSize + "px",
			"line-height":fontStyle.lineHeight,
			"letter-spacing":fontStyle.letterSpacing+"px"
		},
		callback:function(){
			drawPixels = OFFSET_CANVAS.getDrawPixels();
			drawHeight += OFFSET_CANVAS.height + fontStyle.marginY;
		}
	});
};

var setRandomParam = function() {
	maxRadius = Math.random()*1 + .1;
	// gridUnit = Math.random()*18 | 0;
	fontStyle.letterSpacing = Math.random()*35 | 0;
	fontStyle.marginY = (Math.random()*60|0)+1;
	fontStyle.fontSize = (30 + ((Math.random()*30 | 0) - 15));
	lifeSpd = 1 + (Math.random()*4|0);
}


/**
 * ランダムな文字列を取得する
 * @returns {String} 生成した文字列
 */
var getRandomStrings = function(){
	// 生成する文字列の長さ
	var _length = (Math.random()*20|0) + 5;
	
	maxLife = lifeLetter*_length;
	lifeCount= maxLife;

	// 生成する文字列に含める文字セット
	var _base 	= "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		_cl 	= _base.length,
		_str 	= "";
	
	for(var i=0; i < _length; i++){
		_str += _base[Math.floor(Math.random() * _cl)];
	}
	
	return "post-truth politics";
	return _str;
	
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
		_flg 	= (_p[_base + 3] > 0)? true : false;
		//_flg 	= (_color == 55)? true : false;
	return _flg;
};

var start = function () {
	createCanvasText(function() {
		isAnimating = true;	
	});
}

var stop = function () {
	isAnimating = false;
}

/**
 * パラメータ維持で表示をリセット
 */
var clear = function(){};



/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window,"maxRadius",.5,10);

DAT.add(window,"onGrid");
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

var folderTextStyle = DAT.addFolder("fontStyle");
DAT.add(fontStyle,"fontSize",10,300);
DAT.add(fontStyle,"letterSpacing",0,100);
DAT.add(fontStyle,"marginX",0,200);
DAT.add(fontStyle,"marginY",0,200);
DAT.add(window,"lifeSpd",1,10);
folderTextStyle.open();

var folderMethods = DAT.addFolder("method");
folderMethods.add(window,"start");
folderMethods.add(window,"stop");
// folderMethods.add(window,"isAnimating");
folderMethods.add(window,"reset").onChange(function(){
	background(bgColor);
});
folderMethods.open();


var folderPressed = DAT.addFolder("isPressed");
folderPressed.add(window,"mouseRectSize",10,300);
folderPressed.open();



