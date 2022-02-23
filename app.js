const { Client, Intents, MessageActionRow, MessageButton, Message, MessageCollector, createMessageComponentCollector, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const mysql = require('mysql');
const { restart } = require('nodemon');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });

// Create a new connection
var conn = mysql.createConnection({
    host: '192.168.0.241',
    database: 'nftBot',
    user: 'david',
    password: 'Password1234'
});

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log(`Bot is ready as ${client.user.tag}`);
});

client.on('messageCreate', async message => {

    if (message.content === '!consulta') {

        conn.connect();

        conn.query('SELECT * FROM usuarios', function(error, results, fields) {

        if (error) throw error;
            results.forEach(result => {
                message.channel.send(`${result['user']}`);
                message.channel.send(`${result['wallet']}`);
                console.log(result);
            });

        });

        conn.end();
    
    }

	if (message.content.includes('!register')) {

        let splitedString = message.content.split(" ");

        if (splitedString.length < 2 || splitedString.length > 2) {

            message.channel.send("La entrada de datos es erronea, pruebe de nuevo");

        } else {

            const row = new MessageActionRow()
            .addComponents(
            [new MessageButton()
            .setCustomId('accept')
            .setLabel('✅ Accept')
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('decline')
            .setLabel('❌ Decline')
            .setStyle('DANGER')]
            );

            const m = await message.channel.send({content:'Botón de prueba', components:[row]});

            const ifilter = i => i.user.id === message.author.id;

            const collector = m.createMessageComponentCollector({ filter: ifilter, time:  1000000});

            collector.on('collect', async i => {

                if (i.customId === 'accept') {

                    conn.connect();

                    let sql = "INSERT INTO usuarios (user, wallet) VALUES ?";
                    let values = [
                        [`${message.author.tag}`, `${splitedString[1]}`]
                    ];
            
                    conn.query(sql, [values], (error) => {

                        if (error) throw error;
                        console.log(`Registrado el usuario ${message.author.tag} con wallet ${splitedString[1]}`);

                    });

                    conn.end();

                    await i.deferUpdate();
                    i.editReply({ content: `Registrado el usuario ${message.author.tag} con wallet ${splitedString[1]}`, components: []});

                }
            });

        }
	}
});

client.login(token);