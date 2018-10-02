// Libraries
const Discord = require('discord.io')
const logger = require('winston')

// Auth token file
const auth = require('./auth.json')

// Command Runner
const commandRunner = require('./commandrunner')

// Command Instances
const commands = require('./commands')

// Prefix to accept command
const _prefix = 't!'

// Data to being passed to the commands at initialization
let data = {}

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})

logger.level = 'debug'

// Discord Bot Client Instance
let bot = new Discord.Client({
    token: auth.token,
    autorun: true
})

bot.on('ready', (event) => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(bot.username + '.(' + bot.id + ')')

    // Initialize the command runner passing bot instance to be accessed for commands
    commandRunner.initialize(bot)

    // Pass command to command runner and data
    commandRunner.addCommands(commands, data)
})

// Attach message event
bot.on('message', (user, userId, chanellId, message, event) => {
    if(message.length < 3)
        return

    let prefix = message.substring(0, 2)

    // Check the message prefix
    if(prefix !== _prefix)
        return

    let commandLine = message.substring(2, message.length)
    let parsedCommandLine = commandLine.split(" ")
    let command = parsedCommandLine[0]
    let wrongCommands = ['initialize', 'bot', 'sendMessage', 'data']

    if(wrongCommands.find((element) => { return element === command }) !== undefined)
        return

    // Pass the message info to command runner
    commandRunner.setMessageInfo(userId, chanellId)
    
    try {
        // Remove command from parsed line
        parsedCommandLine.shift()

        // Execute the command
        commandRunner.run(command, parsedCommandLine)
    } catch(e) {
        console.error(e)
    }
})