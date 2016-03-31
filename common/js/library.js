/*==============================================================================

	汎用処理ライブラリ

	・基本DOM操作の自動化
	・HTML5対応
	・IE対応

==============================================================================*/


//SCRIPT START
var Library = function(){


	/*const 定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;

	//ページ情報
	var pages = new PageInfo();

	//文字列
	var strPageUA = pages.UA();			//ユーザーエージェント保持
	var strPageVER = pages.VER();		//IEのバージョン保持

	//正否値
	var flgPageMobile = pages.mobile();   //モバイル判定


	/*function 拡張　requestAnimFrame()
	--------------------------------------------------------------------*/
    win.requestAnimFrame = (function(){
		return	win.requestAnimFrame ||
				win.webkitRequestAnimFrame ||
				win.mozRequestAnimFrame ||
				win.msRequestAnimFrame ||
				function(callback,element){
					win.setTimeout(callback,1000/60);
				};
	})();


	/*method jQuery アンカーアニメーション（jQueryオブジェクト）
	--------------------------------------------------------------------*/
	var ancher = function(_obj){
		$(function(){
			$.fx.interval = 20;
			var $ancherTag = (strPageUA === "webkit") ? $("body"):$("html");
			var href = _obj.attr("href");
			var target = $(href == "#" || href == "" ? 'html' : href);
			var position = target.offset().top-30;// 移動先を数値で取得
			$ancherTag.stop().animate({scrollTop:0}, 600, 'easeInOutQuad');
		});
		return false;
	};


	/*method jQuery トップへ戻るリンク
	--------------------------------------------------------------------*/
	var topBackAncher = function(){
		$(function(){
			var $topBack = $(doc.getElementById("topBack"));
			$topBack.on("click",function(e){
				e.preventDefault();
				ancher($topBack);
			});
		})
		return false;
	}();


	/*method jQuery 固定アンカーリンク
	--------------------------------------------------------------------*/
	var fixedLinkAncher = function(){
		$(function(){

			$.fx.interval = 20;

			var $win = $(win);
			var $wrapper = $(doc.getElementById("wrapper"));

			var pageTop = doc.getElementById("topBack");
			var $ancherBtn = $(pageTop);	//トップに戻るボタン

			var h = 0;
			var b = 0;
			var cls = "static";
			var old_flg = false;
			var now_flg = false;

			//高さ確認
			var SizeCheck = function(){
				h = $win.height();
				b = ($wrapper.height()-h)-40;
			};
			SizeCheck();
			var num_scroll;
			var timer;

			//FixLinkクラス
			var FixLink = function(){};
			FixLink.prototype = {
				scrollCheck:function(){//スクロール時の位置判定
					num_scroll = $win.scrollTop();

					//位置のフラグ
					if(num_scroll > 500) now_flg = true;
					else now_flg = false;

					//フッターとの位置調整
					cls = (num_scroll >= b) ? "static" : "";
					pageTop.className = cls;
					timer = setTimeout(fa.scrollCheck,80);

					//表示の切り替え
					if(now_flg !== old_flg){
						if(now_flg === true){
							$ancherBtn.fadeTo(200,1,"linear");
							old_flg = true;
						}else{
							$ancherBtn.fadeTo(200,0,"linear");
							old_flg = false;
						}
					}
					return false;
				},
				resize:function(){//リサイズ時の位置調整
					SizeCheck();
					if(strPageVER !== 2) fa.scrollCheck();
					return false;
				}
			};

			//FixAncherインスタンス
			if(flgPageMobile === false){
				var fa = new FixLink();
				//ページ全体のイベント
				$win.on({"load":fa.resize,"resize":fa.resize});
				timer = setTimeout(fa.scrollCheck,80);
			}

			$ancherBtn.on("click",function(e){
				e.preventDefault();
				ancher($ancherBtn);
			});
		});
	};


	/*method IE8以下 jQuery HTML5_placeholder対応
	--------------------------------------------------------------------*/
	var placeholder = function(){
		$(function(){
			var supportsInputAttribute = function (attr) {
				var input = document.createElement('input');
				return attr in input;
			};
			if (!supportsInputAttribute('placeholder')) {

				$('[placeholder]').each(function () {
					var input = $(this);
					var placeholderText = input.attr('placeholder');
					var placeholderColor = 'GrayText';
					var defaultColor = input.css('color');

					input.on({
						"focus":function(){
							if (input.val() === placeholderText) {
								input.val('').css('color', defaultColor);
							}
						},
						"blur":function(){
							if (input.val() === '') {
								input.val(placeholderText).css('color', placeholderColor);
							} else if (input.val() === placeholderText) {
								input.css('color', placeholderColor);
							}
						}
					}).parents('form').submit(function () {
						if (input.val() === placeholderText) {
							input.val('');
						}
					});
				});
			}
		});
		return false;
	};


	/*method IE8,7で透過処理を個別に対応
	引数：処理を行いたい画像（jQueryオブジェクト）
	--------------------------------------------------------------------*/
	var alphaCheck = function(obj){
		$(function(){
			if(strPageVER === "ie8" || strPageVER === "ie7"){
				var img = obj;
				var imgPass = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img.attr('src') + '", sizingMethod="scale");';
				img.css('filter',imgPass);
			}
		});
		return false;
	}


	/*method IE8,7で透過処理を入れ子に対応
	引数：処理を行いたい画像の親要素（jQueryオブジェクト）
	--------------------------------------------------------------------*/
	var alphaAllCheck = function(obj){
		$(function(){
			if(strPageVER === "ie8" || strPageVER === "ie7"){
				var o = obj;
				o.each(
					function(){
						var img = $(this);
						if(img.attr('src').indexOf('.png') !== -1) {
							var imgPass = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img.attr('src') + '", sizingMethod="scale");';
							img.css('filter',imgPass);
						}
					}
				)
			}
		});
		return false;
	}


	/*method 自動化 コピーライト年数
	--------------------------------------------------------------------*/
	var yearAdjust = function(){
		var d = new Date();
		var now_year = d.getFullYear();
		doc.getElementById("nowYear").innerHTML = ""+now_year;
		return false;
	};


	/*test テスト
	--------------------------------------------------------------------*/
	var test = function(obj){
		$(function(){
			var o = obj;
			o.fadeOut(300);
			console.log("library test test");
		})
		return false;
	};


	/*function 戻り値関数
	--------------------------------------------------------------------*/
	return {
		test:function(obj){ test(obj); },
		ancher:function(obj){ ancher(obj); },
		yearAdjust:function(){ yearAdjust()},
		placeholder:function(){ placeholder() },
		ieAlphaImg:function(obj){alphaCheck(obj)},
		ieAlphaAllImg:function(obj){ alphaAllCheck(obj)}
	};


};