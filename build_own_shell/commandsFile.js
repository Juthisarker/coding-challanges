//import fs library
const fs = require('fs');

//write out data
function done(output) {
    process.stdout.write(output);
    process.stdout.write('\nprompt > ');
}

// where we will store our commands
function evaluateCmd(userInput){
    // parses the user input to understand which command was typed
    const userInputArray = userInput.split(" ");
    const command = userInputArray[0]; 

    switch (command) {
        case "echo":
            //we will add the functionality of echo next within the object commandLibrary 
            //slice(1) will slice the first letter and save the rest
            commandLibrary.echo(userInputArray.slice(1).join(" "));
            break;
        
        case "cat":
            commandLibrary.cat(userInputArray.slice(1)); 
            break;
        
        case "head":
            commandLibrary.head(userInputArray.slice(1));
            break; 

        case "tail":
            commandLibrary.tail(userInputArray.slice(1));

        default: 
            process.stdout.write('Typed command is not accurate');
        }
}

const commandLibrary = { 
    "echo": function (userInput){
        done(userInput); 
    },
    "cat": function (fullPath){
        const fileName = fullPath[0];
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            console.log(data);
            done(data); 
        });
    }, 
    "head": function (fullPath){
        const fileName = fullPath[0];
        fs.readFile(fileName, (err, data) => {
            if (err) throw err; 
            // convert string to utf8 
            var text = data.toString('utf8'); 
            // extract 10 lines of code and join by new line
            var slicedText = text.split('\n').slice(0,10).join('\n'); 
            // convert sliced text back to Buffer object
            var bufferText = Buffer.from(slicedText, 'utf8');
            done(bufferText);
        })
    }, 
    "tail": function (fullPath){
        const fileName = fullPath[0];
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            var text = data.toString('utf8');
            var slicedText = text.split('\n').slice(-10).join('\n');
            var bufferText = Buffer.from(slicedText, 'utf8');
            done(bufferText);
        })
    }

};