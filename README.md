# Rubber ES

A lightweight wrapper for the elasticsearch client

`npm install rubber-es --save`

```javascript
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: '127.0.0.1:9200' });
var rubber = require('./rubber-es.js')(client);
```

## index

index exposes the same api as the elasticsearch.index method. One may additionally
supply an array of objects to perform a bulk insert.

```javascript
rubber.index({
    index: that.index,
    type: that.type,
    id: '1',
    body: { foo: 'bar' }
});
```

```javascript
rubber.index([
    {
        index: that.index,
        type: that.type,
        id: '1',
        body: { a: 1 }
    },
    {
        index: that.index,
        type: that.type,
        id: '2',
        body: { b: 2 }
    }
]);
```
