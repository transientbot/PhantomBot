!function(){function e(e){var r=$.inidb.GetKeyList("blacklist","");if(e)for(var t in r)c.push($.inidb.get("blacklist",r[t]))}function r(e){var r=$.inidb.GetKeyList("whitelist","");if(e)for(var t in r)h.push($.inidb.get("whitelist",r[t]))}function t(e,r){$.say(".timeout "+e+" "+r),setTimeout(function(){$.say(".timeout "+e+" "+r)},1e3)}function a(e){for(var r in l)if(l[r].equalsIgnoreCase(e))return t(e,A),s(e),void(R="(timeout)");t(e,j),s(e),R="(warning)"}function i(e,r){m.length<=1&&$.say("@"+$.username.resolve(e)+", "+r+" "+R)}function s(e){l.push(e),o(e),N>0&&($.consoleLn("push"),m.push($.systemTime()))}function o(e){if(N>0)var r=setTimeout(function(){m.splice(0),clearTimeout(r)},1e3*N);var t=setTimeout(function(){for(var r in l)if(l[r].equalsIgnoreCase(e)){l.splice(r,0);break}clearTimeout(t)},36e5)}function n(e){d.push(e);var r=setTimeout(function(){for(var t in d)if(d[t].equalsIgnoreCase(e)){d.splice(t,1);break}clearTimeout(r)},1e3*p)}function g(e){return e?$.lang.get("common.enabled"):$.lang.get("common.disabled")}var d=[],l=[],m=[],h=[],c=[],u=$.inidb.exists("chatModerator","linksToggle")?$.getIniDbBoolean("chatModerator","linksToggle"):!0,f=$.inidb.exists("chatModerator","linksMessage")?$.inidb.get("chatModerator","linksMessage"):"you were timed out for linking",p=$.inidb.exists("chatModerator","linkPermitTime")?parseInt($.inidb.get("chatModerator","linkPermitTime")):120,b=$.inidb.exists("chatModerator","capsToggle")?$.getIniDbBoolean("chatModerator","capsToggle"):!0,y=$.inidb.exists("chatModerator","capsMessage")?$.inidb.get("chatModerator","capsMessage"):"you were timed out for overusing caps",w=$.inidb.exists("chatModerator","capsLimit")?parseInt($.inidb.get("chatModerator","capsLimit")):50,v=$.inidb.exists("chatModerator","capsTriggerLength")?parseInt($.inidb.get("chatModerator","capsTriggerLength")):10,x=$.inidb.exists("chatModerator","spamToggle")?$.getIniDbBoolean("chatModerator","spamToggle"):!0,M=$.inidb.exists("chatModerator","spamMessage")?$.inidb.get("chatModerator","spamMessage"):"you were timed out for spamming",I=$.inidb.exists("chatModerator","spamLimit")?parseInt($.inidb.get("chatModerator","spamLimit")):25,P=$.inidb.exists("chatModerator","symbolsToggle")?$.getIniDbBoolean("chatModerator","symbolsToggle"):!0,C=$.inidb.exists("chatModerator","symbolsMessage")?$.inidb.get("chatModerator","symbolsMessage"):"you were timed out for overusing symbols",T=$.inidb.exists("chatModerator","symbolsLimit")?parseInt($.inidb.get("chatModerator","symbolsLimit")):25,k=$.inidb.exists("chatModerator","symbolsTriggerLength")?parseInt($.inidb.get("chatModerator","symbolsTriggerLength")):5,q=$.inidb.exists("chatModerator","emotesToggle")?$.getIniDbBoolean("chatModerator","emotesToggle"):!1,L=$.inidb.exists("chatModerator","emotesMessage")?$.inidb.get("chatModerator","emotesMessage"):"you were timed out for overusing emotes",D=$.inidb.exists("chatModerator","emotesLimit")?parseInt($.inidb.get("chatModerator","emotesLimit")):30,_=$.inidb.exists("chatModerator","regularsToggle")?$.getIniDbBoolean("chatModerator","regularsToggle"):!1,B=$.inidb.exists("chatModerator","subscribersToggle")?$.getIniDbBoolean("chatModerator","subscribersToggle"):!0,S=$.inidb.exists("chatModerator","blacklistMessage")?$.inidb.get("chatModerator","blacklistMessage"):"you were timed out using a blacklisted phrase",j=$.inidb.exists("chatModerator","warningTime")?parseInt($.getIniDbBoolean("chatModerator","warningTime")):5,A=$.inidb.exists("chatModerator","timeoutTime")?parseInt($.inidb.get("chatModerator","timeoutTime")):600,N=$.inidb.exists("chatModerator","msgCooldownSec")?parseInt($.inidb.get("chatModerator","msgCooldownSec")):20,R="";$.bind("ircChannelMessage",function(e){var r,s=e.getSender(),o=e.getMessage();if(!$.isModv3(s,e.getTags())){for(r in c)if(o.contains(c[r]))return t(s,A),R="(timeout)",void i(s,S);for(r in d)if(d[r].equalsIgnoreCase(s)&&$.patternDetector.hasLinks(e))return void d.splice(r,1);if(u&&$.patternDetector.hasLinks(e)){for(r in h)if(o.contains(h[r]))return;if($.youtubePlayerConnected&&(o.contains("youtube.com")||o.contains("youtu.be")||o.contains("m.youtube.com")))return;if(_&&$.isReg(s))return;if(B&&$.isSubv3(s,e.getTags()))return;return a(s),void i(s,f)}if(b&&o.length()>v&&e.getCapsCount()>w)return a(s),void i(s,y);if(P&&o.length()>k&&$.patternDetector.getNumberOfNonLetters(e)>T)return a(s),void i(s,C);if(x&&$.patternDetector.getLongestRepeatedSequence(e)>I)return a(s),void i(s,M);q&&$.patternDetector.getNumberOfEmotes(e)>D&&(a(s),i(s,L))}}),$.bind("command",function(t){var a=t.getSender(),i=t.getCommand(),s=t.getArguments(),o=t.getArgs(),d=o[0],l=o[1];if(i.equalsIgnoreCase("permit"))return $.isModv3(a,t.getTags())?d?(n(d),void $.say($.username.resolve(d)+$.lang.get("chatmoderator.permited",p))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.permit.usage")):void $.say($.whisperPrefix(a)+$.modMsg);if(i.equalsIgnoreCase("blacklist")){if(!$.isAdmin(a))return void $.say($.whisperPrefix(a)+$.adminMsg);if(!d)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.usage"));if(d.equalsIgnoreCase("add")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.add.usage"));var m=s.replace(d,"").trim();$.inidb.set("blackList","phrase_"+c.length,m),c.push(m),$.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.added"))}if(d.equalsIgnoreCase("remove")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.remove.usage"));if(!$.inidb.exists("blackList","phrase_"+parseInt(l)))return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.err"));$.inidb.del("blackList","phrase_"+parseInt(l)),e(!0),$.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.removed"))}if(d.equalsIgnoreCase("show")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.show.usage"));if(!$.inidb.exists("blackList","phrase_"+parseInt(l)))return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.err"));$.say($.whisperPrefix(a)+$.inidb.get("blackList","phrase_"+parseInt(l)))}}if(i.equalsIgnoreCase("whiteList")){if(!$.isAdmin(a))return void $.say($.whisperPrefix(a)+$.adminMsg);if(!d)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.usage"));if(d.equalsIgnoreCase("add")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.add.usage"));var R=s.replace(d,"").trim();$.inidb.set("whiteList","link_"+h.length,R),h.push(R),$.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.link.added"))}if(d.equalsIgnoreCase("remove")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.remove.usage"));if(!$.inidb.exists("whiteList","link_"+parseInt(l)))return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.err"));$.inidb.del("whiteList","link_"+parseInt(l)),r(!0),$.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.removed"))}if(d.equalsIgnoreCase("show")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.whitelist.show.usage"));if(!$.inidb.exists("whiteList","link_"+parseInt(l)))return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.err"));$.say($.whisperPrefix(a)+$.inidb.get("whiteList","link_"+parseInt(l)))}}if(i.equalsIgnoreCase("moderation")||i.equalsIgnoreCase("mod")){if(!$.isAdmin(a))return void $.say($.whisperPrefix(a)+$.adminMsg);if(!d)return $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.usage.toggles")),$.say($.whisperPrefix(a)+$.lang.get("chatmoderator.usage.messages")),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.options"));if(d.equalsIgnoreCase("links")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.link.usage",g(u)));if(l.equalsIgnoreCase("on"))return u=!0,$.inidb.set("chatModerator","linksToggle",u),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.link.filter.enabled"));if(l.equalsIgnoreCase("off"))return u=!1,$.inidb.set("chatModerator","linksToggle",u),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.link.filter.disabled"))}if(d.equalsIgnoreCase("caps")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.usage",g(b)));if(l.equalsIgnoreCase("on"))return b=!0,$.inidb.set("chatModerator","capsToggle",b),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.filter.enabled"));if(l.equalsIgnoreCase("off"))return b=!1,$.inidb.set("chatModerator","capsToggle",b),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.filter.disabled"))}if(d.equalsIgnoreCase("spam")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.usage",g(x)));if(l.equalsIgnoreCase("on"))return x=!0,$.inidb.set("chatModerator","spamToggle",x),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.filter.enabled"));if(l.equalsIgnoreCase("off"))return x=!1,$.inidb.set("chatModerator","spamToggle",x),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.filter.disabled"))}if(d.equalsIgnoreCase("symbols")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.usage",g(P)));if(l.equalsIgnoreCase("on"))return P=!0,$.inidb.set("chatModerator","symbolsToggle",P),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.filter.enabled"));if(l.equalsIgnoreCase("off"))return P=!1,$.inidb.set("chatModerator","symbolsToggle",P),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.filter.disabled"))}if(d.equalsIgnoreCase("emotes")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.usage",g(q)));if(l.equalsIgnoreCase("on"))return q=!0,$.inidb.set("chatModerator","emotesToggle",q),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.filter.enabled"));if(l.equalsIgnoreCase("off"))return q=!1,$.inidb.set("chatModerator","symbolsToggle",q),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.filter.disabled"))}if(d.equalsIgnoreCase("regulars")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.regulars.usage"));if(l.equalsIgnoreCase("true"))return _=!0,$.inidb.set("chatModerator","regularsToggle",_),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.regulars.enabled"));if(l.equalsIgnoreCase("false"))return _=!1,$.inidb.set("chatModerator","regularsToggle",_),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.regulars.disabled"))}if(d.equalsIgnoreCase("subscribers")){if(!l)return void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.subscribers.usage"));if(l.equalsIgnoreCase("true"))return B=!0,$.inidb.set("chatModerator","subscribersToggle",B),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.subscribers.enabled"));if(l.equalsIgnoreCase("false"))return B=!1,$.inidb.set("chatModerator","subscribersToggle",B),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.subscribers.disabled"))}if(d.equalsIgnoreCase("linksmessage"))return l?(f=s.replace(d,"").trim(),$.inidb.set("chatModerator","linksMessage",f),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.link.message.set",f))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.link.message.usage"));if(d.equalsIgnoreCase("capsmessage"))return l?(y=s.replace(d,"").trim(),$.inidb.set("chatModerator","capsMessage",y),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.message.set",y))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.message.usage"));if(d.equalsIgnoreCase("symbolsmessage"))return l?(C=s.replace(d,"").trim(),$.inidb.set("chatModerator","symbolsMessage",C),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.message.set",C))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.message.usage"));if(d.equalsIgnoreCase("emotesmessage"))return l?(L=s.replace(d,"").trim(),$.inidb.set("chatModerator","emotesMessage",L),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.message.set",L))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.message.usage"));if(d.equalsIgnoreCase("spammessage"))return l?(M=s.replace(d,"").trim(),$.inidb.set("chatModerator","spamMessage",M),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.message.set",M))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.message.usage"));if(d.equalsIgnoreCase("blacklistmessage"))return l?(S=s.replace(d,"").trim(),$.inidb.set("chatModerator","blacklistMessage",S),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.message.set",S))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.blacklist.message.usage"));if(d.equalsIgnoreCase("permittime"))return l?(p=parseInt(l),$.inidb.set("chatModerator","linkPermitTime",p),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.permit.time.set",p))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.permit.time.usage"));if(d.equalsIgnoreCase("capslimit"))return l?(w=parseInt(l),$.inidb.set("chatModerator","capsLimit",w),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.limit.set",w))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.limit.usage"));if(d.equalsIgnoreCase("capstriggerlength"))return l?(v=parseInt(l),$.inidb.set("chatModerator","capsTriggerLength",v),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.trigger.length.set",w))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.caps.trigger.length.usage"));if(d.equalsIgnoreCase("spamlimit"))return l?(I=parseInt(l),$.inidb.set("chatModerator","spamLimit",I),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.limit.set",I))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.spam.limit.usage"));if(d.equalsIgnoreCase("symbolslimit"))return l?(T=parseInt(l),$.inidb.set("chatModerator","symbolsLimit",T),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.limit.set",T))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.limit.usage"));if(d.equalsIgnoreCase("symbolsTriggerLength"))return l?(k=parseInt(l),$.inidb.set("chatModerator","symbolsTriggerLength",k),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.trigger.length.set",k))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.symbols.trigger.length.usage"));if(d.equalsIgnoreCase("emoteslimit"))return l?(D=parseInt(l),$.inidb.set("chatModerator","emotesLimit",D),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.limit.set",D))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.emotes.limit.usage"));if(d.equalsIgnoreCase("timeouttime"))return l?(A=parseInt(l),$.inidb.set("chatModerator","timeoutTime",A),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.timeout.time.set",A))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.timeout.time.usage"));if(d.equalsIgnoreCase("warningtime"))return l?(j=parseInt(l),$.inidb.set("chatModerator","warningTime",j),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.warning.time.set",j))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.warning.time.usage"));if(d.equalsIgnoreCase("messagecooldown"))return l?(N=parseInt(l),$.inidb.set("chatModerator","msgCooldownSec",N),void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.mesgcooldown.set",N))):void $.say($.whisperPrefix(a)+$.lang.get("chatmoderator.mesgcooldown.usage"))}}),$.bind("initReady",function(){$.bot.isModuleEnabled("./core/chatmoderator.js")&&($.consoleLn("loading the link whitelist..."),r(!0),$.consoleLn("loading the blacklist..."),e(!0),$.registerChatCommand("./core/chatmoderator.js","permit",2),$.registerChatCommand("./core/chatmoderator.js","moderation",1),$.registerChatCommand("./core/chatmoderator.js","mod",1),$.registerChatCommand("./core/chatmoderator.js","blacklist",1),$.registerChatCommand("./core/chatmoderator.js","whitelist",1))}),$.timeoutUser=t,$.permitUserLink=n}();
