var Caballero = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,
    layer: null,
    animacionQuieto: null,
    animacionDerecha: null,
    animacionIzquierda: null,
    animacionArriba: null,
    animacionAbajo: null,
    animacion: null, // Actual
    maxVidas: 0,
    vidas: 0,
    armadura: false,
    latigo: false,
    espadaLarga: false,
    invulnerable: false,

    shapeAtaque: null,

    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#caballero_quieto_01.png");
        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);


        this.maxVidas = 3;
        this.vidas = this.maxVidas;
        this.armadura = false;
        this.latigo = false;
        this.espadaLarga = false;

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 1,
            this.sprite.getContentSize().height - 1);       //\ 1px menos por si acaso

        this.shape.setCollisionType(tipoJugador);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);

        // forma dinamica
        this.space.addShape(this.shape);

        // Crear animación - quieto
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "caballero_quieto_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionQuieto =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "caballero_derecha_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "caballero_izquierda_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "caballero_arriba_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "caballero_abajo_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));


        // ejecutar la animación
        this.sprite.runAction(this.animacionQuieto);
        this.animacion = this.animacionQuieto;
        layer.addChild(this.sprite, 10);

    }, moverIzquierda: function () {
        if (this.animacion != this.animacionIzquierda) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if (this.body.vx > -100) {
            this.body.applyImpulse(cp.v(-800, 0), cp.v(0, 0));
        }

    }, moverDerecha: function () {
        if (this.animacion != this.animacionDerecha) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if (this.body.vx < 100) {
            this.body.applyImpulse(cp.v(800, 0), cp.v(0, 0));
        }

    }, moverArriba: function () {
        if (this.animacion != this.animacionArriba) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        if (this.body.vy < 100) {
            this.body.applyImpulse(cp.v(0, 800), cp.v(0, 0));
        }

    }, moverAbajo: function () {
        if (this.animacion != this.animacionAbajo) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        if (this.body.vy > -100) {
            this.body.applyImpulse(cp.v(0, -800), cp.v(0, 0));
        }

    }, detener: function () {
        if (this.animacion != this.animacionQuieto) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionQuieto;
            this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        this.body.vy = 0;

    }, atacarArriba:function() {
        if (this.animacion != this.animacionArriba) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
        }

        if(this.latigo == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y + 36));
            this.shapeAtaque = new cp.BoxShape(body, 5, 24);
        }
        else if(this.espadaLarga == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y + 24));
            this.shapeAtaque = new cp.BoxShape(body, 48, 5);
        }
        else{
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y + 24));
            this.shapeAtaque = new cp.BoxShape(body, 5, 5);
        }
        this.shapeAtaque.setCollisionType(tipoAtaque);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shapeAtaque.setSensor(true);
        // forma estática
        this.layer.space.addShape(this.shapeAtaque);

    }, atacarAbajo:function() {
        if (this.animacion != this.animacionAbajo) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
        }

        if(this.latigo == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y - 36));
            this.shapeAtaque = new cp.BoxShape(body, 5, 24);
        }
        else if(this.espadaLarga == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y - 24));
            this.shapeAtaque = new cp.BoxShape(body, 48, 5);
        }
        else{
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x, this.body.p.y - 24));
            this.shapeAtaque = new cp.BoxShape(body, 5, 5);
        }
        this.shapeAtaque.setCollisionType(tipoAtaque);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shapeAtaque.setSensor(true);
        // forma estática
        this.layer.space.addShape(this.shapeAtaque);

    }, atacarIzquierda:function() {
        if (this.animacion != this.animacionIzquierda) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
        }

        if(this.latigo == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x - 36, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 24, 5);
        }
        else if(this.espadaLarga == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x - 24, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 5, 48);
        }
        else{
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x - 24, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 5, 5);
        }
        this.shapeAtaque.setCollisionType(tipoAtaque);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shapeAtaque.setSensor(true);
        // forma estática
        this.layer.space.addShape(this.shapeAtaque);

    }, atacarDerecha:function() {
        if (this.animacion != this.animacionDerecha) {
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
        }

        if(this.latigo == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x + 36, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 24, 5);
        }
        else if(this.espadaLarga == true){
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x + 24, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 5, 48);
        }
        else{
            var body = new cp.Body(1, Infinity);
            body.setPos(cc.p(this.body.p.x + 24, this.body.p.y));
            this.shapeAtaque = new cp.BoxShape(body, 5, 5);
        }
        this.shapeAtaque.setCollisionType(tipoAtaque);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shapeAtaque.setSensor(true);
        // forma estática
        this.layer.space.addShape(this.shapeAtaque);

    }, borrarAtaque: function() {
        this.layer.space.removeShape(this.shapeAtaque);

    }, colocarBomba: function() {
        if(this.layer.bomba == null) {
            this.layer.bomba = new Bomba(this.layer, cc.p(this.body.p.x, this.body.p.y));
            cc.audioEngine.playEffect(res.bomba_colocada_ogg, false);
        }


    }, receiveDamage: function(cantidad) {
        cc.audioEngine.playEffect(res.hit_jugador_ogg, false);
        if(this.invulnerable == false) {
            if (this.armadura == false) {
                this.vidas = this.vidas - cantidad;
                var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
                capaControles.actualizarVida(this.vidas);
            }
            else {
                this.armadura = false;
                var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
                capaControles.removeArmadura();
            }

            this.invulnerable = true;
        }

    }, aumentarVida: function(cantidad) {
        if(this.vidas + cantidad > this.maxVidas)
            this.vidas = this.maxVidas;
        else
            this.vidas = this.vidas + cantidad;
        var capaControles = this.layer.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarVida(this.vidas);
    }

});
