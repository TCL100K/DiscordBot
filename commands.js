module.exports = {
    help(args) {
        if(args.length > 0) {

            switch(args[0]) {
                case "say": {
                    this.sendMessage("Usage: say [phrase]")
                    break
                }
            }

            return
        }

        this.sendMessage("List of commands:\n\n* say")
    },

    say(args) {
        if(args.length < 1) { 
            this.help(["say"])
            return
        }

        this.sendMessage("I'm say, " + args[0] + ".")
    }
}