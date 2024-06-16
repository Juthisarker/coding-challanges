const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'myShell> '
});

rl.prompt();

rl.on('line', (line) => {
  const command = line.trim();

  if (command === 'exit') {
    rl.close();
  } else {
    executeCommand(command);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Exiting shell. Goodbye!');
  process.exit(0);
});

function executeCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`Output: ${stdout}`);
  });
}
