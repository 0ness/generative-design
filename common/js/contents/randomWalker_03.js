/*property
--------------------------------------------------------------------*/
var LIB = new Planet(),

	winWidth 	= window.innerWidth,
	winHeight 	= window.innerHeight,

	param = {
		r: (255*Math.random()|0),
		g: (255*Math.random()|0),
		b: (255*Math.random()|0),
		h: (255*Math.random()|0),
		s: 100,
		l: 100,
		strokeColor: "rgba(0,0,0,1)",
		strokeAlpha:1,
		hitStrokeColor:"#fff",
		bgColor: LIB.getRndRGB(100)

	},
	
	points 		= [],
	pixels,
	outlinePixes= [],
	drawType 		= "normal",

	isAnimation		= false,
	isColorDependLen = false,
	isStrokeDependLen= false,
	direction		= "SOUTH",
	
	posX = 0,
	posY = 0,
	posXcross = 0,
	posYcross = 0,
	
	angleCount 	= Math.random()*50 | 0,
	angle 		= 0,
	stepSize  	= 2,
	margin		= 10,
	strokeWidth = 0.7,
	minLineLength 	= 40,
	
	ctx;

var canvas = document.getElementById('js-canvas-layer'),
	ctx2 = canvas.getContext("2d");

ctx2.fillStyle = "#00bfff";
canvas.width = winWidth;
canvas.height = winHeight;



/*function
--------------------------------------------------------------------*/
var setup = function() {
	var myCanvas = createCanvas(winWidth, winHeight);
	myCanvas.parent("canvas-container");
	ctx = document.getElementById('defaultCanvas0').getContext("2d");
	document.getElementById('wrapper').style.background = param.bgColor;

	ctx.fillStyle = "#909090";
	
	posX = Math.random()*winWidth|0;
	posY = 5;
	posXcross = posX;
	posYcross = posY;
	angle	= getRandomAngle(direction);
	
	createImageBitmap();

};

var draw = function() {
	if(!isAnimation) return false;
//	var _drawSpd = mouseX / winWidth * 200|0;
	var _drawSpd = 450;
	for (var i=0; i<=_drawSpd; i=(i+1)|0) randomWalk();
};



/**
 * 線を描画する
 */
var randomWalk  = function(){
	
	//------ draw dot at current position ------
//		point(posX, posY);
//	ctx.fillRect(posX,posY,strokeWidth,strokeWidth);

	// ------ make step ------
	posX += (Math.cos(radians(angle)) * stepSize * 10 | 0) / 10;
	posY += (Math.sin(radians(angle)) * stepSize * 10 | 0) / 10;

	// ------ check if agent is near one of the display borders ------
	var _border = false;
	
	if (posY <= margin) {
		direction = "SOUTH";
		_border = true;
	}else if (posX >= winWidth - margin) {
		direction = "WEST";
		_border = true;
	}else if (posY >= winHeight - margin) {
		direction = "NORTH";
		_border = true;
	}else if (posX <= margin) {
		direction = "EAST";
		_border = true;
	}

	// ------ if agent is crossing his path or border was reached ------
	var _px = posX | 0,
		_py = posY | 0;

	
//	if(onBlackColor(_px,_py)){
//		outlinePixes.push({x:_px,y:_py});
//		return false;
//	};
	
	if (_border || onDrawArea(ctx.getImageData(_px,_py,1,1).data)) changeAngle();
};


var drawPoint = function(){
	ctx2.beginPath();
	ctx2.arc(posX,posY,3,0,Math.PI*2,false)
	ctx2.fill();
	//ctx2.fillRect(posX-2,posY-2,4,4);
};

var changeAngle = function(){
	angle = getRandomAngle(direction);

	drawLine();
	drawPoint();

	posXcross = (posX*10|0)/10;
	posYcross = (posY*10|0)/10;
};


var drawLine = function(){
	var _distance = (dist(posX, posY, posXcross, posYcross) * 100 | 0) / 100,
		_minLine  = minLineLength,
		_px = posX | 0,
		_py = posY | 0;


	if (_distance < _minLine) return false;
		
	var _weight 	= (isStrokeDependLen) ? (_distance/winWidth * 200 | 0) / 10 : strokeWidth,
		_centering 	= _weight >> 1,
		_color 		= (isColorDependLen) ? getStrokeColor_02(_distance) : param.strokeColor;

	if(onBlackColor(_px,_py)) _color = param.hitStrokeColor;

	strokeWeight(_weight < 0.1? 0.1:_weight);
	stroke(_color);
	line(posX -_centering, posY -_centering, posXcross -_centering, posYcross -_centering);
}

/**
 * 線の色を取得：RGB
 */
var getStrokeColor = function(){
	var _xParam = posX / winWidth,
		_yParam = posY / winHeight,
		_r 		= (param.r * _yParam)|0,
		_g 		= (param.g * _yParam)|0,
		_b 		= (param.b * _yParam)|0,
		_color 	= "rgb("+_r+","+_g+","+_b+ ")";
	return _color;
};

/**
 * 線の色を取得：HSL
 */
var getStrokeColor_02 = function(){
	var _xParam = posX / winWidth,
		_yParam = posY / winHeight,
		_h 		= (param.h * _yParam)|0,
		_s 		= (param.s * _yParam)|0,
		_l 		= (param.l * _yParam)|0,
		_color 	= "hsl("+_h+","+_s+"%,"+_l+"%)";
	return _color;
};

/**
 * 方角の値を受け取ってランダムに反射角を返す
 * @param   {string} _direction 方角の文字列
 *　@returns {number} ランダムな反射角
 */
var getRandomAngle = function(_direction){
	var _count = angleCount,
		a = (( ((Math.random()*(_count*2))*4 - _count*4)/4 |0) + 0.5 ) * 90 / _count;
	if(_direction === "NORTH") return (a - 90)
	else if(_direction === "EAST") return (a)
	else if(_direction === "SOUTH") return (a + 90)
	else if(_direction === "WEST") return (a + 180);
	else 0;
};

/**
 * canvasの描画済みのエリアかどうか判定する
 * @param   {Array}   _pixel 色配列
 *　@returns {boolean} 描画済みかどうか正否値
 */
var onDrawArea = function(_pixel) {
	return _pixel[3] > 0;
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

var clear = function(){};







/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window, 'margin', 0,200);
DAT.add(window, 'strokeWidth',0.1,2)
DAT.add(window, 'angleCount', 2,100).onChange(function(_val){ angleCount = _val|0; });
DAT.add(window, 'minLineLength', 3,100);

var dat_rgb = DAT.addFolder("RGB");
dat_rgb.add(param, 'r', 0, 255);
dat_rgb.add(param, 'g', 0, 255);
dat_rgb.add(param, 'b', 0, 255);

var dat_hsl = DAT.addFolder("HSL");
dat_hsl.add(param, 'h', 0, 255);
dat_hsl.add(param, 's', 0, 100);
dat_hsl.add(param, 'l', 0, 100);

DAT.addColor(param, 'strokeColor');
DAT.addColor(param, 'hitStrokeColor');
DAT.addColor(param, 'bgColor').onChange(function(_val){
	document.getElementById('wrapper').style.background = _val;
});
DAT.add(window, "isStrokeDependLen");
DAT.add(window, "isColorDependLen");
DAT.add(window, "isAnimation");
DAT.add(window, "clear");



