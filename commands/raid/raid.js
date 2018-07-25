const { Command } = require('discord.js-commando');
const sql = require('sqlite');

const config = require.main.require('./config.json');

module.exports = class AddNumbersCommand extends Command {
	constructor(client) {
		// Define command params
		super(client, {
			name: 'raid',
			aliases: ['raid'],
			group: 'raid',
			memberName: 'raid',
			description: 'Announce a raid',
			details: 'This command will broadcast a new raid to members who have subscribed to announcments matching the raid details.',
			examples: [
				'!raid <city> <pokemon> <minutes-remaining> <description>',
				'!raid kennewick tyranitar 30 union library',
				'!raid richland kirlia 20 howard amon park'
			],
			guildOnly: true,
			args: [
				{
					key: 'city',
					prompt: 'What city is the raid in, [K] Kennewick, [R] Richland, [WR] West-Richland, [P] asco, or [B] Benton City?',
					type: 'string',
					validate: text => {
						return this.checkCfgVal(text, 'cities');
					}
				},
				{
					key: 'pokemon',
					prompt: 'What Pokemon is the raid for?',
					type: 'string',
					validate: text => {
						return this.checkCfgVal(text, 'pokemon');
					}
				},
				{
					key: 'time',
					prompt: 'How long until the raid expires (in minutes)?',
					type: 'integer',
					max: 60,
					min: 5,
					validate: text => {
						return Number.isInteger(parseInt(text));
					}
				},
				{
					key: 'location',
					prompt: 'Where is this raid located?',
					type: 'string'
				}
			]
		});
	}
	
	// Main command execution
	async run(msg, args) {
		// Format output
		const city = this.checkCfgVal(args.city, 'cities', true);
		const pokemon = this.checkCfgVal(args.pokemon, 'pokemon', true);
		const time = parseInt(args.time);
		
		const location = args.location;
		const guild = msg.message.channel.guild.id;

		// Open raids database
		sql.open('./raid.sqlite');
		// Check if table for this server exists
		sql.run(`CREATE TABLE IF NOT EXISTS raids (guild TEXT, userId TEXT, city TEXT, pokemon TEXT, ctime DATETIME, location TEXT)`)
			.then(() => {
				// Insert new raid to table
				sql.run(`INSERT INTO raids (guild, userId, city, pokemon, ctime, location) VALUES (?, ?, ?, ?, datetime('now','+${time} minutes'), ?)`, [guild, msg.author.id, city, pokemon, location])
				.then(() => {
					// Respond to user
					const rsp = `Ok, I've created a **${pokemon}** raid in **${city}** ending in ${time} minutes.\nLocation: ${location}`;
					return msg.say(rsp);
				})
				.catch(() => {
					console.error;
					return msg.say('Oops, something went wrong.');
				});
			})
			.catch(() => {
				console.error;
				return msg.say('Oops, something went wrong.');
			});
		



	}



	// Function to lookup inputs against city/pokemon db
	checkCfgVal(input, lookupArray, returnPrefVal = false) {
		for(let i = 0; i <  config[lookupArray].length; i++) {
			for(let j = 0; j < config[lookupArray][i].length; j++) {
				if (config[lookupArray][i][j].toLowerCase().trim() === input.toLowerCase().trim()) {
					if (returnPrefVal) return config[lookupArray][i][0];
					return true;
				}
			}
		}
		return false;
	}
};
