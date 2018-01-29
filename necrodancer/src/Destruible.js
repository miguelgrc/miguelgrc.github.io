var Destruible = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.destruible_png);


        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        this.shape.setCollisionType(tipoDestruible);
        // Nunca genera colisiones reales, es como un “fantasma”    //

        // forma estática
        gameLayer.space.addStaticShape(this.shape);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite, 10);


    },eliminar: function (){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    }

});
