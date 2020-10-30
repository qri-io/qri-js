# qri-node

A nascent nodejs wrapper for [Qri CLI](https://qri.io/docs/getting-started/qri-cli-quickstart).


## Usage

```
const qri = require('@qri-io/qri-node')

// save a dataset version
qri.save('me/some-cool-dataset', {
  body: 'full/path/to/body.csv',
  file: [
    'full/path/to/meta.json',
    'full/path/to/readme.md',
    'full/path/to/structure.json'
  ]
})

// push a dataset to qri.cloud
qri.push('me/some-cool-dataset')

```
