# qri-node

A nascent nodejs wrapper for [Qri CLI](https://qri.io/docs/getting-started/qri-cli-quickstart).


## Usage

You should have [qri CLI](https://qri.io/docs/getting-started/qri-cli-quickstart) already installed.  You should have also run `qri setup` to create a username and a local qri repo.  

All methods take a `flags` argument as an object which will be converted into CLI flags.  Use `qri [command] --help` for a list of flags.

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

// push a dataset version to a remote/qri.cloud
qri.push('me/some-cool-dataset')

// get the dataset body as a string
qri.get('me/some-cool-dataset', 'body')

// push a dataset to qri.cloud
qri.push('me/some-cool-dataset')

// list the datasets in the current qri repo
const datasets = qri.list()

```

## Tests

Run tests with `yarn test`

## Methods


#### setup(flags)

'setup' sets up a new qri repo and identity




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| flags | `string`  | - CLI flags for 'qri setup' | &nbsp; |




##### Returns


- `Promise`  



#### init(path, flags)

'init' creates a new dataset, links it to the provided directory,
and creates starter files for the dataset's components




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| path | `string`  | - the path to create the new dataset in (relative to pwd) | &nbsp; |
| flags | `string`  | - CLI flags for 'qri init' | &nbsp; |




##### Returns


- `Promise`  



#### save(dsRef, flags)

'save' saves a dataset version




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| dsRef | `string`  | - The dataset reference to save | &nbsp; |
| flags | `string`  | - CLI flags for 'qri save' | &nbsp; |




##### Returns


- `Promise`  



#### get(dsRef, component, flags)

'get' a dataset or a specific component from a dataset




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| dsRef | `string`  | - The dataset reference to save | &nbsp; |
| component | `string`  | - The component to get (body, readme, structure, meta) | &nbsp; |
| flags | `string`  | - CLI flags for 'qri get' | &nbsp; |




##### Returns


- `Promise`  



#### remove(dsRef, flags)

'remove' removes a Dataset




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| dsRef | `string`  | - The dataset reference to save | &nbsp; |
| flags | `string`  | - CLI flags for 'qri remove' | &nbsp; |




##### Returns


- `Promise`  



#### push(dsRef, flags)

'push' pushes a Dataset to a qri remote




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| dsRef | `string`  | - The dataset reference to push | &nbsp; |
| flags | `string`  | - CLI flags for 'qri push' | &nbsp; |




##### Returns


- `Promise`  




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
(use `doxdox lib/qri-node.js --layout markdown --output DOCUMENTATION.md`)
