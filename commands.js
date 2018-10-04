/**
 * File that contains all commands.
 * To add a command, just add a function to the object with the same name of the command.
 */

module.exports = {
    initialize() {
        this.data.config = {
            testValue: 324
        }

        this.data.helpInfo = {
            'config': {
                description: 'Obtiene o cambia la configuracion del bot',
                args: {
                    'configName': 'Nombre de la configuracion',
                    'configValue': 'Valor de la configuracion'
                }
            },
            'say': {
                description: 'The bot repeats',
                args: {
                    'phrase': 'The phrase that bot repeats'
                }
            }
        }
    },

    help(args) {
        if(args.length > 0) {
            if(!this.data.helpInfo.hasOwnProperty(args[0])) return

            let helpInfo = this.data.helpInfo[args[0]]
            let message = 'Usage: t!' + args[0]
            let fields = []

            for(let key in helpInfo.args) {
                message += ' [' + key + ']'

                fields.push({
                    name: key,
                    value: helpInfo.args[key]
                })
            }

            this.sendMessage(message, fields)

            return
        }

        let message = 'List of commands:\n'
        let fields = []

        for(var key in this.data.helpInfo) {
            let helpInfo = this.data.helpInfo[key];
            let usage = 't!' + key

            for(let arg in helpInfo.args)
                usage += ' [' + key + ']'

            fields.push({
                name: usage,
                value: helpInfo.description
            })
        }

        this.sendMessage(message, fields)
    },

    config(args) {
        if(args.length < 1) {
            let message = '\`\`\`json\n' + JSON.stringify(this.data.config) + '\`\`\`'
            this.sendMessage(message)
        } else if(args.length === 1) {
            let configName = args[0]

            if(this.data.config.hasOwnProperty(configName)) {
                let message = '\`\`\`json\n' + JSON.stringify(this.data.config[configName]) + '\`\`\`'
                this.sendMessage(message)
            } else {
                this.sendMessage('Config not exists')
            }
        } else if(args.length > 1) {
            let configName = args[0]
            let configValue = args[1]

            configValue = parseFloat(configValue)

            if(this.data.config.hasOwnProperty(configName)) {
                this.data.config[configName] = configValue
                let message = '\`\`\`json\n' + JSON.stringify(this.data.config[configName]) + '\`\`\`'
                this.sendMessage(message)
            } else {
                this.sendMessage('Config not exists')
            }
        }
    },

    say(args) {
        if(args.length < 1) { 
            this.help(["say"])
            return
        }

        this.sendMessage("I'm say, " + args[0] + ".")
    }
}