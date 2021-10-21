const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
    if (!int.isButton()) return;

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
    }
};