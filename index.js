// Load config.json
const config = require('./config.json');

// Libs
const path = require('path');
const Commando = require('discord.js-commando');
const sqlite = require('sqlite');

// Init discord.js
const client = new Commando.Client({
    commandPrefix: config.prefix,
    owner: config.owner,
    disableEveryone: true,
});

// Register commands
client.registry
    // Registers your custom command groups
    .registerGroups([
        ['trade', 'Trading system commands'],
        ['raid', 'Raid alert commands'],
    ])

    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        prefix: false,
        ping: false,
    })

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));


client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);


// On startup
client.on('ready', () => {
    console.log('Klink is here. Beep Boop.');
    client.user.setActivity('Global Thermonuclear War');
});

// On incomming message
client.on('message', message => {

});

// Init session
client.login(config.token);