/*property
--------------------------------------------------------------------*/
var canvas 	= document.getElementById("myCanvas"),
    ctx 	= canvas.getContext("2d"),
    TwoPi 	= Math.PI * 2,

	xStart 	= Math.random() * 10,
	yNoise 	= Math.random() * 10,

	winWidth 	= window.innerWidth,
    winHeihgt 	= window.innerHeight,
	
    param = {
        xStart: Math.random(10),
        yNoise: Math.random(10),
        xStep: 10,
        yStep: 15,
        noiseSpeed: 0.01,
        radiusLevel: 0.8,
        devideLevel: 4,
        r: 255,
        g: 255,
        b: 255,
        bgColor: "#9b9b9b"
    };




/*function
--------------------------------------------------------------------*/
var setup = function() {
    var myCanvas = createCanvas(winWidth, winHeihgt);
    myCanvas.parent("canvas-container");
    stroke(255, 0);
};

var draw = function() {
    background(param.bgColor);
    param.xStart += (param.noiseSpeed * 1000 | 0) / 1000;
    param.yNoise += (param.noiseSpeed * 1000 | 0) / 1000;
    drawPoints();
};

var drawPoints = function() {
    var _p = param,
        _xStart = _p.xStart,
        _yNoise = _p.yNoise,
        _step = 10,
        _xStep = _p.xStep,
        _yStep = _p.yStep,
        _devide = _p.devideLevel | 0;

    translate(winWidth >> 1, winHeihgt >> 1, 0);

    for (var y = -(winHeihgt / _devide | 0); y <= (winHeihgt / _devide | 0); y = (y + _yStep) | 0) {
        _yNoise += 0.02;
        var _xNoise = _xStart;
        for (var x = -(winWidth / _devide | 0); x <= (winWidth / _devide | 0); x = (x + _xStep) | 0) {
            _xNoise += 0.02;
            drawPoint(x, y, noise(_xNoise, _yNoise));
        };
    };
};

var drawPoint = function(_x, _y, _noise) {
    push();
    translate(_x * _noise * 4 | 0, _y * _noise * 4 | 0);
    var _edgeSize = _noise * 50,
        _p = param,
        _radius = _edgeSize * _p.radiusLevel | 0,
        _r = _p.r * _noise | 0,
        _g = _p.g * _noise | 0,
        _b = _p.b * _noise | 0,
        _alpha = 255 * _noise * 2 | 0;

    fill(_r, _g, _b, _alpha);
    ellipse(0, 0, _radius, _radius);
    pop();
};



/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
DAT.add(param, 'noiseSpeed', 0.001, 0.05).listen();
DAT.add(param, 'radiusLevel', 0.1, 2);
DAT.add(param, 'devideLevel', 1, 10);
DAT.add(param, 'xStep', 1, 50);
DAT.add(param, 'yStep', 1, 50);

DAT.add(param, 'r', 0, 255);
DAT.add(param, 'g', 0, 255);
DAT.add(param, 'b', 0, 255);
DAT.addColor(param, 'bgColor');
DAT.add(window, "setup");


