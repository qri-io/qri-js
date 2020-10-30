#!/usr/bin/env node
const fs = require('fs')
const { exec } = require('child_process')
const path = require('path')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('inquirer')

const homedir = require('os').homedir()

const createNewProfile = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'newProfileName',
        message: 'Enter a profile name'
      }
    ])
    .then(({ newProfileName }) => {
    // make sure it is unique
      const exists = fs.existsSync(path.join(qriswitchDir, `.${newProfileName}`))
      if (exists) {
        console.log('that profile name already exists')
        return
      } else {
      // create a temporary directory with .qri and .ipfs directories in it
        const profileDir = path.join(qriswitchDir, `.${newProfileName}`)
        const qriDir = path.join(profileDir, '.qri')
        const ipfsDir = path.join(profileDir, '.ipfs')
        fs.mkdirSync(profileDir)
        fs.mkdirSync(qriDir)
        fs.mkdirSync(ipfsDir)
      }

      switchToProfile(newProfileName)
    })
}

const useDefaultProfile = () => {
  // clear .env, unset environment variables
  exec(`
    rm -rf ~/.qriswitch/.env &&
    echo 'export QRISWITCH_PROFILE=default qri profile' >> ~/.qriswitch/.env &&
    echo 'unset QRI_PATH' >> ~/.qriswitch/.env &&
    launchctl unsetenv QRI_PATH &&
    echo 'unset IPFS_PATH' >> ~/.qriswitch/.env &&
    launchctl unsetenv IPFS_PATH
  `, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log('switched profile to default profile')
    console.log('QRI_PATH is not set')
    console.log('IPFS_PATH is not set')
    console.log('To restart this terminal, run `source ~/.qriswitch/.env`')
  })
}

const switchToProfile = (profileName) => {
  const profileDir = path.join(qriswitchDir, `.${profileName}`)
  const qriDir = path.join(profileDir, '.qri')
  const ipfsDir = path.join(profileDir, '.ipfs')

  // clear .env, set environment variables
  exec(`
    rm -rf ~/.qriswitch/.env &&
    echo 'export QRISWITCH_PROFILE=${profileName}' >> ~/.qriswitch/.env &&
    echo 'export QRI_PATH=${qriDir}' >> ~/.qriswitch/.env &&
    launchctl setenv QRI_PATH ${qriDir} &&
    echo 'export IPFS_PATH=${ipfsDir}' >> ~/.qriswitch/.env &&
    launchctl setenv IPFS_PATH ${ipfsDir}
  `, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`switched profile to ${profileName}`)
    console.log(`QRI_PATH is ${qriDir}`)
    console.log(`IPFS_PATH is ${ipfsDir}`)
    console.log('To restart this terminal, run `source ~/.qriswitch/.env`')
  })
}

const prompt = () => {
  const profiles = fs.readdirSync(path.join(homedir, '.qriswitch'))
    .filter(d => d !== '.env')
    .map(d => d.split('.')[1])

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'profile',
        message: 'Choose a Profile',
        choices: [
          ...profiles,
          new inquirer.Separator(),
          'use default qri profile',
          'create a new profile'
        ]
      }
    ])
    .then(({ profile }) => {
      if (profile === 'use default qri profile') {
        useDefaultProfile()
        return
      }

      if (profile === 'create a new profile') {
        createNewProfile()
        return
      }

      clear()
      switchToProfile(profile)
    })
}

// make sure $HOME/.qriswitch exists
const qriswitchDir = path.join(homedir, '.qriswitch')
if (!fs.existsSync(qriswitchDir)) {
  fs.mkdirSync(qriswitchDir)
}

clear()
// make a neato ascii art logo
console.log(
  chalk.yellow(
    figlet.textSync('qriswitch', { horizontalLayout: 'full' })
  )
)

console.log(`current profile: ${process.env.QRISWITCH_PROFILE}`)
prompt()
