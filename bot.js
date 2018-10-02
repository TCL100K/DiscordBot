const Discord = require('discord.io')
const logger = require('winston')
const auth = require('./auth.json')

// DATA FOR BOT
let data = {
    usdToArs: 39.0,
    valorHora: undefined,
    hourPerDay: undefined,
    projectTime: {
        eCommerce: {
            
        }
    }
}

let commands = {
    bot: null,

    initialize(bot) {
        this.bot = bot
        this.commandInstances.bot = this.bot
    },

    setMessageInfo(userId, chanellId) {
        this.commandInstances.userId = userId
        this.commandInstances.chanellId = chanellId
    },

    commandExists(command) {
        return this.commandInstances.hasOwnProperty(command)
    },

    run(command, args) {
        if(this.commandExists(command)) {
            this.commandInstances[command](args)
        } else {
            throw "Invalid Command"
        }
    },

    commandInstances: {
        presu(args) {
            if(data.valorHora === undefined) {
                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Usa el comando t!valorhora para establecer el valor de la hora y hacer el calculo"
                })
            } else {
                if(args.length < 2) {
                    this.bot.sendMessage({
                        to: this.chanellId,
                        message: "Usage: t!presu [pojectDays] (comision)\n\nprojectDays: Dias que durara el proyecto\ncomision(opcional): Comision que se le agregara al presupuesto en %"
                    })
                } else {
                    let projectDays = args[1]
                    let comision = null
        
                    if(args.length > 2) {
                        comision = args[2]
                        comision = (parseInt(comision)/100)
                    }
        
                    projectDays = parseInt(projectDays)
                    
                    let presu = data.valorHora * data.hourPerDay * projectDays
                    let presuArs = presu * data.usdToArs
        
                    if(comision !== null)
                        presu += presu * comision
        
                    this.bot.sendMessage({
                        to: this.chanellId,
                        message: "Presupuesto(USD): " + presu + "\nPresupuesto(ARS): " + presuArs
                    })
                }
            }
        },

        valorhora(args) {
            if(args.length < 3) {
                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Usage: t!valorhora [budget] [hourPerDay]\n\nbudget(USD): Sueldo que esperas ganar por mes.\nhourPerDay: Horas que trabajaras por dia."
                })
            } else {
                let budget = args[1];
                let hourPerDay = args[2];

                budget = parseFloat(budget)
                hourPerDay = parseInt(hourPerDay)

                data.valorHora = (budget / 31) / hourPerDay
                data.hourPerDay = hourPerDay

                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Valor Hora(USD): " + data.valorHora + "\nValor Hora(ARS): " + data.valorHora * data.usdToArs
                })
            }
        },

        usdtoars(args) {
            if(args.length < 2) {
                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Usage: t!usdtoars [usd]\n\nusd: El valor en dolares que quieres convertir."
                })
            } else {
                let usdValue = args[1]

                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Valor: " + usdValue * data.usdToArs
                })
            }
        },

        arstousd(args) {
            if(args.length < 2) {
                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Usage: t!usdtoars [usd]\n\ars: El valor en pesos que quieres convertir."
                })
            } else {
                let arsValue = args[1]

                this.bot.sendMessage({
                    to: this.chanellId,
                    message: "Valor: " + arsValue / data.usdToArs
                })
            }
        },

        
    }
}

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

    commands.initialize(bot)
})

bot.on('message', (user, userId, chanellId, message, event) => {
    if(message.length < 3)
        return

    let prefix = message.substring(0, 2)

    if(prefix !== 't!')
        return

    let commandLine = message.substring(2, message.length)
    let parsedCommandLine = commandLine.split(" ")
    let command = parsedCommandLine[0]

    commands.setMessageInfo(userId, chanellId)
    
    try {
        commands.run(command, parsedCommandLine)
    } catch(e) {
        console.error(e)
    }
})