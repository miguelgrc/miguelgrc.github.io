var FinMapa = cc.Class.extend({     //TODO: placeholder
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.stairs_png);


        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio-4, cp.vzero);
        this.shape.setCollisionType(tipoFinMapa);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite, 10);


    }

});
