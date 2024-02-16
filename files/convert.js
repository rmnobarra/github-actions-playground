yaml = require('js-yaml');
fs = require(`fs`)

const inputFileName = 'input.yaml';
const outputFileName = 'output.json';

const json = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'));

fs.writeFileSync(outputFileName, JSON.stringify(json, null, 2));