const commands = require('./commandsFile.js');

//prompt the user for input
process.stdout.write('prompt > ');

// the stdin 'data' event triggers after a user types in a line
process.stdin.on('data', (userInput) => {
    userInput = userInput.toString().trim();
    commands.evaluateCmd(userInput);
});