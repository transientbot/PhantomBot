!function(){function e(e,s){$.inidb.set("quotes",e,JSON.stringify([String(s[0]),String(s[1]),String(s[2]),String(s[3])]))}function s(e,s){var t=$.inidb.GetKeyList("quotes","").length,i=""!=$.getGame($.channelName)?$.getGame($.channelName):"Some Game";return $.inidb.set("quotes",t,JSON.stringify([e,s,$.systemTime(),i+""])),t}function t(e){var s,t,i=[];if($.inidb.exists("quotes",e)){$.inidb.del("quotes",e),s=$.inidb.GetKeyList("quotes","");for(t in s)i.push($.inidb.get("quotes",s[t])),$.inidb.del("quotes",s[t]);for(t in i)$.inidb.set("quotes",t,i[t]);return i.length?i.length:0}return-1}function i(e){var s;return(!e||isNaN(e))&&(e=$.rand($.inidb.GetKeyList("quotes","").length-1)),$.inidb.exists("quotes",e)?(s=JSON.parse($.inidb.get("quotes",e)),s.push(e),s):[]}$.bind("command",function(n){var a,o,r=n.getSender(),g=n.getCommand(),u=n.getArgs();if(g.equalsIgnoreCase("editquote")){if(u.length<3)return void $.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.usage"));a=i(u[0]),a.length>0?u[1].equalsIgnoreCase("user")?($.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.user.success",u[0],u[2])),a[0]=u[2],e(u[0],a)):u[1].equalsIgnoreCase("game")?($.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.game.success",u[0],u.splice(2).join(" "))),a[1]=u.splice(2).join(" "),e(u[0],a)):u[1].equalsIgnoreCase("quote")?($.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.quote.success",u[0],u.splice(2).join(" "))),a[2]=u.splice(2).join(" "),e(u[0],a)):$.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.usage")):$.say($.whisperPrefix(r)+$.lang.get("quotesystem.edit.404"))}if(g.equalsIgnoreCase("addquote")){if(!isModv3(r,n.getTags())&&!$.isOnline($.channelName))return void $.say($.whisperPrefix(r)+$.lang.get("quotesystem.add.offline"));if(u.length<1)return void $.say($.whisperPrefix(r)+$.lang.get("quotesystem.add.usage"));a=u.splice(0).join(" "),$.say($.lang.get("quotesystem.add.success",$.username.resolve(r),s(String($.username.resolve(r)),a)))}if(g.equalsIgnoreCase("delquote")){if(!u[0]||isNaN(u[0]))return void $.say($.whisperPrefix(r)+$.lang.get("quotesystem.del.usage"));var d;(d=t(u[0]))>=0?$.say($.whisperPrefix(r)+$.lang.get("quotesystem.del.success",u[0],d)):$.say($.whisperPrefix(r)+$.lang.get("quotesystem.del.404",u[0]))}if(g.equalsIgnoreCase("quote")&&(a=i(u[0]),a.length>0?(o=$.inidb.exists("settings","quoteMessage")?$.inidb.get("settings","quoteMessage"):$.lang.get("quotesystem.get.success"),o=o.replace("(id)",5==a.length?a[4].toString():a[3].toString()).replace("(quote)",a[1]).replace("(user)",$.resolveRank(a[0])).replace("(game)",5==a.length?a[3]:"Some Game").replace("(date)",$.getLocalTimeString("dd-MM-yyyy",parseInt(a[2]))),$.say(o)):$.say($.whisperPrefix(r)+$.lang.get("quotesystem.get.404","undefined"!=typeof u[0]?u[0]:""))),g.equalsIgnoreCase("quotemessage")){if(!u[0])return void $.say($.whisperPrefix(r)+$.lang.get("quotesystem.quotemessage.usage"));o=u.splice(0).join(" "),$.inidb.set("settings","quoteMessage",o),$.say($.whisperPrefix(r)+$.lang.get("quotesystem.quotemessage.success"))}}),$.bind("initReady",function(){$.bot.isModuleEnabled("./systems/quoteSystem.js")&&($.registerChatCommand("./systems/quoteSystem.js","addquote",7),$.registerChatCommand("./systems/quoteSystem.js","delquote",2),$.registerChatCommand("./systems/quoteSystem.js","editquote",2),$.registerChatCommand("./systems/quoteSystem.js","quote"),$.registerChatCommand("./systems/quoteSystem.js","quotemessage",1))})}();
