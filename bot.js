const logger = require('winston');
const Discord = require('discord.js');
var {prefix, token} = require('./auth.json');

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const url = "https://u.gg/lol/champions/";
const url_icon = "http://ddragon.leagueoflegends.com/cdn/9.13.1/img/item/";
const icon_suffix = ".png";
const role_top = "/build?role=top";
const role_jungle = "/build?role=jungle";
const role_middle = "/build?role=middle";
const role_adc = "/build?role=adc";
const role_supp = "/build?role=support";

var {data} = require('./item.json');
var champ, builds, role_url;


var champName = "lux";
var top = "world_overall_top";
var jungle = "world_overall_jungle";
var mid = "world_overall_mid";
var adc = "world_overall_top";
var supp = "world_overall_supp";


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const client = new Discord.Client();
client.once('ready', () => {
    console.log('Ready!');
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');

});
client.login(token);

client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.name != "builds") return;
    else if(message.channel.name == "builds" && message.content.startsWith("!build")){
        const args = message.content.split(' ');
        const author = message.member;
        console.log(args);
        console.log(message.author + message.content);
        champName = args[1];
        role = roles(args[2]);
        if(role == null){
            message.channel.send("Desconheco essa lane");
            return;
        }
        sendBuild(message.channel);
    }
});
function roles(r){
    switch(r){
    case("top"):
        role_url = role_top;
        return top;
        break;
    case("jungle"):
        role_url = role_jungle;
        return jungle;
        break;
    case("mid"):
    case("middle"):
        role_url = role_middle;
        return mid;
        break;
    case("bot"):
    case("adc"):
        role_url = role_adc;
        return adc;
        break;
    case("supp"):
    case("support"):
        role_url = role_supp;
        return supp;
        break;
    default:
        return null;
    }
}
const getPage = ( cb ) => {
     request(`${url}${champName}/build/?role`, {
         timeout: 3000
     }, (error, response, body) => {
         if(!error){
             cb(body);
         }
     } );
 };

 const parsePage = ( data ) => {
     const $ = cheerio.load(data);
     let output = $("#ssr-preloaded-state").html();
     return output.substring(output.indexOf("{"));
 };
 function sendBuild(channel){
     getPage( (html) => {
         champ = JSON.parse(parsePage(html));
         let build = champ.championProfile.championOverview[1];
         builds = build[role];
         var item1 = itemName(builds["rec_starting_items"].items, 1);
         var item2 = itemName(builds["rec_core_items"].items, 1);
         var item3 = itemName(builds["item_options_1"], 0);
         var item4 = itemName(builds["item_options_2"], 0);
         var item5 = itemName(builds["item_options_3"], 0);
         const msg = new Discord.RichEmbed()
               .setColor('#0099ff')
               .setTitle(`${champName} Build`)
               .setURL(`${url}${champName}${role_url}`)
               .setAuthor(`u.gg`)
               .addField(`Starting Items`, item1, true)
               .addField(`Core Items`, item2, true)
               .addBlankField()
               .addField(`Option 1`, item3, true)
               .addField(`Option 2`, item4, true)        
               .addField(`Option 3`, item5, true);
         channel.send(msg);
         //         channel.send(`Starting\n${item1}\nCore\n${item2}\nOption1\n${item3}\nOption2\n${item4}\nOption3\n${item5}`);
     });
 };
 function itemName(build, x){
     let outputStr = "";
     if(x){
         build.forEach(function(item){
             outputStr += ":ok_hand:";
             outputStr += (data[item].name);
             outputStr += "\n";
         });
     }else if(!x){
         build.forEach(function(item){
             outputStr += ":+1:";
             outputStr += (data[item.item_id].name);
             outputStr += "\n";
         });
     }
     return outputStr;
 };












