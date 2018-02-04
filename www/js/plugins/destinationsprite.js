//=============================================================================
// DestinationSprite.js
// Version: 1.2.1
//=============================================================================
var Imported = Imported || {};
Imported.Krimer_DestinationSprite = true;


//=============================================================================
 /*:
* @plugindesc v1.2.1 - С помощью этого плагина, вы сможете изменить спрайт указателя пути от клика\прикосновения. 
* <DestinationSprite> 
* @author Dirge
* 
* @param Sprite Figure
* @desc Вид указателя. Square = Квадрат, Circle = Круг, Off = Скрыть указатель, Custom=исп. вашу картинку Default: Square
* @default Square
* 
* @param Custom Image
* @desc Имя вашей картинки в папке '/img/system'. Активно только при "Sprite Figure = Custom"
* @default image
*
* @param Animation mode
* @desc Режимы анимации. blink => станд. RMMV анимация; fade => исчезновение. Def:blink
* @default blink
*
* @param Sprite Size
* @desc Размер спрайта. Игнор. при "Sprite Figure=Custom"
* Default: 48
* @default 48
* 
* @param Sprite Color
* @desc Цвет спрайта. Игнор. при "Sprite Figure=Custom".Ссылка где можно подобрать цвет находится в "Help". Default: #ffffff
* @default #ffffff
* 
* @param Sprite Opacity
* @desc Непрозрачность спрайта. Введите число в диапазоне 0..255. Default: 120
* @default 120
*
* @param Sprite Blend
* @desc Включает или отключает смешивание.        0=Выкл, 1=Вкл
* Default: 1   
* @default 1 
*
* @help Цвета можно выбрать, например, тут:
* http://www.w3schools.com/tags/ref_colorpicker.asp
* Рекомендованный размер для Custom Images - 48x48 или не больше размера ваших тайлов.
* 
 */

(function() {
    var parameters = $plugins.filter(function(p) {return p.description.contains('<DestinationSprite>');})[0].parameters;
    var dSpriteFigure = String(parameters['Sprite Figure'] || 'Square');
    var dAnimationMode = String(parameters['Animation mode'] || 'blink');
    var dFadeSpeed = String(parameters['Fade speed'] || '12');
    var dSpriteColor = String(parameters['Sprite Color'] || '#ffffff');
    var dSpriteSize = Number(parameters['Sprite Size']);
    var dCustomImage = String(parameters['Custom Image']);
    var dSpriteOpacity = Number(parameters['Sprite Opacity']);
    var dSpriteBlend = Number(parameters['Sprite Blend']);

    Sprite_Destination.prototype.createBitmap = function() {
        var tileWidth = dSpriteSize || $gameMap.tileWidth();
        var tileHeight = dSpriteSize || $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        if (dSpriteFigure == 'Square') {
            this.bitmap.fillAll(dSpriteColor);
        } else if (dSpriteFigure == 'Circle') {
            this.bitmap.drawCircle(this.bitmap.width / 2, this.bitmap.height / 2, dSpriteSize / 2, dSpriteColor);
        } else if (dSpriteFigure == 'Off') {} else if (dSpriteFigure == 'Custom') {
            this.bitmap = ImageManager.loadSystem(dCustomImage)
        }
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = (dSpriteBlend == 1) ? Graphics.BLEND_ADD : Graphics.BLEND_NORMAL;
    };

    Sprite_Destination.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= 20;
        if (dAnimationMode == "blink") {
            this.opacity = dSpriteOpacity === 255 ? 255 : Math.floor(dSpriteOpacity / 6 - this._frameCount) * 6;
            this.scale.x = 1 + this._frameCount / 20;
            this.scale.y = this.scale.x;
        } else if (dAnimationMode == "fade" && $gameTemp.getDestinationOpacity() > 0) {
            this.opacity = $gameTemp.getDestinationOpacity() - dFadeSpeed;
            $gameTemp.setDestinationOpacity(this.opacity);
        }
    };

    var Game_Temp_initialize_dAlias = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        Game_Temp_initialize_dAlias.call(this);
        this._destinationOpacity = null;
    };

    Game_Temp.prototype.setDestinationOpacity = function(value) {
        this._destinationOpacity = value;
    };

    Game_Temp.prototype.getDestinationOpacity = function() {
        return this._destinationOpacity;
    };

    var Game_Temp_setDestination_dAlias = Game_Temp.prototype.setDestination;
    Game_Temp.prototype.setDestination = function(x, y) {
        Game_Temp_setDestination_dAlias.call(this, x, y);
        if (dAnimationMode == "fade") this._destinationOpacity = 255;
    };
})();