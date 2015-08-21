var _ = require('lodash');
var chai = require('chai');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({ host: '127.0.0.1:9200' });
var rubber = require('./rubber-es.js')(client);

describe('rubber-es', function () {
    beforeEach(function (done) {
        this.index = 'rubber-es-test';
        this.type = 'test-type';

        client.indices.delete({ index: this.index })
        .then(
            function (resp) {
                done();
            },
            function (err) {
                if(err.status === 404) {
                    done();
                }
                else {
                    console.error(err);
                }
            }
        );
    });

    describe('index', function () {
        it('should index a single document', function (done) {
            var that = this;
            rubber.index({
                index: that.index,
                type: that.type,
                id: '1',
                body: { foo: 'bar' }
            })
            .then(function (resp) {
                chai.expect(resp).to.have.all.keys(
                    '_index', '_type', '_id', '_version', 'created'
                );
                return client.get({
                    index: that.index,
                    type: that.type,
                    id: '1'
                });
            })
            .then(function (resp) {
                chai.assert.deepEqual(resp._source, { foo: 'bar' });
                done();
            })
            .done();
        });

        it('should bulk an array of documents', function (done) {
            var that = this;
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
            ])
            .then(function (resp) {
                chai.expect(resp).to.have.all.keys('took', 'errors', 'items');
                return client.mget({
                    index: that.index,
                    type: that.type,
                    body: { ids: ['1', '2']}
                });
            })
            .then(function (resp) {
                chai.assert.sameDeepMembers(_.pluck(resp.docs, '_source'), [
                    { a: 1 }, { b: 2 }
                ]);
                done();
            })
            .done();
        });

        it('should handle an empty array', function (done) {
            var that = this;
            rubber.index([]).then(function () {
                chai.assert.ok(true);
                done();
            })
            .done();
        });
    });
});
