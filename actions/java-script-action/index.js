const core = require("@actions/core");

function run() {
  try {

    const name = core.getInput("name");
    
    const greeting = `Olá, ${name}! Welcome to Github Actions with Javascript Action`;
    console.log(greeting);

    core.setOutput("greeting", greeting);
  } catch (error) {
    core.setFailed(`An error was found: ${error.message}`);
  }
}

run();
