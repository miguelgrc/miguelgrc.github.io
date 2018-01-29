var Enemigo = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    body: null,
    secuencia: [],
    actual: 0,
    vidas: 0,
    damage: 0,
    invulnerable: false,
    ctor: function (gameLayer, posicion, secuencia, vidas, damage, nombreSprite) {
        this.gameLayer = gameLayer;

        this.secuencia = secuencia;
        this.vidas = vidas;
        this.damage = damage;
        this.actual = 0;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = nombreSprite + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.12);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#" + nombreSprite + "1.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body, 23, 23);      //// 1px más pequeña por si acaso
        // agregar forma dinamica
        this.shape.setCollisionType(tipoEnemigo);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        gameLayer.space.addShape(this.shape);
        // añadir sprite a la capa

        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        gameLayer.addChild(this.sprite, 10);


    }, mover: function () {
        if (this.secuencia[this.actual] == "Arriba") {
            this.body.vx = 0;
            if (this.body.vy < 100) {
                this.body.applyImpulse(cp.v(0, 800), cp.v(0, 0));
            }
        }
        else if (this.secuencia[this.actual] == "Abajo") {
            this.body.vx = 0;
            if (this.body.vy > -100) {
                this.body.applyImpulse(cp.v(0, -800), cp.v(0, 0));
            }
        }
        else if (this.secuencia[this.actual] == "Izquierda") {
            this.body.vy = 0;
            if ( this.body.vx > -100){
                this.body.applyImpulse(cp.v(-800, 0), cp.v(0, 0));
            }
        }
        else if (this.secuencia[this.actual] == "Derecha") {
            this.body.vy = 0;
            if ( this.body.vx < 100){
                this.body.applyImpulse(cp.v(800, 0), cp.v(0, 0));
            }
        }
        this.siguiente();


    }, siguiente: function () {
        if (this.actual < this.secuencia.length - 1)
            this.actual++;
        else
            this.actual = 0;

    }, detener: function () {
        this.body.vx = 0;
        this.body.vy = 0;

    }, receiveDamage: function(cantidad) {
        if(this.invulnerable == false){
            cc.audioEngine.playEffect(res.hit_enemigo_ogg, false);
            this.vidas = this.vidas - cantidad;
            this.invulnerable = true;
        }

    }, eliminar : function() {
        var rnd = Math.random();
        if (rnd < 0.75) {
            var moneda = new Moneda(this.gameLayer, cc.p(this.body.p.x, this.body.p.y));
            this.gameLayer.monedas.push(moneda);
        }
        else {
            var comida = new Comida(this.gameLayer, cc.p(this.body.p.x, this.body.p.y));
            this.gameLayer.comida.push(comida);
        }
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    }

});
