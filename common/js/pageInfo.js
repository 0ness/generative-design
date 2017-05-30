/*==============================================================================

	コンテンツ共通　ページ情報オブジェクト
	
	・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする
	
	・head内で読み込ませて使用
	・戻り値の関数は分岐処理などに利用する
	・CSS読み込み
	・viewportなどを操作する
	
==============================================================================*/
function PageInfo(){
	
	var doc = document;
	
	/*object ユーザー情報
	--------------------------------------------------------------------*/
	var user = {
		UA:"",				//ユーザーエージェント
		VER:"not IE",		//ブラウザバージョン IE用
		mobile:false,		//スマートフォン判定
		device:"pc",
		check:function(){	//ブラウザ判定		
			var _qs = "id=PC";
			var _ua = navigator.userAgent;
			var _wn = window.navigator;
			var _userAgent = _wn.userAgent.toLowerCase();
			var _appVersion = _wn.appVersion.toLowerCase();
			var _ls = location.search;

			//スマートフォン UA確認
			if(_ua.indexOf('iPhone') !== -1){
				this.mobile = true;
                var height_num = screen.height * window.devicePixelRatio;
                if( height_num === 1136) this.device = "iphone5";
                else this.device = "iphone";
            }else if(_ua.indexOf('Android') !== -1){
				this.device = "Android";
				this.mobile = true;
			}else if(_ua.indexOf('iPad') !== -1){
                var height_num = screen.height * window.devicePixelRatio;
                if( height_num === 2048) this.device = "ipad3";
                else this.device = "ipad";
			}
			
			//クエリ確認
			if (_ls.length !== 0) {
				_qs = _ls.substr(1).split("&").toString();	
				if(_qs === "id=PC") this.mobile = false;
				else if(_qs === "id=SP") this.mobile = true;
			}
			
			//ブラウザ確認
			if(_userAgent.indexOf("msie") !== -1){
				this.UA = "ie";
				if(_appVersion.indexOf("msie 8.") !== -1) this.VER = 'ie8';
				else if (_appVersion.indexOf("msie 7.") !== -1) this.VER =  'ie7';
				else if (_appVersion.indexOf("msie 6.") !== -1) this.VER = 'ie6';
				else if (_appVersion.indexOf("msie 6.") !== -1) this.VER = "ie9";	//IE9以上
                else this.VER = "ie10";
            }else if(_userAgent.indexOf('trident/7') != -1){
				this.UA = "ie";
                this.VER = 'ie11';
			}else{
				if(_userAgent.indexOf("firefox") !== -1) this.UA = "firefox";
				else this.UA = "webkit";				
			};
			
			return false;
		}
	};
	user.check();
	
	
	/*object ページ情報
	--------------------------------------------------------------------*/
	var content = {
		ID:"",				//ページid
		Category:"",		//ページclass
		check:function(){ //ページid・classの取得
			var bodys = doc.getElementsByTagName("body")[0];
			var classStr = user.UA;
            
			this.ID = bodys.getAttribute('id');
			this.Category = bodys.getAttribute("class");
            
			if(classStr !== "ie") doc.getElementById("wrapper").className = classStr;
			return false;
		}
	};
	content.check();


	/*object HEAD要素　動的記述
	--------------------------------------------------------------------*/
	var HEAD = {
		pcCSS:function(css){	//PC用	css記述
			if(user.mobile === false){
				var _STR = css;
				var link = doc.createElement('link');
				var head = doc.getElementsByTagName('head');
				link.href = _STR;
				link.type = 'text/css';
				link.rel = 'stylesheet';
				head.item(0).appendChild(link);
			}
			return false;
		},
		mobileCSS:function(css){	//モバイル用css記述
			if(user.mobile === true){
				var _STR = css;
				var link = doc.createElement('link');
				var head = doc.getElementsByTagName('head');
				link.href = _STR;
				link.type = 'text/css';
				link.rel = 'stylesheet';
				head.item(0).appendChild(link);
			}
			return false;
		},
		responseViewPort:function(){	//viewport記述
			var _str = 'width=950px';
			var meta = doc.createElement('meta');
			meta.setAttribute('name','viewport');
			if(user.mobile === true) _str = 'width=device-width';		
			meta.setAttribute('content',_str);
			doc.getElementsByTagName('head')[0].appendChild(meta);
		}
	};
	
	
	/*function 戻り値関数
	--------------------------------------------------------------------*/
	return {
		UA:function(){    return user.UA; },//ユーザーエージェント
		VER:function(){   return user.VER; },//ブラウザバージョン
		ID:function(){    return content.ID; },//ページid
		Category:function(){  return content.Category; },//ページclass
		device:function(){    return user.device; },//スマートフォンOS
		idCheck:function(){   return content.check(); },//ページid情報取得
		mobile:function(){    return user.mobile; },//モバイル判定
		pcCSS:function(css){  return HEAD.pcCSS(css); },//CSS動的読み込み
		mobileCSS:function(css){  return HEAD.mobileCSS(css); },//CSS動的読み込み
		viewport:function(){  return HEAD.responseViewPort(); },//viewport動的変更
		uaClass:function(){   return content.uaClass();}//UAをクラス名としてhtmlに付加する
	}
};
