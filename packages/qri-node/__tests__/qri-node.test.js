/* globals describe, expect, beforeAll, test */
'use strict'

const fs = require('fs-extra')
const { customAlphabet } = require('nanoid')
const ObjectsToCsv = require('objects-to-csv')

const qri = require('..')({ repo: './tmp/.qri' })

// only use lowercase letters
const getRandomName = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

const csvPath = 'tmp/body.csv'

describe('@qri-io/qri-node', () => {
  beforeAll(async () => {
    // make a tmp dir
    fs.emptyDirSync('./tmp')

    // initialize a new qri repo
    await qri.setup({ username: 'foo' })

    // store a simple csv in /tmp
    const csv = new ObjectsToCsv([
      {
        color: 'blue',
        shape: 'square',
        size: 104
      },
      {
        color: 'green',
        shape: 'circle',
        size: 23
      }
    ])

    await csv.toDisk(csvPath)

    // store a meta.json in /tmp
    fs.writeFile('./tmp/meta.json', `${JSON.stringify({
      title: 'A Nifty Dataset',
      description: 'This is just a test description'
    })}\n`)

    // store a readme.md in /tmp
    fs.writeFile('./tmp/readme.md', '# A Nifty Dataset\nThis is just a test readme')
  })

  test('rejects when qri cli errors', async () => {
    await expect(
      qri.save('me/non-existent', {
        body: './someNonexistentFile.csv'
      })
    )
      .rejects
      .toThrow(/path not found/)
  })

  test('rejects when qri cli errors', async () => {
    await expect(
      qri.save('me/4INVALID_DATASET_NAME%', {
        body: csvPath
      })
    )
      .rejects
      .toThrow('invalid dataset reference')
  })

  test('inits a dataset using only a path', async () => {
    const dir = './tmp/init1'
    fs.emptyDirSync(dir)

    // init
    qri.init(dir)

    const list = await qri.list()

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'init_1'
        })
      ])
    )
  })

  test('inits a dataset using a path and a dataset name', async () => {
    const dir = './tmp/init2'
    fs.emptyDirSync(dir)

    // init
    qri.init(dir, {
      name: 'some-custom-name'
    })

    const list = await qri.list()

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'some-custom-name'
        })
      ])
    )
  })

  test('saves a dataset from csv and gets correct body', async () => {
    const dsRef = `me/${getRandomName().toLowerCase()}`

    // save dataset
    await qri.save(dsRef, {
      body: csvPath
    })

    // get
    await expect(
      qri.get(dsRef, 'body')
    ).resolves.toEqual('color,shape,size\nblue,square,104\ngreen,circle,23')

    // remove the dataset
    await qri.remove(dsRef, {
      all: true
    })
  })

  // TODO(chriswhong): saving with meta.json in the file flag is not currently working
  // test('saves a dataset from files and gets the correct values in the dataset', async () => {
  //   const dsRef = `me/${getRandomName().toLowerCase()}`
  //
  //   // save dataset
  //   await qri.save('me/foo', {
  //     body: csvPath,
  //     file: [
  //       `tmp/readme.md`,
  //       `/Users/chriswhong/qri/qri-js/packages/qri-node/tmp/meta.json`
  //     ]
  //   })
  //
  //   const readme = qri.get(dsRef, 'readme')
  //   console.log(readme)
  //
  //   // get
  //   await expect(
  //     qri.get(dsRef, 'body')
  //   ).resolves.toEqual('color,shape,size\nblue,square,104\ngreen,circle,23')
  //
  //   // remove the dataset
  //   await qri.remove(dsRef, {
  //     all: true
  //   })
  // })
})
