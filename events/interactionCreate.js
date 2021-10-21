module.exports = (client, int) => {
    if (!int.isButton()) return;

    switch (int.customId) {
        case 'newTicket': {
            return int.reply({ content: `Your ticket is open <@${int.member.id}> ✅`, ephemeral: true });
        }
    }
};