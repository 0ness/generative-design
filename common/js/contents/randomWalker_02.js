/*property
--------------------------------------------------------------------*/
var winWidth 	= window.innerWidth,
	winHeigt 	= window.innerHeight,

	param = {
		r: (255*Math.random()|0),
		g: (255*Math.random()|0),
		b: (255*Math.random()|0),
		h: (255*Math.random()|0),
//		s: (100*Math.random()|0),
//		l: (100*Math.random()|0),
//		h: 255,
		s: 100,
		l: 100,
		strokeColor: "#000000",
		bgColor: "#ffffff"
	},
	
	points =	[],
	
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
	strokeWidth = 1,
	minLineLength 	= 40,
	
	ctx;




/*function
--------------------------------------------------------------------*/
var setup = function() {
	var myCanvas = createCanvas(winWidth, winHeigt);
	myCanvas.parent("canvas-container");
	ctx = document.getElementById('defaultCanvas0').getContext("2d");
	
	points =[];
	
	posX = Math.random()*winWidth|0;
	posY = 5;
	posXcross = posX;
	posYcross = posY;
	angle	= getRandomAngle(direction);
};

var draw = function() {
	if(!isAnimation) return false;
	var _drawSpd = mouseX / winWidth * 400|0;
	for (var i=0; i<=_drawSpd; i=(i+1)|0) drawLine();
};



/**
 * 線を描画する
 */
var drawLine  = function(){
	//------ draw dot at current position ------
//		strokeWeight(1);
//		stroke(0,255);
//		point(posX, posY);

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
	}else if (posY >= winHeigt - margin) {
		direction = "NORTH";
		_border = true;
	}else if (posX <= margin) {
		direction = "EAST";
		_border = true;
	}

	// ------ if agent is crossing his path or border was reached ------
	var _px = int(posX),
		_py = int(posY);

	
	if (onDrawArea(get(_px,_py)) || _border) {

		angle = getRandomAngle(direction);
		
		var _distance = (dist(posX, posY, posXcross, posYcross) * 100 | 0) / 100,
			_minLine  = minLineLength,
			_maxLine  = 100;

		if (_distance >= _minLine) {
			var _weight 	= (isStrokeDependLen) ? (_distance/winWidth * 200 | 0) / 10 : strokeWidth,
				_centering 	= _weight >> 1,
				_color 		= (isColorDependLen) ? getStrokeColor_02(_distance) : param.strokeColor;
			
			strokeWeight(_weight < 0.1? 0.1:_weight);
			stroke(_color);
			line(posX -_centering, posY -_centering, posXcross -_centering, posYcross -_centering);
			
			var _point = {
				x:posX < posXcross? posX|0 : posXcross|0,
				y:posX < posXcross? posX|0 : posXcross|0,
				ex:posX < posXcross? posXcross|0 : posX|0,
				ey:posY < posYcross? posYcross|0 : posY|0
			};
			points.push(_point);			
		}
		posXcross = (posX*10|0)/10;
		posYcross = (posY*10|0)/10;
	}
	
	
};

/**
 * 線の色を取得：RGB
 */
var getStrokeColor = function(){
	var _xParam = posX / winWidth,
		_yParam = posY / winHeigt,
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
		_yParam = posY / winHeigt,
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
		a = (((Math.random()*(_count*2) - _count)|0) + 0.5 ) * 90 / _count;
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



var clear = function(){};







/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window, 'margin', 0,300);
DAT.add(window, 'strokeWidth',0.1,10)
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
DAT.addColor(param, 'bgColor').onChange(function(_val){
	document.getElementById('wrapper').style.background = _val;
});
DAT.add(window, "isStrokeDependLen");
DAT.add(window, "isColorDependLen");
DAT.add(window, "isAnimation");
DAT.add(window, "clear");



