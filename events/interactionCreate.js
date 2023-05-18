const { createWriteStream } = require('fs');
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require('discord.js');

module.exports = async (client, int) => {
    const req = int.customId.split('_')[0];

    client.emit('ticketsLogs', req, int.guild, int.member.user);

    switch (req) {
        case 'createTicket': {
            const selectMenu = new MessageSelectMenu();

            selectMenu.setCustomId('newTicket');
            selectMenu.setPlaceholder('Выберите причину для тикета');
            selectMenu.addOptions([
              {
                emoji: '💬', //можно заменить на любой свой эмодзи 
                label: 'Суд', //можно поменять навзание но при этом нужно будет заменить newTicket_(ваше название)
                description: 'Позвать судью',  //отображение в панели 
                value: 'newTicket_Суд',
              },
              {
                emoji: '💂', //можно заменить на любой свой эмодзи 
                label: 'Гвардия', //можно поменять навзание но при этом нужно будет заменить newTicket_(ваше название)
                description: 'Позвать гвардию',  //отображение в панели 
                value: 'newTicket_Гвардия',
              },
              {
                emoji: '🆘', //можно заменить на любой свой эмодзи 
                label: 'Помощь', //можно поменять навзание но при этом нужно будет заменить newTicket_(ваше название)
                description: 'Позвать администрацию',
                value: 'newTicket_Помощь', //читайте (//) в label 
              },
              {
                emoji: '💰', //можно заменить на любой свой эмодзи 
                label: 'Банк', //можно поменять навзание но при этом нужно будет заменить newTicket_(ваше название)
                description: 'Позвать банкира', //отображение в панели 
                value: 'newTicket_Банк', //читайте (//) в label 
                },
            ]);

            const row = new MessageActionRow().addComponents(selectMenu);

            return int.reply({ content: 'Какова  причина создания тикета?', components: [row], ephemeral: true });
        }

        case 'newTicket': {
          const roleMappings = {
            'newTicket_Суд': '924624970028548096', //замените на свои роли
            'newTicket_Гвардия': '1091083013946867787', //замените на свои роли
            'newTicket_Помощь': '996736764561604658', //замените на свои роли
            'newTicket_Банк': '1081290577066340484', //замените на свои роли
          };
          
          module.exports = async (client, int) => {
        
          };
          
      
            const reason = int.values[0].split('_')[1];
      
            const channel = int.guild.channels.cache.find((x) => x.name === `ticket-${int.member.id}`);
      
            if (!channel) {
              await int.guild.channels.create(`ticket-${int.member.id}`, {
                type: 'GUILD_TEXT',
                topic: `Ticket created by ${int.member.user.username}${
                  reason ? ` (${reason})` : ''
                } ${new Date(Date.now()).toLocaleString()}`,
                permissionOverwrites: [
                  {
                    id: int.guild.id,
                    deny: ['VIEW_CHANNEL'],
                  },
                  {
                    id: int.member.id,
                    allow: ['VIEW_CHANNEL'],
                  },
                  {
                    id: roleMappings[int.values[0]],
                    allow: ['VIEW_CHANNEL'],
                  },
                ],
              });

                const channel = int.guild.channels.cache.find(x => x.name === `ticket-${int.member.id}`);

                const ticketEmbed = new MessageEmbed();

                ticketEmbed.setColor('GREEN');
                ticketEmbed.setAuthor(`Ваш тикет был успешно создан ${int.member.user.username}${reason ? ` (${reason})` : ''} ✅`);
                ticketEmbed.setDescription('*Чтобы закрыть текущий тикет, нажмите на реакцию ниже, предупреждая, что вернуться назад невозможно!');

                const closeButton = new MessageButton();

                closeButton.setStyle('DANGER');
                closeButton.setLabel('Закрыть этот тикет');
                closeButton.setCustomId(`closeTicket_${int.member.id}`);

                const row = new MessageActionRow().addComponents(closeButton);

                await channel.send({ embeds: [ticketEmbed], components: [row] });

                return int.update({ content: `Ваш тикет был открыт <@${int.member.id}> <#${channel.id}> ✅`, components: [], ephemeral: true });
            } else {
                return int.update({ content: `У вас уже есть открытый тикет <#${channel.id}> ❌`, components: [], ephemeral: true });
            }
        }

        case 'closeTicket': {
          const channel = int.guild.channels.cache.get(int.channelId);
         
          await channel.edit({
            permissionOverwrites: [
              {
                id: int.guild.id,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: int.member.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: client.user,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '924624970028548096', //суд //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '996736764561604658', //помощь //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '1081290577066340484', //банк //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '1091083013946867787', //гвардия //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '996736764561604658', //модер //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id: '924747471643639878', //админ //замените на свои роли
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
            ],
          });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('RED');
            ticketEmbed.setAuthor(`${int.member.user.username} решил закрыть данный тикет ❌`);
            ticketEmbed.setDescription('*Для окончательного удаления тикета или его повтороного открытия нажмите на реакицю ниже.*');

            const reopenButton = new MessageButton();

            reopenButton.setStyle('SUCCESS');
            reopenButton.setLabel('Переоткрыть этот тикет');
            reopenButton.setCustomId(`reopenTicket_${int.customId.split('_')[1]}`);

            const saveButton = new MessageButton();

            saveButton.setStyle('SUCCESS');
            saveButton.setLabel('Сохранить этот тикет');
            saveButton.setCustomId(`saveTicket_${int.customId.split('_')[1]}`);

            const deleteButton = new MessageButton();

            deleteButton.setStyle('DANGER');
            deleteButton.setLabel('Удалить этот тикет');
            deleteButton.setCustomId('deleteTicket');

            const row = new MessageActionRow().addComponents(reopenButton, saveButton, deleteButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'reopenTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.edit({
              permissionOverwrites: [
                {
                  id: int.guild.id,
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: int.member.id,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: client.user,
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '924624970028548096', //суд //замените на свои роли
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '996736764561604658', //помощь //замените на свои роли
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '1081290577066340484', //банк //замените на свои роли
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '1091083013946867787', //гвардия //замените на свои роли
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '996736764561604658', //модер //замените на свои роли 
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '924747471643639878', //админ //замените на свои роли
                  deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                ]
            });

            const ticketEmbed = new MessageEmbed();

            ticketEmbed.setColor('GREEN');
            ticketEmbed.setAuthor(`"'Этот тикет был открыт заново'" ✅`);
            ticketEmbed.setDescription('*Чтобы закрыть текущий тикет, нажмите на реакцию ниже, предупреждая, что вернуться назад невозможно!');

            const closeButton = new MessageButton();

            closeButton.setStyle('DANGER');
            closeButton.setLabel('Close this ticket');
            closeButton.setCustomId(`closeTicket_${int.customId.split('_')[1]}`);

            const row = new MessageActionRow().addComponents(closeButton);

            return int.reply({ embeds: [ticketEmbed], components: [row] });
        }

        case 'deleteTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            return channel.delete();
        }

        case 'saveTicket': {
            const channel = int.guild.channels.cache.get(int.channelId);

            await channel.messages.fetch().then(async msg => {
                let messages = msg.filter(msg => msg.author.bot !== true).map(m => {
                    const date = new Date(m.createdTimestamp).toLocaleString();
                    const user = `${m.author.tag}${m.author.id === int.customId.split('_')[1] ? ' (ticket creator)' : ''}`;

                    return `${date} - ${user} : ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`;
                }).reverse().join('\n');

                if (messages.length < 1) messages = 'В этом тикете нет сообщений... странно';

                const ticketID = Date.now();

                const stream = await createWriteStream(`./data/${ticketID}.txt`);

                stream.once('open', () => {
                    stream.write(`User ticket ${int.customId.split('_')[1]} (channel #${channel.name})\n\n`);
                    stream.write(`${messages}\n\nLogs ${new Date(ticketID).toLocaleString()}`);

                    stream.end();
                });

                stream.on('finish', () => int.reply({ files: [`./data/${ticketID}.txt`] }));
            });
        }
    }

 client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand() || interaction.commandName !== 'tickets') {
      return;
    }
  
    const member = interaction.member;
  
    if (member.roles.cache.has('996736764561604658') || member.roles.cache.has('924747471643639878')) {
        // Пользователь имеет одну из нужных ролей, показываем все открытые тикеты
        const openTickets = await Ticket.findAll({ where: { resolved: false } });
      
        if (openTickets.length === 0) {
          return int.reply({ content: 'Открытых тикетов нет.', ephemeral: true });
        }
      
        const openTicketEmbeds = openTickets.map((ticket) => {
          // Формируем embed для каждого открытого тикета
          // ...
        });
      
        return int.reply({ embeds: openTicketEmbeds, ephemeral: true });
      }
      const userTickets = await Ticket.findAll({ where: { userId: member.id } });

      if (userTickets.length === 0) {
        return int.reply({ content: 'У вас нет открытых тикетов.', ephemeral: true });
      }
      
      const userTicketEmbeds = userTickets.map((ticket) => {
        // Формируем embed для каждого тикета, созданного пользователем
        // ...
      });
      
      return int.reply({ embeds: userTicketEmbeds, ephemeral: true });
    });   
}
