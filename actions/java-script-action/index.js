const core = require("@actions/core");

function run() {
  try {
    // Pega o input 'name'
    const name = core.getInput("name");
    
    // Cria uma mensagem de saudação
    const greeting = `Olá, ${name}! Bem-vindo ao GitHub Actions com JavaScript!`;
    console.log(greeting);

    // Define a mensagem como output
    core.setOutput("greeting", greeting);
  } catch (error) {
    core.setFailed(`Ocorreu um erro: ${error.message}`);
  }
}

run();
