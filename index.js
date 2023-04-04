const fs = require('node:fs');
const path = require('node:path');
const { mjId, clientId, guildId, token } = require('./config.json');
const {Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
	partials: [Partials.Channel]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.error(`Commande ${file} invalide`);
	}
}

client.login(token);

client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async message => {
	if (message.author.id === mjId && message.content === 'stop') {
		await message.channel.send('Arrêt du bot');
		client.destroy();
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Commande ${interaction.commandName} inconnue`);
		return;
	}

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de la commande', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de la commande', ephemeral: true });
		}
	}
});
