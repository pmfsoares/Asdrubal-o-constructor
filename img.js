var fs = require('fs'),
    gm = require('gm'),
    request = require('request'),
//    runes = require('./runes.json');
    runes = require('./ChampionBuild/lux_world_overall_mid.json');
/*
let prefix = "./runes/";
for(a in runes ){
    for(b in runes[a].slots[0].runes){
        var tmp = runes[a].slots[0].runes[b].icon;
        var tmp_w = prefix + tmp;
        console.log(runes[a].slots[0].runes[b].icon);
        gm()
            .in('-page', '+0+0')
            .in(tmp_w)
            .minify()
            .background('transparent')
            .mosaic()
            .write(tmp_w, function(err){
                if(err) console.log(err);
                else console.log(tmp_w);
            });
    }
}*/
let prefix = "./runes/",
    main = runes.runes.main_perks,
    sub = runes.runes.sub_perks;
gm()
    .in('-page', '+0+0')
    .in(prefix + main[0].icon)
    .in('-page', '+32+128')
    .in(prefix + main[1].icon)
    .in('-page', '+32+192')
    .in(prefix + main[2].icon)
    .in('-page', '+32+256')
    .in(prefix + main[3].icon)
    .in('-page', '+128+128')
    .in(prefix + sub[0].icon)
    .in('-page', '+128+192')
    .in(prefix + sub[1].icon)
    .background('transparent')
    .mosaic()
    .write('./runes/test.png', function(err){
        if(err) console.log(err);
    });
/*
fs.writeFile(`runes.json`, JSON.stringify(runes), 'utf8', function(err){
    if(err) throw err;
});
*/
