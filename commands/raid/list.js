const { Command } = require('discord.js-commando');
const sql = require('sqlite');
const moment = require('moment');
const config = require.main.require('./config.json');

module.exports = class AddNumbersCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list',
			aliases: [],
			group: 'raid',
			memberName: 'list',
			description: 'List on-going raids in this community',
			details: 'This command will list raids that have been recently spotted.',
			examples: [
                '!raids <city>',
                '!raids <pokemon>',
                '!raids kennewick',
				'!raids tyranitar',
			],
			args: [
				{
                    key: 'query',
                    default: '',
                    prompt: '',
					type: 'string',
					validate: text => {
						if(this.checkCfgVal(text, 'cities')) return true;
						if(this.checkCfgVal(text, 'pokemon')) return true;
					}
				},
			]
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
	

	formatList(rows) {
		// Init response
		let rsp = '';
		// Loop through results
		rows.forEach(row => {
			let remain = moment.utc(row.ctime).diff(moment(), 'minutes');
			console.log(remain);
			console.log(remain.length);
			remain = ' '.repeat(5-remain.toString().length) + remain;
			const city = row.city.substring(0, 12) + ' '.repeat(12-row.city.length);
			const pokemon = row.pokemon.substring(0, 14) + ' '.repeat(14-row.pokemon.length);
			const location = row.location;

			rsp += `\n${remain}m | ${city} | ${pokemon} | ${location}`;
		});
		return `**Currently active raids**\n\`\`\`${rsp}\`\`\``;
	}

	async run(msg, args) {
		const guild = msg.message.channel.guild.id;
        
        if(!args.query) {
			// Open raids database
			sql.open('./raid.sqlite').then(() => {
				// Select existing raids from this guild
				sql.all(`
					SELECT * FROM raids
					WHERE guild = "${guild}"
					AND ctime > datetime('now') 
					`)
				.then(rows => {
					msg.say(this.formatList(rows));
				});
			});
        } else {

        }
	}
};
