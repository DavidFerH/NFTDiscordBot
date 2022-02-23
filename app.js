const { Client, Intents, MessageActionRow, MessageButton, Message, MessageCollector, createMessageComponentCollector, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const mysql = require('mysql');
const { restart } = require('nodemon');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });

// // Create a new connection
// var conn = mysql.createConnection({
//     host: '192.168.0.241',
//     database: 'nftBot',
//     user: 'david',
//     password: '71185239d'
// });

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log(`Bot is ready as ${client.user.tag}`);
});

// client.on('messageCreate', message => {
//     // if (message.content === '!consulta') {
//     //     conn.connect();
//     //     conn.query('SELECT * FROM usuarios', function(error, results, fields) {
//     //     if (error) throw error;
//     //         results.forEach(result => {
//     //             message.channel.send(`${result['user']}`);
//     //             message.channel.send(`${result['wallet']}`);
//     //             console.log(result);
//     //         });
//     //     });
    
//     // }

//     if (message.content.includes(`!register`)) {
//         let splitedString = message.content.split(" ");
//         if (splitedString.length < 2 || splitedString.length > 2) {
//             console.log("La entrada de datos es erronea, pruebe de nuevo");
//         } else {
//             conn.connect();
    
//             let sql = "INSERT INTO usuarios (user, wallet) VALUES ?";
//             let values = [
//                 [`${message.author.tag}`, `${splitedString[1]}`]
//             ];
    
//             conn.query(sql, [values], (error) => {
//                 if (error) throw error;
//                 console.log("1 record inserted");
//             });
//         }
//     }

//     conn.end();
// });

client.on('messageCreate', async message => {

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
                await console.log(i);

                if (i.customId === 'accept') {
                    await i.deferUpdate();
                    i.editReply({ content: `Registrado el usuario ${message.author.tag} con wallet ${splitedString[1]}`, components: []});
                }
            });
        }
	}
});


// client.on('messageCreate', message => {
//     console.log(message.author.tag + " dijo " + message.content);
// });

// client.on('messageCreate', message => {
//     if (message.content === 'ping') {
//         message.reply('pong');
//     }

//     if (message.content === 'Hola') {
//         message.channel.send(`Hola ${message.author.tag}`);
//         console.log(message);
//     }

//     if (message.content === `!contact ${message.author.tag}` && message.author.tag !== 'Bot#3247') {
//         message.channel.send("Hola");
//     } else if (message.author.tag !== 'Bot#3247'){
//         message.channel.send("No se pudo encontrar al usuario");
//     }
// });

// Login to Discord with your client's token
client.login(token);