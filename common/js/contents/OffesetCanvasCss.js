(function(window,document) {
	"use strict";
	
	
	
	
	var Index = function(_param){
		SELF = this;

		if(_param) this.init(_param);
	},
		Member = Index.prototype;
	
	
	
	
	/*property
	--------------------------------------------------------------------*/
	var SELF,
		TwoPi 		= Math.PI * 2,
		winWidth 	= window.innerWidth,
		winHeight 	= window.innerHeight,
		
		gridUnit 	= 5,
		width 		= 0,
		height 		= 0,

		pixels 		= [],
		drawPixels  = [],
		
		onGrid 		= true,

		canvasId 			= "offset-canvas-elm",
		parentId 			= "offset-canvas-parent",
		parentElmBaseStyle 	= "display:block; position:fixed; top:0; left:0; visibility:hidden; z-index:100;",
		
		domProps 	= {},
		
		canvas,
		ctx,
		parentDom;
	
	
	
	
	/* Public Method
	--------------------------------------------------------------------*/
	Member.init = function(_param){
		this.setParameters(_param);
		
		//オフセットDOM要素を生成済みかどうか
		if(document.getElementById(canvasId)) this.updateOffsetDom();
		else this.createOffsetDom();
		
		//裏側で描画開始
		if(domProps.type === "text") createCanvasText();
		else createImageBitmap();
	};
	
	/**
	 * パラメータ取得
	 * @param {object} _param 渡される引数
	 */
	Member.setParameters = function(_param){
		//console.log("setParameters");
		
		domProps 	= {
			type 			:_param.type,
			x  				:_param.x || 0,
			y 				:_param.y || 0,
			text 			:_param.text,
			imgPath 		:_param.imgPath,
			style 			:_param.style,
			fontSize  		:_param.style.fontSize || 30,
			fontfamily 		:_param.style.fontFamily || "'Helvetica'",
			letterSpacing	:_param.style.letterSpacing,
			callback 		:_param.callback
		};
		
		pixels 		= [];
		drawPixels 	= [];
	};
	
	/**
	 * オフセットDOMを作成
	 */
	Member.createOffsetDom = function(){
		//dom生成
		var _body 		= document.getElementsByTagName("body")[0],
			_style		= parentElmBaseStyle + getOffsetDomStyles(),
			_domStr	= "<div id='"+ parentId +"' style='"+_style+"'>"+domProps.text+"</div>";

		//ベースのdom要素を作成
		_body.insertAdjacentHTML("beforeend",_domStr);
		parentDom 	= document.getElementById(parentId);

		//canvas要素を作成
		var _canvasStr 	= "<canvas id='"+ canvasId +"' width='"+ parentDom.offsetWidth +"' height='"+ parentDom.offsetHeight +"' style='"+ parentElmBaseStyle +"'></canvas>";
		_body.insertAdjacentHTML("beforeend",_canvasStr);

		//dom要素を変数に
		canvas 		= document.getElementById(canvasId);
		ctx 		= canvas.getContext("2d");
		ctx.clearRect(0,0,parentDom.offsetWidth,parentDom.offsetHeight);
		
		this.width 		= parentDom.offsetWidth;
		this.height 	= parentDom.offsetHeight;
	};

	/**
	 * オフセットDOMの状態を更新
	 */
	Member.updateOffsetDom = function() {
		//テキスト・文字サイズ更新
		parentDom.innerHTML = domProps.text;
		parentDom.setAttribute("style", parentElmBaseStyle + getOffsetDomStyles());

		//canvasサイズ更新
		canvas.width 	= parentDom.offsetWidth;
		canvas.height 	= parentDom.offsetHeight;
		
		this.width 		= parentDom.offsetWidth;
		this.height 	= parentDom.offsetHeight;
		
		ctx.clearRect(0,0,parentDom.offsetWidth,parentDom.offsetHeight);
	}

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
 	* 画像でCanvasの塗りを作成
 	*/
	var createImageBitmap = function(){
		var _c 		= ctx,
			_img 	= new Image();

		_img.src = domProps.imgPath;
		_img.onload = function(){
			var _x = (winWidth - _img.width) >> 2,
				_y = ((winHeight - _img.height) >> 1) - 70 + domProps.y;
			_c.drawImage(_img,_x,_y);
			var imageData = _c.getImageData(0, 0, winWidth, winHeight);
			pixels = imageData.data;
		};
	};

	/**
	* CSSテキストでCanvasの塗りを作成
	*/
	var createCanvasText= function(){
		ctx.clearRect(0,0,winWidth,winHeight);
		
		//CSS文字列をcanvasに反映しピクセルを取得
		convertTextSinceCSS(function() {
			//ピクセルデータを一時保存
			pixels = ctx.getImageData(0, 0, winWidth, winHeight).data;

			//描画エリアを保存
			drawPixels = [];
			var _firstY = 0;
			for (var y=0; y<winHeight; y=(y+1)|0) {
				for (var x=0; x<winWidth; x=(x+1)|0) {
					if(!onDrawPixel(x,y)) continue;
					if(_firstY == 0) _firstY = y;
					drawPixels.push({
						x:x + domProps.x,
						y:y + domProps.y - _firstY
					});
				};
			};

			domProps.callback();
		});
	};

	/**
	 * CSSテキストをcanvasへ
	 * @param {object} _context ctxオブジェクト
	 *　@param {string} text    文章
	 *　@param {number} x       x座標
	 *　@param {number} y       y座標
	 */
	var convertTextSinceCSS = function(_callback) {
		var _parent			= parentDom,
			_data = "<svg xmlns='http://www.w3.org/2000/svg' width='"+_parent.offsetWidth+"' height='"+_parent.offsetHeight+"'><foreignObject width='100%' height='100%'><div xmlns='http://www.w3.org/1999/xhtml' style='" + getSvgDomStyles() + "'>" +
					_parent.innerHTML + "</div></foreignObject></svg>";

		//1.CSSテキストをSVG画像化
		//2.画像を生成ロードさせるためのイベントリスナー設定
		//3.ロード後、canvasに描画
		var DOMURL	= self.URL || self.webkitURL || self,
			img		= new Image(),
			svg		= new Blob([_data], {type: "image/svg+xml;charset=utf-8"}),
			url		= DOMURL.createObjectURL(svg);
		
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
			DOMURL.revokeObjectURL(url);
			_callback();
		};
		img.src = url;
	};
	
	/**
	 * オフセットDOMに反映させたいスタイルを引数から取得
	 * @returns {string} style要素に追加する文字列
	 */
	var getOffsetDomStyles = function(){
		var _styles 	= domProps.style,
			_styleStr 	= "";
		//反映するCSSを文字列化
		for (var prop in _styles) {
			var _val = _styles[prop];
			_styleStr += prop + ":" + _val +";";
		}
		return _styleStr;
	};
	
	/**
	 * オフセットDOMに反映させたいスタイルを引数から取得
	 * @returns {string} style要素に追加する文字列
	 */
	var getSvgDomStyles = function(){
		var _styles = parentDom.currentStyle || document.defaultView.getComputedStyle(parentDom, ''),
			_reflectProperys = [
				"font-size",
				"font-style",
				"line-height",
				"letter-spacing",
				"color",
				"font-weight",
				"font-family"
			],
			_styleStr 	= "";

		//反映するCSSを文字列化
		for (var i = 0; i < _reflectProperys.length; i++) {
			var _property = _reflectProperys[i];
			_styleStr += _property + ":" + _styles[_property] + ";";
		}
		
		return _styleStr;
	};

	/**
	 * 画像の塗の上にオブジェクトが居るか判断
	 * @param   {number} x x座標
	 * @param   {number} y y座標
	 * @returns {boolean} 
	 */
	var onDrawPixel = function(x, y) {
		var _base 	= ((y|0) * winWidth + (x|0)) * 4,
			_p 		= pixels,
			_flg 	= (_p[_base + 3] > 0)? true : false;
		return _flg;
	};

	
	
	
	window.OffsetCanvasCss = Index;
})(window,document);
