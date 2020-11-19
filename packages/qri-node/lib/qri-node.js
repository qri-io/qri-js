const { exec } = require('child_process')

// helper function for appending qri command flags to the base command string
const appendFlags = (args, flags) => {
  Object.keys(flags).forEach((key) => {
    let flagValue = flags[key]

    if (typeof flags[key] === 'boolean') {
      flagValue = ''
    }

    // special handling for --file
    if (key === 'file') {
      flags[key].forEach((d, i) => {
        args = [
          ...args,
          '--file',
          `${flags[key][i]}`
        ]
      })
    } else if (key === 'body') {
      args = [
        ...args,
        '--body',
        flags[key]
      ]
    } else {
      args = [
        ...args,
        `--${key}`
      ]

      if (flagValue) args.push(flagValue)
    }
  })

  return args
}

const validateDsRef = (dsRef) => {
  return new Promise((resolve, reject) => {
    const valid = /^([a-z][a-z0-9_-]*)\/([a-z][a-z0-9_-]*)$/.test(dsRef)
    if (valid) {
      resolve()
    } else {
      reject(new Error('invalid dataset reference'))
    }
  })
}

class Qri {
  constructor (options) {
    this.options = {
      'no-prompt': true,
      ...options
    }
  }

  /**
  * 'setup' sets up a new qri repo and identity
  * @param {string} flags - CLI flags for 'qri setup'
  * @returns {Promise}
  */
  setup (flags) {
    console.log('setting up qri repo')
    const args = ['setup']
    return this.runQriCommand(args, flags)
  }

  /**
  * 'init' creates a new dataset, links it to the provided directory,
  * and creates starter files for the dataset's components
  * @param {string} path - the path to create the new dataset in (relative to pwd)
  * @param {string} flags - CLI flags for 'qri init'
  * @returns {Promise}
  */
  init (path, flags = { format: 'csv' }) {
    console.log(`initializing Qri Dataset in ${path}`)
    const args = ['init', path]
    return this.runQriCommand(args, flags)
  }

  /**
  * 'save' saves a dataset version
  * @param {string} dsRef - The dataset reference to save
  * @param {string} flags - CLI flags for 'qri save'
  * @returns {Promise}
  */
  save (dsRef, flags) {
    return validateDsRef(dsRef)
      .then(() => {
        console.log(`saving qri dataset ${dsRef}`)
        const args = ['save', dsRef]
        return this.runQriCommand(args, flags)
      })
  }

  /**
  * 'get' a dataset or a specific component from a dataset
  * @param {string} dsRef - The dataset reference to save
  * @param {string} component - The component to get (body, readme, structure, meta)
  * @param {string} flags - CLI flags for 'qri get'
  * @returns {Promise}
  */
  get (dsRef, component = '', flags) { // eslint-disable-line
    return validateDsRef(dsRef)
      .then(() => {
        console.log(`getting qri dataset ${dsRef}`)
        const args = ['get', component, dsRef]
        return this.runQriCommand(args, flags)
      })
  }

  /**
  * 'list' List datasets
  * @param {string} filter - string to filter the list of results
  * @param {string} flags - CLI flags for 'qri list'
  * @returns {Array} - an array of dataset list items
  */
  async list (filter, flags) {
    console.log('getting qri dataset list')
    // default to 1000 items, json format
    const args = ['list', '--format', 'json', '--page-size', '1000']
    const list = await this.runQriCommand(args, flags)
    return JSON.parse(list)
  }

  /**
  * 'remove' removes a Dataset
  * @param {string} dsRef - The dataset reference to save
  * @param {string} flags - CLI flags for 'qri remove'
  * @returns {Promise}
  */
  remove (dsRef, flags) {
    return validateDsRef(dsRef)
      .then(() => {
        console.log(`removing qri dataset ${dsRef}`)
        const args = ['remove', dsRef]
        return this.runQriCommand(args, flags)
      })
  }

  /**
  * 'push' pushes a Dataset to a qri remote
  * @param {string} dsRef - The dataset reference to push
  * @param {string} flags - CLI flags for 'qri push'
  * @returns {Promise}
  */
  push (dsRef, flags) {
    return validateDsRef(dsRef)
      .then(() => {
        console.log(`publishing qri dataset ${dsRef}`)
        const args = ['push', dsRef]
        return this.runQriCommand(args, flags)
      })
  }

  runQriCommand (args, flags = {}) {
    // append flags
    args = appendFlags(args, flags)
    args = appendFlags(args, this.options)
    return new Promise((resolve, reject) => {
      exec(`qri ${args.join(' ')}`, (err, stdout, stderr) => {
        if (!err) {
          resolve(stdout.toString().trim())
        } else {
          reject(new Error(stderr.toString().trim()))
        }
      })
    })
  }
}

let instance
module.exports = (options) => {
  if (!instance) {
    // only the first call to require will use these options to create an instance
    instance = new Qri(options)
  }
  return instance
}
