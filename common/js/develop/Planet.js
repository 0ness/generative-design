;(function (window,document) {
	"use strict";


	/**
	 * アニメーション・演算処理支援クラス  
	 * ・インタラクティブコンテンツ開発用の色生成、座標取得、絶対値の算出などを行う  
	 * ・インスタンスは即時関数内のローカル変数に格納して使用する  
	 * ・動的な演出に必要な処理は、プライオリティが低くても追加していく
	 * @class Planet
	 * @constructor
	 * @example var obj = new Planet():
	 */	
	var PLANET = function(){},
		METHOD = PLANET.prototype;
	
	

	/**
	* 色生成：シード値を与えてRGB値を返す
	* @method getRndRGB
	* @param{Number} 256色
	* @param{Number} 固定シード値
	* @return{String} 色番号
	*/
	METHOD.getRndRGB = function(_rnd,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			rgb = "rgb("+r+", "+g+", "+b+")";
		return rgb;
	};

	/**
	* 色生成：シード値を与えてRGB値を返す
	* @method getRndRGB_02
	* @param{Number} 赤
	* @param{Number} 青
	* @param{Number} 緑
	* @param{Number} 固定シード値
	* @return{String} 色番号
	*/
	METHOD.getRndRGB_02 = function(_r,_g,_b,_plus){
		var plus = _plus || 0,
			r = ((Math.random()*_r)>>0) + plus,
			g = ((Math.random()*_g)>>0) + plus,
			b = ((Math.random()*_b)>>0) + plus,
			rgb = "rgb("+r+", "+g+", "+b+")";
		return rgb;
	};

	/**
	* 色生成：シード値を与えてRGBA値を返す
	* @method getRndRGBA
	* @param{Number} 256色
	* @param{Number} 透明度
	* @param{Number} 固定シード値
	* @return{String} 色番号
	*/
	METHOD.getRndRGBA = function(_rnd,_alpha,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	};
	
	/**
	* 色生成：シード値を与えてRGBA値を返す
	* @method getRndRGBA
	* @param{Number} 256色
	* @param{Number} 透明度
	* @param{Number} 固定シード値
	* @return{String} 色番号
	*/
	METHOD.getRndRGBA_02 = function(_r,_g,_b,_alpha,_plus){
		var plus = _plus || 0,
			r = ((Math.random()*_r)>>0) + plus,
			g = ((Math.random()*_g)>>0) + plus,
			b = ((Math.random()*_b)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	};

	/**
	* 色生成：シード値を与えてランダムなHEX値を返す
	* @method getRndHEX
	* @param{Number} 256色
	* @return{String} 色番号
	*/
	METHOD.getRndHEX = function(_rnd){
		var cseed = ( Math.random()*_rnd ) >> 0;
		// 色の計算R ≒ 256 * n / 3, G ≒ 256 * n / 7, B ≒ 256 * n / 5
		var cnum = ( cseed++ * 0x552433 ) % 0x1000000;
		var hex = "000000" + cnum.toString(16);
		return "#" + hex.substr( hex.length - 6, 6 );
	};

	/**
	* 演算：差の絶対値を計算する
	* @method abs
	* @param{Number} 絶対値にしたい数値
	* @return{Number} 絶対値
	*/
	METHOD.abs = function(_baseNum){
		var _absNum = _baseNum;
		_absNum = _absNum>0?_absNum:-_absNum;
		return _absNum;
	};

	/**
	* 座標取得：ポイント01とポイント02の２点間の距離算出する
	* @method getPointDistance
	* @param{Object} ポイント01
	* @param{Object} ポイント02
	* @return{Number} 距離
	*/
	METHOD.getPointDistance = function(_p1,_p2){
		var p1	= _p1,
			p2	= _p2,
			a	= p1.x - p2.x,
			b	= p1.y - p2.y,
			d	= Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
		return d;
	};
	
	METHOD.getAreaDistance = function(_p1,_p2,_range){
		var p1	= _p1,
			p2	= _p2,
			a	= p1.x - p2.x,
			b	= p1.y - p2.y,
			d	= Math.sqrt(Math.pow(a,2) + Math.pow(b,2)),
			areaDistance  = (d < _range) ? (_range - d)|0  : 0;
		return (a > 0)? areaDistance : -areaDistance;
	};

	/**
	* 座標取得：マウスポインタ座標取得
	* @method getMousePoint
	* @param{Event} ターゲットイベント
	* @return{Object} オブジェクト
	*/
	METHOD.getMousePoint = function(e){
		var point = {x:0,y:0},
			doc = document.body;
		point.x = e.pageX;
		point.y = e.pageY;
		return point;
	};

	/**
	 * 数値取得：ウィンドウの幅を取得
	 * @method getWindowWidth
	 * @returns {Number} ウィンドウ幅
	 */
	METHOD.getWindowWidth = function(){
		var _width = window.innerWidth || document.body.clientWidth;
		return _width;
	};

	/**
	 * 数値取得：ウィンドウの高さを取得
	 * @method getWindowHeight
	 * @returns {Number} ウィンドウ高
	 */
	METHOD.getWindowHeight = function(){
		var _height = window.innerHeight || document.body.clientHeight;
		return _height;
	};

	/**
	 * 数値取得：スクロール値を取得
	 * @method getScrollTop
	 * @returns {Number} スクロール位置
	 */
	METHOD.getScrollTop = function(){
		var _y = document.body.scrollTop || document.documentElement.scrollTop;
		return _y;
	};





	window.Planet = PLANET;
}(window,document));
