const { Command } = require('discord.js-commando');
const sql = require('sqlite');
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

	async run(msg, args) {
		const guild = msg.message.channel.guild.id;
		// Open raids database
        sql.open('./raid.sqlite');
        sql.get(`SELECT * FROM raids WHERE guild ="${guild}"`)
            .then(row => {
                console.log(row);
            });
        
        if(!args.query) {
            let rsp = 'Currently active raids:';
            return msg.say(rsp);
        } else {

        }
	}
};
