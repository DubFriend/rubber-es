var _ = require('lodash');
var Q = require('q');
var elasticsearch = require('elasticsearch');

module.exports = function (client) {
    var rubber = {};

    rubber.index = function (fig) {
        var bulkIndex = function (rows) {
            if(rows.length) {
                var bulkFig = [];
                _.each(rows, function (row) {
                    var indexFig = { _index: row.index, _type: row.type };
                    if(row.id) {
                        indexFig._id = row.id;
                    }
                    bulkFig.push({ index: indexFig });
                    bulkFig.push(row.body);
                });
                return Q(client.bulk({ body: bulkFig }));
            }
            else {
                return Q();
            }
        };

        return _.isArray(fig) ? bulkIndex(fig) : Q(client.index(fig));
    };

    return rubber;
};
