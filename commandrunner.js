module.exports = {
    bot: null,
    commandInstances: {},

    initialize(bot) {
        this.bot = bot
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

    addCommands(commands, data) {
        this.commandInstances = commands
        this.commandInstances.bot = this.bot
        this.commandInstances.sendMessage = this.sendMessage
        this.commandInstances.data = data
    },

    sendMessage(msg) {
        this.bot.sendMessage({
            to: this.chanellId,
            message: msg
        })
    }
}