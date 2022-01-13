const { createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');




async function connectToChannel(VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: VoiceChannel.id,
		guildId: VoiceChannel.guild.id,
		adapterCreator: createDiscordJSAdapter(VoiceChannel),
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

async function execute(message, VoiceChannel) {
	console.log(VoiceChannel)
	await connectToChannel(VoiceChannel)
	console.log('adasdaqd')
	const player = createAudioPlayer();
	const resource = createAudioResource('/test.mp3');
	player.play(resource);
	// Subscribe the connection to the audio player (will play audio on the voice connection)
	const subscription = connection.subscribe(player);

	// subscription could be undefined if the connection is destroyed!
	if (subscription) {
		// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
		setTimeout(() => subscription.unsubscribe(), 5_000);
	}

}

module.exports = {
	execute,
}