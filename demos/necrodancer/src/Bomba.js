var Bomba = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    posicion: null,
    shapeExplosion: null,
    delay: 5,
    ctor: function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        this.posicion = posicion;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 5; i++) {
            var str = "bomb_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.55);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#bomb_01.png");
        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio, cp.vzero);

        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);
        // añadir sprite a la capa
        gameLayer.addChild(this.sprite, 10);


    }, cuentaAtras: function () {
        this.delay--;
        if (this.delay == 0) {
            cc.audioEngine.playEffect(res.bomba_explosion_ogg, false);
            var body = new cp.Body(1, Infinity);
            body.setPos(this.posicion);
            var radio = 50;
            this.shapeExplosion = new cp.CircleShape(body, radio, cp.vzero);
            this.shapeExplosion.setCollisionType(tipoExplosion);
            // Nunca genera colisiones reales, es como un “fantasma”    //
            this.shapeExplosion.setSensor(true);
            // forma estática
            this.gameLayer.space.addShape(this.shapeExplosion);

            this.gameLayer.haExplotado = true;
        }

    }, borrarArea: function() {
        this.gameLayer.space.removeShape(this.shapeExplosion);
        this.gameLayer.bomba = null;
    
    },eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);

    }

});
