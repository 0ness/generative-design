(function(window, document) {
    "use strict";


	
	
	/*Static Property
	--------------------------------------------------------------------*/
	var winWidth 	= window.innerWidth,
		winHeight 	= window.innerHeight;
	
	var pixels 		= [],
		particles 	= [];

	var canvasElm 	= document.getElementById("myCanvas"),
		ctx 		= canvasElm.getContext('2d');

	winWidth = canvasElm.width;
	winHeight= canvasElm.height;
	
	
	
	/*Private Method
	--------------------------------------------------------------------*/
	/**
	 * 値の下限と上限を設定し、それらを超えないように値を拘束する
	 * @param   {number} v  変数
	 * @param   {number} o1 下限の値
	 * @param   {number} o2 上限の値
	 *　@returns {number} 精査した戻り値
	 */
	var constrain = function(_val, _min, _max){
		if (_val < _min) _val = _min;
		else if (_val > _max) _val = _max;
		return _val;
	};
	

	/**
	 * rgbオブジェクトをhslオブジェクトに変換
	 */
	
	/**
	 * rgbオブジェクトをhslオブジェクトに変換
	 * @param   {object}  _obj      rgbオブジェクト
	 * @param   {boolean} coneModel coneモデルの切り替え
	 * @returns {object}  hslオブジェクトとして返す
	 */
	var convertRgbToHsl = function(_obj, coneModel){
		var r = _obj.r,
			g = _obj.g,
			b = _obj.b,
			h, // 0..360
			s,
			l, // 0..255
			max = Math.max(Math.max(r, g), b),
			min = Math.min(Math.min(r, g), b);

		// hue の計算
		if (max == min) h = 0; // 本来は定義されないが、仮に0を代入
		else if (max == r) h = 60 * (g - b) / (max - min) + 0;
		else if (max == g) h = (60 * (b - r) / (max - min)) + 120;
		else h = (60 * (r - g) / (max - min)) + 240;

		while (h < 0) h += 360;

		// saturation の計算
		if (coneModel) {
			// 円錐モデルの場合
			s = max - min;
		} else {
			s = (max == 0)
				? 0 // 本来は定義されないが、仮に0を代入
			: (max - min) / max * 255;
		}

		// value の計算
		l = max;
		return {'h': h|0, 's': s|0, 'l': l|0};
	}



	
	/*Sub Class
	--------------------------------------------------------------------*/
	// このクラスは、描画およびそれらのほとんどの色のドットを移動するための責任があります。
    var Particle = function(_x, _y) {
		//Sub Class property
        this.x = _x;
        this.y = _y;
        this.r = 0;
        this.vx = 0;
        this.vy = 0;
		
		this.noiseScale 	= 500;
		this.noiseStrength	= Math.random()*10 - 5; 	// how turbulent is the flow? 流れはどのように乱流ですか？
		this.speed 			= 0.5; 	// how fast do particles move? どのように高速粒子が移動するのですか？
		this.growthSpeed 	= 0.2; 	// how fast do particles change size? どのように高速粒子のサイズを変更できますか？
		this.maxSize 		= 5; 	// how big can they get? 彼らはどのように大きな得ることができますか？
    },
        ParticleMember = Particle.prototype;

	//Sub Class Static Property
	ParticleMember.endAngle	= Math.PI * 2 | 0;
	ParticleMember.baseX	= 100;
	ParticleMember.baseY	= 100;

	
	//Sub Class method
    /**
     * 画素配列内の指定されたピクセルの色を返します
     * @param   {number} x x座標
     * @param   {number} y y座標
     * @returns {string} 色rgb値
     */
    ParticleMember.getColor = function(x, y) {
        var _base = (Math.floor(y) * winWidth + Math.floor(x)) * 4,
			_pixels	= pixels,
			_c = {
				r: _pixels[_base + 0],
				g: _pixels[_base + 1],
				b: _pixels[_base + 2],
				a: _pixels[_base + 3]
			};
        return "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
    };
	
	ParticleMember.getColorObj = function(x,y){
		var _base = (Math.floor(y) * winWidth + Math.floor(x)) * 4,
			_pixels	= pixels,
			_c = {
				r: _pixels[_base + 0],
				g: _pixels[_base + 1],
				b: _pixels[_base + 2],
				a: _pixels[_base + 3]
			};
		return {
			r:_c.r,
			g:_c.g,
			b:_c.b
		};
	};

    /**
     * パーティクル単体のレンダリング処理
     */
    ParticleMember.render = function() {
		var _c			= this.getColor(this.x, this.y), // 私達はの上に座っているピクセルは何色ですか？
			_angle 		= noise(this.x / this.noiseScale, this.y / this.noiseScale) * this.noiseStrength, // どこに移動する必要がありますか？
			_onScreen	= this.x > 0 && this.x < winWidth && this.y > 0 && this.y < winHeight, // 我々は、画像の境界内にありますか？
			_isBlack	= _c != "rgb(255,255,255)" && _onScreen,
			_ctx		= ctx,
			_x 			= this.x,
			_y 			= this.y;

		// 我々は黒画素の上にあれば、成長します。そうでない場合、シュリンク。
        if (_isBlack) this.r += this.growthSpeed;
        else this.r -= this.growthSpeed;

		// この速度は、爆発の機能によって使用されます
        this.vx *= 0.5;
        this.vy *= 0.5;

		// 流れ場に基づいて、私たちの位置を変更し、私たちは、速度を爆発。
		this.x = ((this.x + Math.cos(_angle) * this.speed + this.vx) *10|0) /10;
		this.y = ((this.y + -Math.sin(_angle) * this.speed + this.vy) *10|0) /10;
		this.r = constrain(this.r,1,this.maxSize);

		// 私たちは小さなあれば、我々は黒画素を見つけるまで、周りに動かし続けます。
        if (this.r <= 1) {
            this.x = Math.random() * winWidth | 0;
            this.y = Math.random() * winHeight | 0;
            return;
        };
		
		var _saturation = convertRgbToHsl(this.getColorObj(this.x,this.y));
		var _radius 	= _saturation.s / 10 | 0;
//		var _radius 	= _saturation.l / 40;
//		var _radius = (_radius > 5) ? 5 : _radius; 

		if(_saturation.l < 80){
//			_ctx.strokeStyle = _c;
//			_ctx.lineTo(this.x,this.y);
		}

        // 円描画
//		_ctx.globalAlpha = ((this.r / this.maxSize) * 100 |0 ) / 1000;
//		_ctx.globalAlpha = ((this.maxSize / (this.r*this.r)) * 100 |0 ) / 1000;
		_ctx.globalAlpha = 1;
		
//		_ctx.lineWidth 	= 0.1;
//		_ctx.lineWidth = this.r;

		_ctx.fillStyle = _c;
//		_ctx.fillRect(this.x, this.y,_radius,_radius);
		_ctx.beginPath();
		_ctx.arc(this.x+this.baseX, this.y+this.baseY, _radius, 0, this.endAngle, false);
        _ctx.fill();
//		_ctx.moveTo(_x,_y);
//		_ctx.lineTo(this.x,this.y);
//      _ctx.stroke();
		
		this.noiseScale 	+= 0.001;
		this.noiseStrength 	+= (Math.random()*20 - 10) / 1000;
//		this.maxSize 		+= (Math.random()*2 - 1);
    };
	
	
	
	
	/*Constructor
	--------------------------------------------------------------------*/
	/**
	 * @class FuzzyText
     * @constructor
     */
	var FuzzyText = function(_param) {
		var _param  = _param || {};
		
		//public property
		this.doExplode		= false;
		this.bgColor		= "rgba(255,255,255,1)";
		this.image			= new Image();

		if(_param.width){
			winWidth = _param.width;
			canvasElm.setAttribute('width', winWidth);
		}
		if(_param.height){ 
			winHeight = _param.height;
			canvasElm.setAttribute('height', winHeight);
		}

        // Instantiate some particles
		for (var i = 0; i < this.particleLength; i=(i+1)|0) {
			particles[i] = new Particle(Math.random() * winWidth, Math.random() * winHeight);
        }
		
		var _self = this;
		canvasElm.addEventListener("mousedown",function(){
			this.bgColor 	= "rgba(255,255,255,"+ Math.random()*1 +")";
			_self.doExplode =  true;
		});
		canvasElm.addEventListener("mouseup",function(){
			this.bgColor 	= "rgba(255,255,255,1)";
			_self.doExplode =  false;
		});
		
		this.resize();
		window.addEventListener("resize",this.resize.bind(this));
		
		this.createBitmap();
    },
        Member = FuzzyText.prototype;
	
	
	
	
	/*Public static property
	--------------------------------------------------------------------*/
	Member.particleLength	= 3000;
	Member.letterSpacing	= 15;
	Member.lineHeight		= 45;
//	Member.colors 			= ["#666","#333","#ffe200","#f87300","#fff"];
	Member.colors 			= ["#666"];
	Member.bgAlpha			= 0.1;


	
	
	/*Public Method
	--------------------------------------------------------------------*/
	/**
	 * メッセージに基づいてピクセルのビットマップを作成
	 * メッセージプロパティを変更するたびに呼ばれる
	 * 白背景は色の値でパーティクルを操作する為の下地の処理
	 */
	Member.createBitmap = function() {
		var _c 		= ctx,
			_img 	= this.image;

		_c.fillStyle = "#fff";
		_c.fillRect(0, 0, winWidth, winHeight);
		
		_img.src = "images/staffPhoto.jpg";
		_img.onload = this.bitmapLoadCallback.bind(this);
	};
	
	/**
	 * ビットマップ読み込み後のコールバック関数
	 */
	Member.bitmapLoadCallback = function(){
		var _c 		= ctx;
		_c.fillStyle= "#fff";
		_c.drawImage(this.image,0,0);

		// ビットマップのピクセルデータ
		var imageData = _c.getImageData(0, 0, winWidth, winHeight);
		pixels = imageData.data;

		_c.clearRect(0, 0, winWidth, winHeight);
//		_c.fillStyle = this.bgColor;
//		_c.fillRect(0,0,winWidth,winHeight);
		_c.globalAlpha = 1;
//		_c.globalCompositeOperation = "multiply";

		_c.beginPath();
//		_c.moveTo(0,0);
//		this.loop();
		this.limitLoop(5);
	};

	/**
	 * フレームごとに一度呼び出され、アニメーションを更新
	 */
	Member.render = function() {
		var _c = ctx,
			_particles	= particles,
			_colors		= this.colors,
			_colorLength= _colors.length|0;

		//パーティクル描画の下地処理
//		_c.globalCompositeOperation = "source-over";
		_c.fillStyle = this.bgColor;
//		_c.globalAlpha = this.bgAlpha;
//		_c.fillRect(0,0,width,height);
		_c.clearRect(0, 0, winWidth, winHeight);

		if(this.doExplode){
			this.explode();
			_c.fillRect(0,0,winWidth,winHeight);
		}

		//パーティクルのレンダリング
		_c.beginPath();
		_c.lineTo(0,0);
		for (var i = 0; i < _particles.length; i=(i+1)|0) {
//			_c.fillStyle = _c.strokeStyle = _colors[i % _colorLength];
			_particles[i].render();
		}
		_c.stroke();
	};

	/**
	 * アニメーションのループ
	 */
	Member.loop = function() {
		this.render();
		window.requestAnimationFrame(this.loop.bind(this));
	};
	
	/**
	 * 静的な回数指定のループ処理
	 */
	Member.limitLoop = function(_num){
		for(var i=0; i<_num; i=(i+1)|0) this.render();
	};
	
    /**
     * パーティクル拡散処理
     */
    Member.explode = function() {
        var _mag 		= Math.random() * 50,
			_pi 		= Math.PI * 2,
			_particles	= particles;
		
		for(var i = 0; i<_particles.length; i=(i+1)|0) {
			var _p 		= particles[i],
				_angle  = Math.random() * _pi;
			_p.vx = Math.cos(_angle) * _mag;
			_p.vy = Math.sin(_angle) * _mag;
		}
    };
	
	/**
	 * リサイズ処理
	 */
	Member.resize = function(){
		winWidth		= window.innerWidth || document.body.clientWidth;
		winHeight		= window.innerHeight || document.body.clientHeight;
		canvasElm.width = winWidth;
		canvasElm.height= winHeight;
	};



    window.FuzzyText = FuzzyText;
}(window, document));