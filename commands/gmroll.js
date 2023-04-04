const { mjId, clientId, guildId, token } = require('../config.json');
const { Client, GatewayIntentBits, SlashCommandBuilder, IntentsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(token);

module.exports = {
	data : new SlashCommandBuilder()
		.setName('gmroll')
		.setDescription('Lance un dé au maître du jeu')
		.addStringOption(option =>
			option.setName('ndn')
				.setDescription('Nombre de dés et valeur des dés')
				.setRequired(true)),
	async execute(interaction) {
		const str = interaction.options.getString('ndn');
		var dé = 'D';
		if (str.includes('d')) {
			dé = 'd';
		}
		const [numDice, diceValue] = str.split(dé).map(x => parseInt(x));

		// Vérifier si les arguments sont valides
		if (isNaN(numDice) || isNaN(diceValue) || numDice < 1 || diceValue < 1) {
			await interaction.reply('Arguments invalides. La commande doit être au format /roll[nombre de dés]D[nombre de faces des dés]');
			return;
		}

		// Lancer les dés
		const rolls = [];
		for (let i = 0; i < numDice; i++) {
			rolls.push(Math.floor(Math.random() * diceValue) + 1);
		}

		try	{
			//const user = await client.users.fetch('211550239587434516');
			const user = interaction.user;
			if (numDice == 1) {
				user.send(`${interaction.user.username} rolled ${rolls.join(', ')} on ${str}`);
			} else {
				user.send(`${interaction.user.username} rolled ${rolls.reduce((a, b) => a + b, 0)} on ${str} (${rolls.join(', ')})`);
			}
			await interaction.reply({ content:"Message envoyé", ephemeral: true})
		} catch (error) {
			console.error(error);
		}
		
	}
};