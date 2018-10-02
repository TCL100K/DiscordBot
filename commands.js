/**
 * File that contains all commands.
 * To add a command, just add a function to the object with the same name of the command.
 */

module.exports = {
    initialize() {
        this.data.helpInfo = {
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
            let messageEnd = '\n'

            for(let key in helpInfo.args) {
                message += ' [' + key + ']'
                messageEnd += '\n' + key + ': ' + helpInfo.args[key]
            }

            message += messageEnd

            this.sendMessage(message)

            return
        }

        let message = 'List of commands:\n'

        for(var key in this.data.helpInfo)
            message += '\n' + key + ': ' + this.data.helpInfo[key].description

        this.sendMessage(message)
    },

    say(args) {
        if(args.length < 1) { 
            this.help(["say"])
            return
        }

        this.sendMessage("I'm say, " + args[0] + ".")
    }
}