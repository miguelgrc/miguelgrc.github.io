var ControlesLayer = cc.Layer.extend({
    etiquetaMonedas: null,
    monedas: 0,
    etiquetaVidas: null,
    layer: null,
    etiquetaArmadura: null,
    etiquetaArma: null,
    ctor:function (layer) {
        this._super();
        var size = cc.winSize;

        this.layer = layer;

        // Contador Monedas
        this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 20);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaMonedas.fillStyle = new cc.Color(255, 255, 255, 255);
        this.addChild(this.etiquetaMonedas);

        // Contador Vidas
        var maxVidas = layer.caballero.maxVidas;
        this.etiquetaVidas = new cc.LabelTTF("Vidas: " + maxVidas, "Helvetica", 20);
        this.etiquetaVidas.setPosition(cc.p(size.width - 90, size.height - 45));
        this.etiquetaVidas.fillStyle = new cc.Color(255, 0, 0, 0);
        this.addChild(this.etiquetaVidas);

        // Etiqueta Armadura
        this.etiquetaArmadura = new cc.LabelTTF("", "Helvetica", 14);
        this.etiquetaArmadura.setPosition(cc.p(size.width - 90, size.height - 65));
        this.etiquetaArmadura.fillStyle = new cc.Color(255, 255, 255, 255);
        this.addChild(this.etiquetaArmadura);

        // Etiqueta Arma
        this.etiquetaArma = new cc.LabelTTF("", "Helvetica", 14);
        this.etiquetaArma.setPosition(cc.p(size.width - 90, size.height - 85));
        this.etiquetaArma.fillStyle = new cc.Color(255, 255, 255, 255);
        this.addChild(this.etiquetaArma);

        this.scheduleUpdate();

        return true;

    },update:function (dt) {

    },agregarMoneda:function(){
        this.monedas++;
        this.etiquetaMonedas.setString("Monedas: " + this.monedas);

    },actualizarVida:function(vid){
        this.etiquetaVidas.setString("Vidas: " + vid);

    },addArmadura:function(){
        this.etiquetaArmadura.setString("Armadura equipada");
    },removeArmadura:function(){
        this.etiquetaArmadura.setString("");

    },addArma:function(arma){
        this.etiquetaArma.setString(arma + " equipado/a");
    },removeArma:function(){
        this.etiquetaArma.setString("");
    }



});
