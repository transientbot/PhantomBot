/*
 * Copyright (C) 2017 phantombot.tv
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
package me.mast3rplan.phantombot.event.discord;

public class DiscordMessageEvent extends DiscordEvent {

    private final String message;
    private final String channelId;
    private final String messageId;
    private final Boolean isAdmin;

    public DiscordMessageEvent(String sender, String senderId, String discrim, String message, String messageId, String channel, String channelId, Boolean isAdmin) {
        super(sender, senderId, discrim, channel);

        this.message = message;
        this.messageId = messageId;
        this.channelId = channelId;
        this.isAdmin = isAdmin;
	}

    public String getMessage() {
        return this.message;
    }

    public String getMessageId() {
        return this.messageId;
    }

    public String getChannelId() {
        return this.channelId;
    }

    public Boolean isAdmin() {
        return this.isAdmin;
    }
}
