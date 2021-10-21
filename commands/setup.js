const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'setup',

    execute(client, message) {
        const setupEmbed = new MessageEmbed();

        setupEmbed.setColor('GREEN');
        setupEmbed.setAuthor('Tickets system\nTo create a ticket click on the reaction below 🤝');
        setupEmbed.setDescription('*A new channel will be created for you to talk with the team members !*');

        const ticketButton = new MessageButton();

        ticketButton.setStyle('SUCCESS');
        ticketButton.setLabel('Open a ticket');
        ticketButton.setCustomId('newTicket');

        const row = new MessageActionRow().addComponents(ticketButton);

        message.channel.send({ embeds: [setupEmbed], components: [row] });
    },
};