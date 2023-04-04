const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data : new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Lance un dé')
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

		if (numDice == 1) {
			await interaction.reply(`${interaction.user.username} rolled ${rolls.join(', ')} on ${str}`);
		} else {
			await interaction.reply(`${interaction.user.username} rolled ${rolls.reduce((a, b) => a + b, 0)} on ${str} (${rolls.join(', ')})`);
		}
	}
};