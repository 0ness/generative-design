/*property
--------------------------------------------------------------------*/
var LIB 		= new Planet(),

	winWidth 	= window.innerWidth,
	winHeight 	= window.innerHeight,

	isAnimation	= true,
	
	currentCount= 0,
	maxCount	= 5000,
	
	x 			= [],
	y 			= [],
	r 			= [],
	
	ctx,
	
	minSize		= 1,
	maxSize 	= 15,
	alpha 		= 1,
	resetAlpha	= 1,
	fillColor	= "rgba(0,0,0,0.5)",
	composition = "source-over";




/*function
--------------------------------------------------------------------*/
var setup = function() {
	var myCanvas = createCanvas(winWidth, winHeight);
	myCanvas.parent("canvas-container");
	ctx = document.getElementById('defaultCanvas0').getContext("2d");
	
	//first circle
	x[0] = winWidth >> 1;
	y[0] = winHeight >> 1;
	//x[0] = winWidth * Math.random() | 0;
	//y[0] = winHeight * Math.random() | 0;
	r[0] = 10;
	currentCount++;
};

var draw = function() {
	if(!isAnimation) return false;
	
	var c 	 =ctx,
		/*
		円の半径newRと座標newX,newYをランダムに定義する
		*/
		//newR = (Math.random()*maxSize + Math.random()*maxSize + Math.random()*maxSize) / 3 | 0,
		newR = getRandomLoop(minSize,maxSize),
		newX = random(newR, winWidth-newR),
		newY = random(newR, winHeight-newR),
		
		closestDist = 100000000,
		closestIndex = 0;
	
	drawBackground();
	
	/*
	forで一番近い円を探します。新しい円との距離をすべての円に対して1つずつ計算します。
	この距離がこれまでのどの距離よりも短い場合、その円への参照を変数closestIndexに保存します。
	*/
	for (var i=0; i<=currentCount; i=(i+1)|0){
		var newDist = LIB.getPointDistance(
			{x:newX,y:newY},
			{x:x[i],y:y[i]}
		);
		if(newDist < closestDist){
			closestDist = newDist;
			closestIndex = i;
		}
	}
	
	/*
	このコードで新しい円のスタート位置と一番近い円をつなぐ直線を描くと、
	ここで行っているプロセスを視覚化することができます。
	*/
	drawProcess(newX,newY,newR,closestIndex);
	
	/*
	一番近い円との角度を計算することで、
	２つの円が接するように新しい円を置くことが出来ます。
	*/
	var angle = Math.atan2( newY - y[closestIndex] , newX - x[closestIndex]);
	x[currentCount]  = x[closestIndex] + Math.cos(angle) * (r[closestIndex] + newR);
	y[currentCount]  = y[closestIndex] + Math.sin(angle) * (r[closestIndex] + newR);
	r[currentCount]  = newR;
	currentCount++;
	
	//draw them
	//c.globalCompositeOperation = composition;
	//c.globalAlpha = alpha;
	//c.beginPath();
	//c.arc(x,y,r,0,Math.PI*2,false);
	//c.closePath();
	//c.fill();

	
	for (var i=0; i<currentCount; i=(i+1)|0) {
		//if (i === 0) c.fillStyle = "rgba(0,0,0,1)";
		//else c.fillStyle = c.strokeStyle = fillColor;
		c.fillStyle = c.strokeStyle = fillColor;
				
		c.beginPath();
		c.arc(x[i],y[i],r[i],0,Math.PI*2,false);
		c.closePath();
		if (i === 0) c.fill();
		c.stroke();
	};
	c.globalCompositeOperation = "source-over";
	c.globalAlpha = 1;

	if(currentCount >= maxCount) isAnimation = false;
};

var getRandomLoop = function(_min,_max){
	var _val = (Math.random()*_max + Math.random()*_max + Math.random()*_max + Math.random()*_max) / 4 | 0;
	if(_val < _min) _val = _min;
	return _val;
}

var drawBackground = function(){
	var _c = ctx;
	_c.fillStyle = "rgba(255, 255, 255, " + (resetAlpha|0) + ")";
	_c.fillRect(0,0,winWidth,winHeight);
	_c.strokeWidth = 0.1;
};

var drawProcess = function(_nx,_ny,_nr,_index){
	var _c = ctx;
	_c.beginPath();
	_c.arc(_nx,_ny,3,0,Math.PI*2,false);
	_c.moveTo(_nx,_ny);
	_c.lineTo(x[_index],y[_index]);
	_c.closePath();
	_c.fill();
	_c.stroke();
};


var clear = function(){
	x = [];
	y = [];
	r = [];
	currentCount = 0;


};







/* @object
 * dat.GUI用オブジェクト
 */
var DAT = new dat.GUI();
//DAT.add(window, "isAnimation");
DAT.add(window, "minSize",1,100).onChange(function(_val){
	if(minSize >= maxSize) minSize = maxSize - 1;
});
DAT.add(window, "maxSize",2,100).onChange(function(_val){
	if(minSize >= maxSize) minSize = maxSize - 1;
});
DAT.addColor(window, "fillColor");
DAT.add(window, "alpha",0,1);
DAT.add(window, "resetAlpha",0,1);
DAT.add(window,'composition',["source-over","xor","lighter","multiply","difference"]);
DAT.add(window, "clear");



