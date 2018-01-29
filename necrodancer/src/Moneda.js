var Moneda = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        this.gameLayer = gameLayer;


        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.moneda_png);


        // Cuerpo estática, no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;
        // forma
        this.shape = new cp.CircleShape(body, radio-4, cp.vzero);
        this.shape.setCollisionType(tipoMoneda);
        // Nunca genera colisiones reales, es como un “fantasma”    //
        this.shape.setSensor(true);
        // forma estática
        gameLayer.space.addStaticShape(this.shape);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite, 10);


    },eliminar: function (){
        // quita la forma
        this.gameLayer.space.removeShape(this.shape);

        // quita el cuerpo *opcional, funciona igual
        // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
        // this.gameLayer.space.removeBody(shape.getBody());

        // quita el sprite
        this.gameLayer.removeChild(this.sprite);
    }

});
