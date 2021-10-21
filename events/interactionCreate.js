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
                        }
                    ]
                });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                return int.reply({ content: `Your ticket is open <@${int.member.id}> <#${channel.id}> ✅`, ephemeral: true });
            } else {
                return int.reply({ content: `You already have an open ticket <#${channel.id}> ❌`, ephemeral: true });
            }
        }
    }
};