/*
* A script that clones the directory of "public/docbox" from each git project instead
* of cloning the whole project.
*/

// Imports
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Config
const repoArray = [
  "https://git.tribepayments.com/isac/is-core",
  "https://git.tribepayments.com/isac/ac-core",
  "https://git.tribepayments.com/isac/3ds-mpi",
  "https://git.tribepayments.com/risk/riskmonitor-api",
  "https://git.tribepayments.com/openbank/core",
  "https://git.tribepayments.com/gtw/core",
  "https://git.tribepayments.com/isac-pos",
  "https://git.tribepayments.com/bank/box",
  "https://git.tribepayments.com/upc/front"
]

const directoryUrl = "C:\\wamp64\\www\\gitlab_all_docs"

// Script
async function execFunction(stringCommand) {
  try {
    const { stdout, stderr } = await exec(stringCommand);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error('exec error: ' + e);
  }
}

async function execAllActions(repoUrl) {
  await execFunction(`cd "${directoryUrl}" && git clone --depth=1 --filter=blob:none --sparse ${repoUrl} && cd ${repoUrl.match(/[a-z|-]+$/)[0]} && git sparse-checkout set public/docbox && cd ..`)
}

async function main() {
  repoArray.forEach(async function(repoUrl) {
    await execAllActions(repoUrl)
  });
}

main()
