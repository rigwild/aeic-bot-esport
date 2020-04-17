// @ts-check

require('dotenv-safe').config()
const Discord = require('discord.js')

const bot = new Discord.Client()
bot.login(process.env.AEIC_ESPORT_BOT_TOKEN)

const serverId = '515994848893992978'
/** @type {import('discord.js').Guild} */
let guildObj = null
/** @type {import('discord.js').TextChannel} */
let logChannelObj = null

const logger = {
  info: msg => logChannelObj.send(msg),
  error: (msg, err) => logChannelObj.send(`${msg}\n\`\`\`\n${err.message}\n${err.stack}\`\`\``)
}

/** @param {'add'|'remove'} action */
const roleAction = action => (reaction, user) => {
  if (reaction.message.channel.name !== 'roles' || !reaction.emoji.name || !reaction.emoji.name.startsWith('game_'))
    return

  const selectedRole = reaction.emoji.name.split('game_')[1]
  const role = guildObj.roles.find(x => x.name === selectedRole)

  const member = guildObj.members.get(user.id)
  if (action === 'add')
    member
      .addRole(role)
      .then(() => logger.info(`Added role "${role.name}" to <@${user.id}> (${user.username}).`))
      .catch(err => logger.error(`Error adding role "${role.name}" to <@${user.id}> (${user.username}).`, err))
  else if (action === 'remove')
    member
      .removeRole(role)
      .then(() => logger.info(`Removed role "${role.name}" from <@${user.id}> (${user.username}).`))
      .catch(err => logger.error(`Error removing role "${role.name}" from <@${user.id}> (${user.username}).`, err))
}

bot.on('ready', () => {
  guildObj = bot.guilds.get(serverId)
  logChannelObj = guildObj.channels.find(x => x.name === 'aeic-bot-log')
  if (!guildObj)
    throw new Error(
      `Le serveur AEIC - Esport (id=${serverId}) n\'a pas été trouvé, vérifiez que le bot est bien ajouté au serveur.`
    )

  guildObj.channels.find(x => x.name === 'roles').fetchMessages({ limit: 10 })
  console.log('Bot is ready.')
})

bot.on('messageReactionAdd', roleAction('add'))
bot.on('messageReactionRemove', roleAction('remove'))
