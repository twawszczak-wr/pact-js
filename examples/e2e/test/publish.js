if (process.env.CI !== 'true') {
  console.log("skipping Pact publish as not on CI...");
  process.exit(0)
}

const pact = require('@pact-foundation/pact-node');
const childProcess = require('child_process')

const exec = command => childProcess.execSync(command).toString().trim();

//Usually, you would just use the CI env vars, but to allow these examples to run from
//local development machines, we'll fall back to the git command when the env vars aren't set.
const gitSha = process.env.TRAVIS_COMMIT || exec('git rev-parse HEAD')
const branch = process.env.TRAVIS_BRANCH || exec('git rev-parse --abbrev-ref HEAD')

const opts = {
  pactFilesOrDirs: ['./pacts/'],
  pactBroker: "https://test.pact.dius.com.au",
  pactBrokerUsername: "dXfltyFMgNOFZAxr8io9wJ37iUpY42M",
  pactBrokerPassword: "O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1",
  consumerVersion: gitSha,
  tags: [branch]
}

pact
  .publishPacts(opts)
  .then(() => {
    console.log("Pact contract publishing complete!")
    console.log("")
    console.log("Head over to https://test.pact.dius.com.au/ and login with")
    console.log("=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M")
    console.log("=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1")
    console.log("to see your published contracts.")
  })
  .catch(e => {
    console.log("Pact contract publishing failed: ", e)
  })
