/*
 * Copyright (C) 2016 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @author IllusionaryOne
 */

/*
 * dashboardPanel.js
 * Drives the Dashboard Panel
 */
(function() {

    var streamOnline = false,
        whisperMode = false,
        responseMode = false,
        meMode = false,
        amountCheck = false,
        pauseMode = false,
        toutGraphData = [],
        chatGraphData = [],
        loggingMode = false,
        modeIcon = [],
        settingIcon = [];
        gameTitle = '__not_loaded__';

        modeIcon['false'] = "<i style=\"color: #6136b1\" class=\"fa fa-circle-o\" />";
        modeIcon['true'] = "<i style=\"color: #6136b1\" class=\"fa fa-circle\" />";

        settingIcon['false'] = "<i class=\"fa fa-circle-o\" />";
        settingIcon['true'] = "<i class=\"fa fa-circle\" />";


    /*
     * @function onMessage
     * This event is generated by the connection (WebSocket) object.
     */
    function onMessage(message) {
        var msgObject;

        try {
            msgObject = JSON.parse(message.data);
        } catch (ex) {
            return;
        }

        if (panelHasQuery(msgObject)) {
            if (panelMatch(msgObject['query_id'], 'dashboard_highlights')) {
                var htmlStr = "";
                for (var i in msgObject['results']) {
                    var highlightData = msgObject['results'][i]['value'];
                    htmlStr += highlightData + " @ " + msgObject['results'][i]['key'] + "<br>";
                }
                if (htmlStr.length == 0) {
                    $("#showHighlights").html("No Highlights Found");
                } else {
                    $("#showHighlights").html(htmlStr);
                }
            }

            if (panelCheckQuery(msgObject, 'dashboard_modules')) {
                var html = "<table>",
                    moduleData = msgObject['results'];
                    module = "",
                    moduleEnabled = "";

                $.disablePanels(moduleData);

                moduleData.sort(sortModuleNames);
                for (idx in moduleData) {
                    module = moduleData[idx]['key'];
                    moduleEnabled = moduleData[idx]['value'];
                    if (module.indexOf('/core/') === -1 && module.indexOf('/lang/') === -1) {
                        html += "<tr class=\"textList\">" +
                                "    <td>" + module + "</td>" +

                                "    <td style=\"width: 25px\">" +
                                "        <div id=\"moduleStatus_" + idx + "\">" + modeIcon[moduleEnabled] + "</div>" +
                                "    </td>" +

                                "    <td style=\"width: 25px\">" +
                                "        <div data-toggle=\"tooltip\" title=\"Enable\" class=\"button\"" +
                                "             onclick=\"$.enableModule('" + module + "', " + idx + ")\">" + settingIcon['true'] +
                                "        </div>" +
                                "    </td>" +

                                "    <td style=\"width: 25px\">" +
                                "        <div data-toggle=\"tooltip\" title=\"Disable\" class=\"button\"" +
                                "             onclick=\"$.disableModule('" + module + "', " + idx + ")\">" + settingIcon['false'] +
                                "        </div>" +
                                "    </td>" +
                                "</tr>";
                    }
                }
                html += "</table>";
                $("#modulesList").html(html);
                $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
            }

            if (panelCheckQuery(msgObject, 'dashboard_chatCount')) {
                var chatDate = "",
                    chatKey = "",
                    chatCount = "";

                chatGraphData = [];
                for (var i = 0, j = 5; i <= 4; i++, j--) {
                    var dateObj = new Date();
                    chatDate = $.format.date(Date.now() - (i * 24 * 36e5), "MM.dd.yy");
                    chatKey = "chat_" + chatDate;
                    chatCount = "0";
                    for (idx in msgObject['results']) {
                        if (panelMatch(msgObject['results'][idx]['key'], chatKey)) {
                            chatCount = msgObject['results'][idx]['value'];
                            break;
                        }
                    }
                    $("#chatDate-" + i).html("<span class=\"purplePill\">Date: " + chatDate + "</span>");
                    $("#chatCount-" + i).html("<span class=\"bluePill\">Chat Count: " + chatCount + "</span>");
                    chatGraphData.push([ j, chatCount ]);
                }
            }

            if (panelCheckQuery(msgObject, 'dashboard_modCount')) {
                var modDate = "",
                    modKey = "",
                    modCount = "";

                toutGraphData = [];
                for (var i = 0, j = 5; i <= 4; i++, j--) {
                    var dateObj = new Date();
                    modDate = $.format.date(Date.now() - (i * 24 * 36e5), "MM.dd.yy");
                    modKey = "mod_" + modDate;
                    modCount = "0";
                    for (idx in msgObject['results']) {
                        if (panelMatch(msgObject['results'][idx]['key'], modKey)) {
                            modCount = msgObject['results'][idx]['value'];
                            break;
                        }
                    }
                    $("#modCount-" + i).html("<span style=\"width: 120px\" class=\"redPill\">Timeouts: " + modCount + "</span>");
                    toutGraphData.push([ j, modCount ]);
                }

            }
            if (toutGraphData.length > 0 && chatGraphData.length > 0) {
                $.plot($("#panelStatsGraph"),
                           [
                               { data: chatGraphData, lines: { show: true }, color: "#4444ff" },
                               { data: toutGraphData, lines: { show: true }, color: "#ff4444" }
                           ],
                           { xaxis: { show: false }, yaxis: { show: false }
                       });
            }

            if (panelCheckQuery(msgObject, 'dashboard_panelStatsEnabled')) {
                if (panelMatch(msgObject['results']['enabled'], 'true')) {
                    if (!panelStatsEnabled) {
                        panelStatsEnabled = true;
                        doQuery(); // Run the query again to populate fields.
                    }
                } else {
                    $("#panelStatsEnabled").html("<span>Panel Stats are Disabled</span>");
                }
            }

            if (panelCheckQuery(msgObject, 'dashboard_streamTitle')) {
                if (msgObject['results']['title'] === undefined || msgObject['results']['title'] === null) {
                    $('#streamTitleInput').attr('placeholder', 'Title').blur();
                } else {
                    $('#streamTitleInput').attr('placeholder', msgObject['results']['title']).blur();
                }
            }
 
            if (panelCheckQuery(msgObject, 'dashboard_gameTitle')) {
                gameTitle = msgObject['results']['game'];
                if (gameTitle === undefined || gameTitle === null) {
                    gameTitle = "Game";
                }
                $('#gameTitleInput').attr('placeholder', gameTitle).blur();
                sendDBQuery("dashboard_deathctr", "deaths", gameTitle);
            }
 
            if (panelCheckQuery(msgObject, 'dashboard_loggingMode')) {
                loggingMode = (panelMatch(msgObject['results']['loggingEnabled'], 'true'));
                $("#loggingMode").html(modeIcon[loggingMode]);
            }

            if (panelCheckQuery(msgObject, 'dashboard_deathctr')) {
                var amount = sendDBQuery("dashboard_deathctr", "deaths", gameTitle);
                if (gameTitle === undefined || gameTitle === null || amount === null || amount === undefined || amount === 0) {
                    $("#deathCounterValue").html("0");
                }
                $("#deathCounterValue").html(msgObject['results'][gameTitle]);
            }

            if (panelCheckQuery(msgObject, 'dashboard_dsChannels')) {
                if (msgObject['results']['otherChannels'] !== undefined && msgObject['results']['otherChannels'] !== null) {
                    $('#multiLinkInput').attr('placeholder', msgObject['results']['otherChannels'].replace(/\//g, ' '));
                } else {
                    $('#multiLinkInput').attr('placeholder', 'Channel-1 Channel-2');
                }
            }

            if (panelCheckQuery(msgObject, 'dashboard_dsInterval')) {
                if (msgObject['results']['timerInterval'] !== undefined && msgObject['results']['timerInterval'] !== null) {
                    $('#multiLinkTimerInput').attr('placeholder', msgObject['results']['timerInterval']);
                } else {
                    $('#multiLinkTimerInput').attr('placeholder', 'Minutes');
                }
            }

            if (panelCheckQuery(msgObject, 'dashboard_dsReqMsgs')) {
                if (msgObject['results']['reqMessages'] !== undefined && msgObject['results']['reqMessages'] !== null) {
                    $('#multiLinkReqMsgsInput').attr('placeholder', msgObject['results']['reqMessages']);
                } else {
                    $('#multiLinkReqMsgsInput').attr('placeholder', 'Message Count');
                }
            }
        }
    }

    /**
     * @function doQuery
     */
    function doQuery() {
        sendDBQuery("dashboard_streamTitle", "streamInfo", "title");
        sendDBQuery("dashboard_gameTitle", "streamInfo", "game");
        sendDBQuery("dashboard_loggingMode", "settings", "loggingEnabled");
        sendDBQuery("dashboard_dsChannels", "dualStreamCommand", "otherChannels");
        sendDBQuery("dashboard_dsInterval", "dualStreamCommand", "timerInterval");
        sendDBQuery("dashboard_dsReqMsgs", "dualStreamCommand", "reqMessages");
        sendDBQuery("dashboard_deathctr", "deaths", gameTitle);
        sendDBKeys("dashboard_highlights", "highlights");
        sendDBKeys("dashboard_modules", "modules");

        if (!panelStatsEnabled) {
            sendDBQuery("dashboard_panelStatsEnabled", "panelstats", "enabled");
        } else {
            sendDBKeys("dashboard_chatCount", "panelchatstats");
            sendDBKeys("dashboard_modCount", "panelmodstats");
        }
    }

    /**
     * @function adjustDeathCounter
     * @param {String} action
     */
    function adjustDeathCounter(action) {
        if (panelMatch(gameTitle, '__not_loaded__')) {
            return;
        }
        $('#deathCounterValue').html('<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />');
        sendCommand('deathctr ' + action);
        sendDBQuery("dashboard_deathctr", "deaths", gameTitle);
    }

    /**
     * @function sortModuleNames
     */
    function sortModuleNames(a, b) {
        return panelStrcmp(a.key, b.key);
    }

    /** 
     * @function enableModule
     * @param {String} module
     */
    function enableModule(module, idx) {
        $("#moduleStatus_" + idx).html("<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />");
        sendCommand("module enable " + module);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function disableModule
     * @param {String} module
     */
    function disableModule(module, idx) {
        $("#moduleStatus_" + idx).html("<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />");
        sendCommand("module disable " + module);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function changeLoggingStatus
     * @param {String} mode
     */
    function changeLoggingStatus(mode) {
        $("#loggingMode").html("<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />");
        sendCommand("log " + mode);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function toggleCommand
     */
    function toggleCommand(command)
    {
        if (panelMatch(command, 'pausecommands')) {
            if ($.globalPauseMode) {
                command += " clear";
            } else {
                command += " 300";
            }
        }
        sendCommand(command);
        setTimeout(function() { $.globalDoQuery(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function setStreamTitle
     */
    function setStreamTitle() {
        var newTitle = $("#streamTitleInput").val();
        if (newTitle.length > 0) {
            sendCommand("title " + newTitle);
            $("#streamTitleInput").val('')
            $("#streamTitleInput").attr("placeholder", newTitle).blur();
        }
    }

    /**
     * @function setGameTitle
     */
    function setGameTitle() {
        var newGame = $("#gameTitleInput").val();
        if (newGame.length > 0) {
            sendCommand("game " + newGame);
            $("#gameTitleInput").val('')
            $("#gameTitleInput").attr("placeholder", newGame).blur();
            gameTitle = newGame;
        }
    }

    /**
     * @function chatReconnect
     */
    function chatReconnect() {
        sendCommand("reconnect");
    }

    /**
     * @function setHighlight
     */
    function setHighlight() {
        $("#showHighlights").html("<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />");
        sendCommand("highlight " + $("#highlightInput").val());
        $("#highlightInput").val('');
        setTimeout(function() { sendDBKeys("dashboard_highlights", "highlights"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function clearHighlights
     */
    function clearHighlights() {
        $("#showHighlights").html("<i style=\"color: #6136b1\" class=\"fa fa-spinner fa-spin\" />");
        sendCommand("clearhighlights");
        setTimeout(function() { sendDBKeys("dashboard_highlights", "highlights"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function setMultiLink
     */
    function setMultiLink(tagId, tableKey) {
        var newValue = $(tagId).val();
        if (newValue.length > 0) {
            sendDBUpdate('multiLinkInput', 'dualStreamCommand', tableKey, '/' + newValue.replace(/\s+/g, '/'));
            $(tagId).val('')
            $(tagId).attr("placeholder", newValue).blur();
            setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
            setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
        }
    }
    
    /**
     * @function setMultiLinkTimer
     */
    function setMultiLinkTimer(tagId, tableKey) {
        var newValue = $(tagId).val();
        if (parseInt(newValue) >= 5 && newValue.length > 0) {
            sendDBUpdate("multiLinkTimerInput", "dualStreamCommand", tableKey, newValue);
            $(tagId).val('')
            $(tagId).attr("placeholder", newValue).blur();
            setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
            setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
        }
    }

    /**
     * @function setMultiReqMsgs
     */
    function setMultiReqMsgs(tagId, tableKey) {
        var newValue = $(tagId).val();
        if (newValue.length > 0) {
            sendDBUpdate("multiLinkReqMsgsInput", "dualStreamCommand", tableKey, newValue);
            $(tagId).val('')
            $(tagId).attr("placeholder", newValue).blur();
            setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
            setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
        }
    }

    /**
     * @function clearMultiLink
     */
    function clearMultiLink() {
        sendDBUpdate("multiLinkClear", "dualStreamCommand", "otherChannels", "Channel-1 Channel-2");
        sendDBUpdate("multiLinkClear", "dualStreamCommand", "timerToggle", "false");
        setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
    }
 
    /**
     * @function multiLinkTimerOn
     */
    function multiLinkTimerOn() {
        $('#multiStatus').html('<span class="purplePill" data-toggle="tooltip" title="Multi-Link Enabled"><i class=\"fa fa-link fa-lg\" /></span>');
        $('[data-toggle="tooltip"]').tooltip();
        sendDBUpdate("multiLinkClear", "dualStreamCommand", "timerToggle", "true");
        setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
    }
 
    /**
     * @function multiLinkTimerOff
     */
    function multiLinkTimerOff() {
        $('#multiStatus').html('');
        sendDBUpdate("multiLinkClear", "dualStreamCommand", "timerToggle", "false");
        setTimeout(function() { sendCommand("reloadmulti"); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME * 2);
    }

    /**
     * @function shoutOut
     */
    function shoutOut() {
        if ($('#shoutOutInput').val().length > 0) {
            sendCommand('shoutout ' + $('#shoutOutInput').val());
            $('#shoutOutInput').val('');
        }
    }

    /**
     * @function toggleTwitchChat
     */
    function toggleTwitchChat() {
        if ($("#chatsidebar").is(":visible")) {
            $("#chatsidebar").fadeOut(1000);
        } else {
            $("#chatsidebar").fadeIn(1000);
        }
    }

    /**
     * @function toggleTwitchChatRollup
     */
    function toggleTwitchChatRollup() {
        if ($("#chat").is(":visible")) {
            $(function() { $("#chatsidebar").resizable('disable'); });
            $("#chat").fadeOut(1000);
        } else {
            $("#chat").fadeIn(1000);
            $(function() { $("#chatsidebar").resizable('enable'); });
        }

    }
 
    // Import the HTML file for this panel.
    $("#dashboardPanel").load("/panel/dashboard.html");

    // Load the DB items for this panel, wait to ensure that we are connected.
    var interval = setInterval(function() {
        if (isConnected && TABS_INITIALIZED) {
            var active = $("#tabs").tabs("option", "active");
            if (active == 0) {
                doQuery();
                clearInterval(interval);
            }
        }
    }, INITIAL_WAIT_TIME);

    // Query the DB every 30 seconds for updates.
    setInterval(function() {
        var active = $("#tabs").tabs("option", "active");
        if (active == 0 && isConnected) {
            newPanelAlert('Refreshing Dashboard Data', 'success', 1000);
            doQuery();
        }
    }, 3e4);

    // Export functions - Needed when calling from HTML.
    $.dashboardOnMessage = onMessage;
    $.setStreamTitle = setStreamTitle;
    $.setGameTitle = setGameTitle;
    $.chatReconnect = chatReconnect;
    $.setHighlight = setHighlight;
    $.clearHighlights = clearHighlights;
    $.setMultiLink = setMultiLink;
    $.setMultiLinkTimer = setMultiLinkTimer;
    $.setMultiReqMsgs = setMultiReqMsgs;
    $.clearMultiLink = clearMultiLink;
    $.multiLinkTimerOn = multiLinkTimerOn;
    $.multiLinkTimerOff = multiLinkTimerOff;
    $.toggleCommand = toggleCommand;
    $.toggleTwitchChat = toggleTwitchChat;
    $.toggleTwitchChatRollup = toggleTwitchChatRollup;
    $.changeLoggingStatus = changeLoggingStatus;
    $.enableModule = enableModule;
    $.disableModule = disableModule;
    $.adjustDeathCounter = adjustDeathCounter;
    $.shoutOut = shoutOut;
})();
