/*property
--------------------------------------------------------------------*/
var TwoPi 	= Math.PI * 2,

	xStart 	= Math.random() * 10,
	yNoise 	= Math.random() * 10,
	xNoise 	= Math.random() * 10,
	noiseLevel	= 20,

	winWidth 	= window.innerWidth,
    winHeihgt 	= window.innerHeight,
	radiusBase 	= 20,
	radius 		= radiusBase,
	pointLen 	= 15,
	angle		= (Math.PI / 180) * (360 / pointLen),
	maxRandom 	= 10,
	minRandom 	= 5,
	strokeAlpha	= 0.5,
	strokeWidth	= 0.75,
	rndColorEncount = 20,

	bgColor		= "#eee",
	strokeColor = "rgb(0,0,0)",
	rndStrokeColor = "rgb(206, 255, 0)",
	
	isPressed 	= false,
	isRndColor	= true,
	
	canvas = null,
	ctx = null,
	
	LIB = new Planet();





/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeihgt);
    myCanvas.parent("canvas-container");
	canvas =  document.getElementById('defaultCanvas0');
	ctx = canvas.getContext("2d");
	
	//マウスイベント修正
	canvas.addEventListener('mousedown', function(e) {isPressed = true;},false);
	canvas.addEventListener('mouseup', function(e) {isPressed = false;},false);
	
	//スタイル指定
	stroke(strokeColor);
	strokeWeight(strokeWidth);
	noFill();
};

var draw = function() {
	if(isPressed === false) return false;
	radius = (radiusBase + noise(xNoise,yNoise) * noiseLevel - (noiseLevel>>1))|0;
	xNoise +=  ((Math.random()*10 - 5)|0)/100;
	yNoise +=  ((Math.random()*10 - 5)|0)/100;
	xNoise +=  0.0001;
	yNoise +=  0.0001;
		
	var _centerX= mouseX,
		_centerY= mouseY,
		_rad	= createRandomRadius(),
		_px		= (Math.cos(angle * (pointLen-1)) * _rad) + _centerX,
		_py		= (Math.sin(angle * (pointLen-1)) * _rad) + _centerY,
		_px0 	= _px,
		_py0 	= _py,
		_color	= strokeColor;

	//シェイプを作成
	ctx.globalAlpha = strokeAlpha;
	if((Math.random()* rndColorEncount |0) < 1){
		if(isRndColor) _color = LIB.getRndHEX(55);
		else _color = rndStrokeColor;
	}
	stroke(_color);
	strokeWeight(strokeWidth);
	
	beginShape();
	curveVertex(_px,_py)
	
	for (var i=0; i<pointLen; i=(i+1)|0) {
		_rad = createRandomRadius();
		curveVertex(_px,_py);
		_px = (Math.cos(angle * i) * _rad) + _centerX;
		_py = (Math.sin(angle * i) * _rad) + _centerY;
	};
	curveVertex(_px0,_py0);
	_rad = createRandomRadius();
	_px = (Math.cos(angle * 0) * _rad) + _centerX;
	_py = (Math.sin(angle * 0) * _rad) + _centerY;
	curveVertex(_px,_py);
	endShape();
	
	//描画
//	rect(0,0,winWidth,winHeihgt);
//	fill(255,5);
};


/**
 * ランダム値を計算した半径の値を生成
 * @returns {number} 計算後の半径
 */
var createRandomRadius = function() {
	var _radius = 0,
		_max = maxRandom,
		_min = minRandom;
	_radius = radius + ((Math.random()*_max - _min)+(Math.random()*_max - _min)+(Math.random()*_max - _min)+(Math.random()*_max - _min))/4;
	if(_radius < 1) _radius = 1;
	return _radius;
};




/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(window, 'radiusBase',1,100);
DAT.add(window, 'maxRandom',1,50).onChange(function(_val){
	minRandom = _val >> 1;
});
DAT.add(window, 'noiseLevel',0,200);

DAT.addColor(window, 'bgColor').onChange(function(_val){
	document.getElementById('wrapper').style.backgroundColor = _val;
});
DAT.addColor(window, 'strokeColor');
DAT.add(window, 'isRndColor');
DAT.addColor(window, 'rndStrokeColor');
DAT.add(window, 'rndColorEncount',2,30);
DAT.add(window, 'strokeAlpha',0,1);
DAT.add(window, 'strokeWidth',0.1,10);

