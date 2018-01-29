var tipoJugador = 1;
var tipoMoneda = 2;
var tipoFinMapa = 3;
var tipoEnemigo = 4;
var tipoArmadura = 5;
var tipoAtaque = 6;
var tipoLatigo = 7;
var tipoEspadaLarga = 8;
var tipoExplosion = 9;
var tipoComida = 10;
var tipoDestruible = 11;

var GameLayer = cc.Layer.extend({
    caballero:null,
    space:null,
    tecla:0,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    updateFreq: 28,
    time: 0,
    pulsada: null,
    movDuration: 9,
    monedas:[],
    formasEliminar:[],
    nivel: 0,
    maxNivel: 1,
    finMapa: null,
    enemigos: [],
    armaduras: [],
    pulsadaAtaque: 0,
    latigos: [],
    espadasLargas: [],
    bomba: null,
    haExplotado: false,
    comida: [],
    destruibles: [],
    ctor:function () {
       this._super();
       var size = cc.winSize;

       cc.spriteFrameCache.addSpriteFrames(res.caballero_plist);
       cc.spriteFrameCache.addSpriteFrames(res.bomba_plist);
       cc.spriteFrameCache.addSpriteFrames(res.animacion_slime_azul_plist);
       cc.spriteFrameCache.addSpriteFrames(res.animacion_harpy_plist);


        // Inicializar Space (sin gravedad)
       this.space = new cp.Space();

        /**
       this.depuracion = new cc.PhysicsDebugNode(this.space);
       this.addChild(this.depuracion, 10);
        **/


       this.cargarMapa();
       this.scheduleUpdate();

        var tilesHaciaLaDerecha = 4;
        var tilesHaciaArriba = 6;
        var centroPersonaje = 12 // Tile: 24x24, centro: 12
       this.caballero = new Caballero(this.space,
              cc.p(tilesHaciaLaDerecha*24 + centroPersonaje, tilesHaciaArriba*24 + centroPersonaje), this);


        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá
        //colisión por la propiedad SENSOR de la Moneda).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.collisionJugadorConMoneda.bind(this), null, null);

        // jugador y finMapa
        this.space.addCollisionHandler(tipoJugador, tipoFinMapa,
            null, this.collisionJugadorConFinMapa.bind(this), null, null);

        // jugador y armadura
        this.space.addCollisionHandler(tipoJugador, tipoArmadura,
            null, this.collisionJugadorConArmadura.bind(this), null, null);

        // ataque y enemigo
        this.space.addCollisionHandler(tipoAtaque, tipoEnemigo,
            null, this.collisionAtaqueConEnemigo.bind(this), null, null);

        // jugador y latigo
        this.space.addCollisionHandler(tipoJugador, tipoLatigo,
            null, this.collisionJugadorConLatigo.bind(this), null, null);

        // jugador y espada larga
        this.space.addCollisionHandler(tipoJugador, tipoEspadaLarga,
            null, this.collisionJugadorConEspadaLarga.bind(this), null, null);

        // jugador y explosion
        this.space.addCollisionHandler(tipoJugador, tipoExplosion,
            null, this.collisionJugadorConExplosion.bind(this), null, null);

        // enemigo y explosion
        this.space.addCollisionHandler(tipoEnemigo, tipoExplosion,
            null, this.collisionEnemigoConExplosion.bind(this), null, null);

        // enemigo y jugador
        this.space.addCollisionHandler(tipoEnemigo, tipoJugador,
            null, this.collisionEnemigoConJugador.bind(this), null, null);

        // jugador y comida
        this.space.addCollisionHandler(tipoJugador, tipoComida,
            null, this.collisionJugadorConComida.bind(this), null, null);

        // ataque y destruible
        this.space.addCollisionHandler(tipoAtaque, tipoDestruible,
            null, this.collisionAtaqueOExplosionConDestruible.bind(this), null, null);
        // explosion y destruible
        this.space.addCollisionHandler(tipoExplosion, tipoDestruible,
            null, this.collisionAtaqueOExplosionConDestruible.bind(this), null, null);

       cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
       }, this);


       return true;

    },update:function (dt) {
       this.space.step(dt);

       var posicionXCamara = this.caballero.body.p.x - this.getContentSize().width/2;
       var posicionYCamara = this.caballero.body.p.y - this.getContentSize().height/2;

       if ( posicionXCamara < 0 ){
          posicionXCamara = 0;
       }
       if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
          posicionXCamara = this.mapaAncho - this.getContentSize().width;
       }

       if ( posicionYCamara < 0 ){
           posicionYCamara = 0;
       }
       if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
           posicionYCamara = this.mapaAlto - this.getContentSize().height ;
       }

       this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));

        if(this.time == this.updateFreq) { //ACTUALIZACIÓN (BEAT)

            if (this.pulsadaAtaque != 0) {
                this.caballero.borrarAtaque();
                this.pulsadaAtaque = 0;
            }


            for(var i = 0; i < this.enemigos.length; i++){
                this.enemigos[i].invulnerable = false;
            }

            this.caballero.invulnerable = false;

            if(this.bomba != null)
                this.bomba.cuentaAtras();

            // izquierda
            if (this.pulsada == 37) {
                if (this.caballero.body.p.x > 0) {
                    this.caballero.moverIzquierda();
                } else {
                    this.caballero.detener();
                }
            }
            // derecha
            if (this.pulsada == 39) {
                if (this.caballero.body.p.x < this.mapaAncho) {
                    this.caballero.moverDerecha();
                } else {
                    this.caballero.detener();
                }
            }
            // arriba
            if (this.pulsada == 38) {
                if (this.caballero.body.p.y < this.mapaAlto) {
                    this.caballero.moverArriba();
                } else {
                    this.caballero.detener();
                }
            }

            // abajo
            if (this.pulsada == 40) {
                if (this.caballero.body.p.y > 0) {
                    this.caballero.moverAbajo();
                } else {
                    this.caballero.detener();
                }
            }

            if (this.pulsada == 32) {//espacio
                this.caballero.colocarBomba();
            }


            if(this.pulsada == 87 || this.pulsada == 83 || this.pulsada == 65 || this.pulsada == 68) { //w
                this.pulsadaAtaque = this.pulsada;
            }


            // ninguna pulsada
            if (this.pulsada == 0) {
                this.caballero.detener();
            }

            this.time = 0;
            this.pulsada = 0;


            for(var i = 0; i < this.enemigos.length; i++){
                this.enemigos[i].mover();
            }


        }
        else if(this.time == this.movDuration){
            this.caballero.detener();
            for(var i = 0; i < this.enemigos.length; i++){
                this.enemigos[i].detener();
            }

            if(this.haExplotado == true){
                this.bomba.eliminar();
                this.bomba.borrarArea();
                this.haExplotado = false;
            }

            if(this.pulsadaAtaque != 0) {
                if (this.pulsadaAtaque == 87) { //w
                    this.caballero.atacarArriba();
                }
                if (this.pulsadaAtaque == 83) { //s
                    this.caballero.atacarAbajo();
                }
                if (this.pulsadaAtaque == 65) { //a
                    this.caballero.atacarIzquierda();
                }
                if (this.pulsadaAtaque == 68) { //d
                    this.caballero.atacarDerecha();
                }

            }
        }

        // this.pulsada = this.tecla;
        // cc.warn("Pulsada: " + this.pulsada);
        // cc.error("Tiempo:" + this.time);
        this.time ++;


        // Eliminar formas:
        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var i = 0; i < this.monedas.length; i++) {
                if (this.monedas[i].shape == shape) {
                    this.monedas[i].eliminar();
                    this.monedas.splice(i, 1);
                }
            }
            for (var i = 0; i < this.armaduras.length; i++) {
                if (this.armaduras[i].shape == shape) {
                    this.armaduras[i].eliminar();
                    this.armaduras.splice(i, 1);
                }
            }

            for (var i = 0; i < this.enemigos.length; i++) {
                if (this.enemigos[i].shape == shape) {
                    this.enemigos[i].eliminar();
                    this.enemigos.splice(i, 1);
                }
            }

            for (var i = 0; i < this.latigos.length; i++) {
                if (this.latigos[i].shape == shape) {
                    this.latigos[i].eliminar();
                    this.latigos.splice(i, 1);
                }
            }

            for (var i = 0; i < this.espadasLargas.length; i++) {
                if (this.espadasLargas[i].shape == shape) {
                    this.espadasLargas[i].eliminar();
                    this.espadasLargas.splice(i, 1);
                }
            }

            for (var i = 0; i < this.comida.length; i++) {
                if (this.comida[i].shape == shape) {
                    this.comida[i].eliminar();
                    this.comida.splice(i, 1);
                }
            }

            for (var i = 0; i < this.destruibles.length; i++) {
                if (this.destruibles[i].shape == shape) {
                    this.destruibles[i].eliminar();
                    this.destruibles.splice(i, 1);
                }
            }

        }
        this.formasEliminar = [];



        if(this.caballero.vidas <= 0){
            cc.director.pause();
            cc.audioEngine.stopMusic();
            this.getParent().addChild(new MenuLayer());
        }



    }, cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap("res/mapanecro" + this.nivel + ".tmx");
       // Añadirlo a la Layer
       this.addChild(this.mapa);
       // Ancho del mapa
       this.mapaAncho = this.mapa.getContentSize().width;
       this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
              var limite = limitesArray[i];
              var puntos = limite.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyLimite = new cp.StaticBody();

                  var shapeLimite = new cp.SegmentShape(bodyLimite,
                      cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                          parseInt(limite.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                          parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                      1);

                  shapeLimite.setFriction(1);
                  shapeLimite.setElasticity(0);
                  this.space.addStaticShape(shapeLimite);
              }
        }


        var grupoFinMapa = this.mapa.getObjectGroup("finmapa"); //\Sería solo un objeto por mapa
        var finMapaArray = grupoFinMapa.getObjects();
        this.finMapa = new FinMapa(this, cc.p(finMapaArray[0]["x"],finMapaArray[0]["y"]));


        var grupoEnemigosSlimeAzul = this.mapa.getObjectGroup("enemigosslimeazul");
        var enemigosSlimeAzulArray = grupoEnemigosSlimeAzul.getObjects();
        for (var i = 0; i < enemigosSlimeAzulArray.length; i++) {
            var secuencia = ["Derecha", "Abajo", "Izquierda", "Arriba"];
            var vidas = 3;
            var damage = 1;
            var nombreSprite = "slime_ice";
            var enemigoSlimeAzul = new Enemigo(this,
                cc.p(enemigosSlimeAzulArray[i]["x"],enemigosSlimeAzulArray[i]["y"]),
                secuencia, vidas, damage, nombreSprite);
            this.enemigos.push(enemigoSlimeAzul);
        }

        var grupoEnemigosHarpy = this.mapa.getObjectGroup("enemigosharpy");
        var enemigosHarpyArray = grupoEnemigosHarpy.getObjects();
        for (var i = 0; i < enemigosHarpyArray.length; i++) {
            var secuencia = ["Derecha", "Derecha", "Derecha", "Izquierda", "Izquierda", "Izquierda", "Abajo",
                "Derecha", "Derecha", "Derecha", "Izquierda", "Izquierda", "Izquierda", "Arriba"];
            var vidas = 2;
            var damage = 2;
            var nombreSprite = "harpy";
            var enemigoHarpy = new Enemigo(this,
                cc.p(enemigosHarpyArray[i]["x"],enemigosHarpyArray[i]["y"]),
                secuencia, vidas, damage, nombreSprite);
            this.enemigos.push(enemigoHarpy);
        }

        var grupoArmaduras = this.mapa.getObjectGroup("armaduras");
        var armadurasArray = grupoArmaduras.getObjects();
        for (var i = 0; i < armadurasArray.length; i++) {
            var armadura = new Armadura(this,
                cc.p(armadurasArray[i]["x"],armadurasArray[i]["y"]));
            this.armaduras.push(armadura);
        }

        var grupoLatigos = this.mapa.getObjectGroup("latigos");
        var latigosArray = grupoLatigos.getObjects();
        for (var i = 0; i < latigosArray.length; i++) {
            var latigo = new Latigo(this,
                cc.p(latigosArray[i]["x"],latigosArray[i]["y"]));
            this.latigos.push(latigo);
        }

        var grupoEspadasLargas = this.mapa.getObjectGroup("espadaslargas");
        var espadasLargasArray = grupoEspadasLargas.getObjects();
        for (var i = 0; i < espadasLargasArray.length; i++) {
            var espadaLarga = new EspadaLarga(this,
                cc.p(espadasLargasArray[i]["x"],espadasLargasArray[i]["y"]));
            this.espadasLargas.push(espadaLarga);
        }

        var grupoDestruibles = this.mapa.getObjectGroup("destruibles");
        var destruiblesArray = grupoDestruibles.getObjects();
        for (var i = 0; i < destruiblesArray.length; i++) {
            var destruible = new Destruible(this,
                cc.p(destruiblesArray[i]["x"],destruiblesArray[i]["y"]));
            this.destruibles.push(destruible);
        }



    },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         instancia.tecla = keyCode;
         instancia.pulsada = keyCode;    //

    },teclaLevantada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         if ( instancia.tecla  == keyCode){
             instancia.tecla = 0;
         }

    },collisionJugadorConMoneda:function (arbiter, space) {
        // Marcar la moneda para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);
        capaControles.agregarMoneda();
        cc.audioEngine.playEffect(res.recoger_monedas_ogg, false);

    },collisionJugadorConFinMapa:function (arbiter, space) {
        if (this.nivel < this.maxNivel)
            this.nivel++;
        else
            this.nivel = 0;
        this.ctor();    //\
        var capaControles =
            this.getParent().getChildByTag(idCapaControles);
        capaControles.actualizarVida(this.caballero.vidas);
        capaControles.removeArmadura();
        capaControles.removeArma();

    },collisionJugadorConArmadura:function (arbiter, space) {
        if(this.caballero.armadura == false){
            var shapes = arbiter.getShapes();
            // shapes[0] es el jugador
            this.formasEliminar.push(shapes[1]);
            this.caballero.armadura = true;
            var capaControles =
                this.getParent().getChildByTag(idCapaControles);
            capaControles.addArmadura();
            cc.audioEngine.playEffect(res.recoger_armadura_ogg, false);
        }

    },collisionAtaqueConEnemigo:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el ATAQUE
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.enemigos[i].shape == shapes[1]) {
                this.enemigos[i].receiveDamage(1);
                if(this.enemigos[i].vidas <= 0)
                    this.formasEliminar.push(shapes[1]);
            }
        }

    },collisionJugadorConLatigo:function (arbiter, space){
        if(this.caballero.latigo == false){
            var shapes = arbiter.getShapes();
            // shapes[0] es el jugador
            this.formasEliminar.push(shapes[1]);
            this.caballero.espadaLarga = false;
            this.caballero.latigo = true;
            var capaControles =
                this.getParent().getChildByTag(idCapaControles);
            capaControles.addArma("Látigo");
            cc.audioEngine.playEffect(res.recoger_arma_ogg, false);
        }

    },collisionJugadorConEspadaLarga:function (arbiter, space){
        if(this.caballero.espadaLarga == false){
            var shapes = arbiter.getShapes();
            // shapes[0] es el jugador
            this.formasEliminar.push(shapes[1]);
            this.caballero.latigo = false;
            this.caballero.espadaLarga = true;
            var capaControles =
                this.getParent().getChildByTag(idCapaControles);
            capaControles.addArma("Espada larga");
            cc.audioEngine.playEffect(res.recoger_arma_ogg, false);
        }

    },collisionJugadorConExplosion:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.caballero.receiveDamage(2);

    },collisionEnemigoConExplosion:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el enemigo
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.enemigos[i].shape == shapes[0]) {
                this.enemigos[i].receiveDamage(2);
                if (this.enemigos[i].vidas <= 0)
                    this.formasEliminar.push(shapes[0]);
            }
        }

    },collisionEnemigoConJugador:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el enemigo
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.enemigos[i].shape == shapes[0]) {
                var enemigo = this.enemigos[i];
                var ultimaDireccion = "";
                if(enemigo.actual - 1 < 0)
                    ultimaDireccion = enemigo.secuencia[enemigo.secuencia.length-1];
                else
                    ultimaDireccion = enemigo.secuencia[enemigo.actual - 1];
                if(ultimaDireccion == "Arriba")
                    this.caballero.moverArriba();
                else if(ultimaDireccion == "Abajo")
                    this.caballero.moverAbajo();
                else if(ultimaDireccion == "Izquierda")
                    this.caballero.moverIzquierda();
                else if(ultimaDireccion == "Derecha")
                    this.caballero.moverDerecha();

                this.caballero.receiveDamage(enemigo.damage);
            }
        }

    },collisionJugadorConComida:function (arbiter, space) {
        if(this.caballero.vidas < this.caballero.maxVidas){
            var shapes = arbiter.getShapes();
            // shapes[0] es el jugador
            this.formasEliminar.push(shapes[1]);
            this.caballero.aumentarVida(1);
            cc.audioEngine.playEffect(res.recoger_comida_ogg, false);
        }

    },collisionAtaqueOExplosionConDestruible:function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el ATAQUE
        for (var i = 0; i < this.destruibles.length; i++) {
            if (this.destruibles[i].shape == shapes[1]) {
                this.formasEliminar.push(shapes[1]);
                cc.audioEngine.playEffect(res.romper_destruible_ogg, false);
            }
        }
    }

});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();            //

        cc.audioEngine.playMusic(res.bgm_mp3, true);

        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer(layer);
        this.addChild(controlesLayer, 0, idCapaControles);
    }
});
