exports.default = {
    bot: null,
    commandInstances: {},

    initialize(bot, data) {
        this.bot = bot
        this.commandInstances.data = data
        this.commandInstances.sendMessage = this.sendMessage
    },

    setMessageInfo(userId, chanellId) {
        this.userId = userId
        this.chanellId = chanellId
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

    addCommands(commands) {
        this.commandInstances = commands
    },

    sendMessage(msg) {
        this.bot.sendMessage({
            to: this.chanellId,
            message: msg
        })
    }
}