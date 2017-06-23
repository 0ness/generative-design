(function(window,document) {
	"use strict";
	
	
	
	
	var Index = function(_param){
		if(_param) this.init(_param);
	},
		Member = Index.prototype;
		
		
	

	/*property
	--------------------------------------------------------------------*/
	var TwoPi 		= Math.PI * 2,
		winWidth 	= window.innerWidth,
		winHeight 	= window.innerHeight,
		
		gridUnit 	= 5,
		width 		= 0,
		height 		= 0,

		pixels 		= [],
		drawPixels  = [],
		
		onGrid 		= true,

		canvasId 	= "offset-canvas-elm",
		drawProp 	= {},
		
		canvas,
		ctx;




	/* Public Method
	--------------------------------------------------------------------*/
	Member.init = function(_param){
		this.setParameters(_param);
		if(!document.getElementById(canvasId)) this.createCanvasElm();
		
		//裏側で描画開始
		if(drawProp.type === "text") createCanvasText();
		else createImageBitmap();
	};
	
	/**
	 * パラメータ取得
	 * @param {object} _param 渡される引数
	 */
	Member.setParameters = function(_param){
		width 		= _param.width || winWidth;
		height 		= _param.height || winHeight;
		
		drawProp 	= {
			type 			:_param.type,
			x  				:_param.x || 0,
			y 				:_param.y || 0,
			text 			:_param.text,
			imgPath 		:_param.imgPath,
			fontSize  		:_param.fontSize || 30,
			fontfamily 		:_param.fontFamily || "'Helvetica'",
			letterSpacing	: _param.letterSpacing
		};
		
		pixels 		= [];
		drawPixels 	= [];
	};
	
	/**
	 * canvas要素をbodyに作成
	 */
	Member.createCanvasElm = function(){
		//dom生成
		var _body 	= document.getElementsByTagName("body")[0],
			_style	= "display:block; visibility:hidden; position:absolute; top:0; left:0; z-index:0;",
			_domStr = "<canvas id='"+ canvasId +"' width='"+ width +"' height='"+ height +"' style='"+ _style +"'></canvas>";
		_body.insertAdjacentHTML("beforeend",_domStr);
		
		//dom要素を変数に
		canvas = document.getElementById(canvasId);
		ctx = canvas.getContext("2d");
	};

	/**
	 * ピクセル情報を取得
	 * @returns {Array} 空白も含めるピクセル情報
	 */
	Member.getPixels = function(){
		return pixels;
	};
	
	/**
	 * 描画されたピクセル情報を取得
	 * @returns {Array} ピクセル情報
	 */
	Member.getDrawPixels = function(){
		return drawPixels;
	};
	
	
	
	
	/* Private Method
	--------------------------------------------------------------------*/
	var convertIntMultiple = function(_src,_unit){
		var _result = (_src / _unit | 0 ) * _unit;  // 結果 => 100
		if(onGrid == false) _result = _src;
		return _result;
	};

	/**
 	* 画像でビットマップの下地を作成
 	*/
	var createImageBitmap = function(){
		var _c 		= ctx,
			_img 	= new Image();

		_img.src = drawProp.imgPath;
		_img.onload = function(){
			var _x = (winWidth - _img.width) >> 2,
				_y = ((winHeight - _img.height) >> 1) - 70 + drawProp.y;
			_c.drawImage(_img,_x,_y);
			var imageData = _c.getImageData(0, 0, winWidth, winHeight);
			pixels = imageData.data;
		};
	};

	/**
	 * 文字の横書き処理
	 * @param {object} _context ctxオブジェクト
	 *　@param {string} text    文章
	 *　@param {number} x       x座標
	 *　@param {number} y       y座標
	 */
	var horizonTexts = function() {
		
		ctx.font 		= drawProp.fontSize +'px '+ drawProp.fontfamily;
		ctx.textBaseline = "top";
		ctx.textAlign 	= "left";

		var _c 				= ctx,
			_param			= drawProp,
			_y 				= drawProp.y,
			//_displayOutline = _param.displayOutline,
			//_doLetterRandom = _param.doLetterRandom,
			_lines 			= _param.text.split('\n'),
			_lineLen		= _lines.length,
			_lineHeight		= _param.fontSize;

		for(var i=0; i<_lineLen; i=(i+1)|0){
			var _line 		= _lines[i],
				_letterLen 	= _line.length,
				_space		= 0;

			for (var j=0; j<_letterLen; j=(j+1)|0) {
				//var _cx 		= (winWidth - (_letterSpacing * _letterLen)) >> 1;
				var _letterWidth	= _c.measureText(_line[j]).width,
					//_letterSpacing 	= (_letterWidth + _param.letterSpacing) | 0,
					_letterX 		= _space + (drawProp.fontSize >> 1),
					_letterY 		= (_lineHeight>>1);
				
				_letterWidth = (_param.fontSize < _letterWidth) ? _param.fontSize : _letterWidth;
				_c.fillText(_line[j], _letterX , _letterY);
				//console.log(_letterWidth, _letterX);
				_space += _letterWidth + _param.letterSpacing;
			};
		};
	};

	/**
	* 画像でビットマップの下地を作成
	*/
	var createCanvasText= function(){
		ctx.clearRect(0,0,winWidth,winHeight);
		
		//文字描画
		horizonTexts();

		//ピクセルデータを一時保存
		pixels = ctx.getImageData(0, 0, winWidth, winHeight).data;

		//描画エリアを保存
		drawPixels = [];
		var _count = 0;
		for (var x=0; x<winWidth; x=(x+1)|0) {
			for (var y=0; y<winHeight; y=(y+1)|0) {
				if(!onBlackColor(x,y)) continue;
				_count++;
				drawPixels.push({
					x:x,
					y:y + drawProp.y
				});
			};
		};
		//console.log(_count);
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
			//_color  = _p[_base + 0] + _p[_base + 1] + _p[_base + 2] + _p[_base + 3],
			_flg 	= (_p[_base + 3] > 0)? true : false;
		return _flg;
	};

	
	
	
	window.OffsetCanvas = Index;
})(window,document);
