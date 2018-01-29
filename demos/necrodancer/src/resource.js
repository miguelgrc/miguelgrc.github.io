var res = {
    HelloWorld_png : "res/HelloWorld.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",

    caballero_png: "res/caballero.png",
    caballero_plist: "res/caballero.plist",

    mapanecro0_tmx: "res/mapanecro0.tmx",
    mapanecro1_tmx: "res/mapanecro1.tmx",

    wdz3cd4_png: "res/wall_dirt_zone3cold_diamond4.png",
    wdz2d1_png: "res/wall_dirt_zone2_diamond1.png",
    z3f: "res/zone3_floor.png",
    z3fb: "res/zone3_floorB.png",

    moneda_png: "res/resource_coin4.png",
    stairs_png: "res/stairs.png",

    animacion_slime_azul_png: "res/slime_ice.png",
    animacion_slime_azul_plist: "res/slime_ice.plist",
    animacion_harpy_png: "res/harpy.png",
    animacion_harpy_plist: "res/harpy.plist",

    armadura_png: "res/armor_heavyplate_01.png",

    latigo_png: "res/weapon_whip_golden_01.png",
    espadaLarga_png: "res/weapon_rapier_golden_01.png",

    bomba_png: "res/bomba.png",
    bomba_plist: "res/bomba.plist",

    comida_png: "res/food_4_01.png",

    destruible_png: "res/zone1_wall_stone_cracked_01.png",


    bgm_mp3: "res/bgm.mp3",
    hit_enemigo_ogg: "res/en_armadillo_hit.ogg",
    hit_jugador_ogg: "res/en_dorian_hurt_02.ogg",
    bomba_colocada_ogg: "res/sfx_bomb_lit.ogg",
    bomba_explosion_ogg: "res/sfx_bomb_explode.ogg",
    recoger_monedas_ogg: "res/sfx_pickup_gold_02.ogg",
    romper_destruible_ogg: "res/obj_barrel_break.ogg",
    recoger_armadura_ogg: "res/sfx_pickup_armor.ogg",
    recoger_arma_ogg: "res/sfx_pickup_weapon.ogg",
    recoger_comida_ogg: "res/sfx_item_food.ogg",

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}