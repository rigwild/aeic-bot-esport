require('dotenv-safe').config()
const Discord = require('discord.js')

const bot = new Discord.Client()
bot.login(process.env.AEIC_ESPORT_BOT_TOKEN)

bot.on('ready', () => {
  const guild = bot.guilds.find(x => x.name === 'AEIC - Esport')
  if (!guild) throw new Error('Le serveur AEIC - Esport n\'a pas été trouvé, vérifiez que le bot est bien ajouté au serveur.')
  guild.channels.find(x => x.name === 'roles').fetchMessages({ limit: 10 })
  console.log('Bot Connecté')
})

const rolesList = {
  'game_Overwatch': 'Overwatch',
  'game_LoL': 'LoL',
  'game_CSGO': 'CSGO',
  'game_Hearthstone': 'Hearthstone',
  'game_RocketLeague': 'RocketLeague',
  'game_Fortnite': 'Fortnite',
  'game_SSBU': 'SSBU',
  'game_Apex': 'Apex',
  'game_Minecraft': 'Minecraft'
}

bot.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channel.name === 'roles' && reaction.emoji.name && rolesList.hasOwnProperty(reaction.emoji.name)) {
    const guild = bot.guilds.find(x => x.name === 'AEIC - Esport')
    const role = guild.roles.find(x => x.name === rolesList[reaction.emoji.name])
    guild.members.get(user.id).addRole(role)
      .then(() => console.log(`Ajout du role '${role.name}' à ${user.username} (ID=${user.id}).`))
      .catch(err => console.error(`Erreur lors de l'ajout du role '${role.name}' à ${user.username} (ID=${user.id}).`, err))
  }
})

bot.on('messageReactionRemove', (reaction, user) => {
  if (reaction.message.channel.name === 'roles' && reaction.emoji.name && rolesList.hasOwnProperty(reaction.emoji.name)) {
    const guild = bot.guilds.find(x => x.name === 'AEIC - Esport')
    const role = guild.roles.find(x => x.name === rolesList[reaction.emoji.name])
    guild.members.get(user.id).removeRole(role)
      .then(() => console.log(`Retrait du role '${role.name}' à ${user.username} (ID=${user.id}).`))
      .catch(err => console.error(`Erreur lors du retrait du role '${role.name}' à ${user.username} (ID=${user.id}).`, err))
  }
})
