const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
    if (!int.isButton()) return;

    console.log(int)

    switch (int.customId) {
        case 'newTicket': {
            const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

            if (!channel) {
                await int.guild.channels.create(`ticket-${int.member.id}`, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: int.member.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`Your ticket has been successfully created ${int.member.user.username} ✅`);
                ticketEmbed.setDescription('*To close the current ticket click on the reaction below, warning it is impossible to go back !*');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Close this ticket');
                closeButton.setCustomId('closeTicket');

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({ embeds: [ticketEmbed], components: [row] });

                return int.reply({ content: `Your ticket is open <@${int.member.id}> <#${channel.id}> ✅`, ephemeral: true });
            } else {
                return int.reply({ content: `You already have an open ticket <#${channel.id}> ❌`, ephemeral: true });
            }
        }

        case 'closeTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: int.member.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: client.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    }
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('RED');
            ticketEmbed.setAuthor(`${int.member.user.username} has decided to close this ticket ❌`);
            ticketEmbed.setDescription('*To permanently delete the ticket or to reopen the ticket click on the button below.*');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('Reopen this ticket');
            reopenButton.setCustomId('reopenTicket');

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('Delete this ticket');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }
    }
};