module.exports = {
    name: 'ping',

    execute(client, message) {
        message.channel.send(`Pong **${client.ws.ping}ms** 👋`);
    },
};