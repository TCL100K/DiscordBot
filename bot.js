const Discord = require('discord.io')
const logger = require('winston')
const auth = require('./auth.json')
const commandRunner = require('./commandrunner')
const commands = require('./commands')

// CONFIG
const _prefix = 't!'

// DATA FOR COMMANDS
let data = {}

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})

logger.level = 'debug'

let bot = new Discord.Client({
    token: auth.token,
    autorun: true
})

bot.on('ready', (event) => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(bot.username + '.(' + bot.id + ')')

    commandRunner.initialize(bot)
    commandRunner.addCommands(commands, data)
})

bot.on('message', (user, userId, chanellId, message, event) => {
    if(message.length < 3)
        return

    let prefix = message.substring(0, 2)

    if(prefix !== _prefix)
        return

    let commandLine = message.substring(2, message.length)
    let parsedCommandLine = commandLine.split(" ")
    let command = parsedCommandLine[0]

    commandRunner.setMessageInfo(userId, chanellId)
    
    try {
        parsedCommandLine.shift()
        commandRunner.run(command, parsedCommandLine)
    } catch(e) {
        console.error(e)
    }
})