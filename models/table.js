var TS = require('../lib/mongo').table_structure;
var TC = require('../lib/mongo').table_content;
var TCV = require('../lib/mongo').table_content_version;

module.exports = {
    tsCreate: function tsCreate(ts) {
        return TS.create(ts).exec();
    },
    getTableStructureById: function getTableStructureById(id) {
        return TS
            .findOne({ _id: id })
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .exec();
    },
    updateTableStructureById: function updateTableStructureById(id, data) {
        return TS.update({ _id: id }, { $set: data }).exec();
    },
    getAllTableStructureCount: function getAllTableStructureCount() {
        return TS
            .count();
    },
    //获取所有结构
    getAllTableStructure: function getAllTableStructure(page, count) {
        return TS
            .find().skip((page - 1) * count).limit(count)
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .exec();
    },



    tcCreate: function tcCreate(tc) {
        return TC.create(tc).exec();
    },
    getTableContentById: function getTableContentById(id) {
        return TC
            .findOne({ _id: id })
            .populate({ path: 'author', model: 'User' })
            .populate({ path: 'structure_id', model: 'TS' })
            .addCreatedAt()
            .exec();
    },
    getTableContentByStructureId: function getTableContentByStructureId(id,page,count) {
        var query = {};
        if (id) {
            query.structure_id = id
        }
        return TC
            .find(query,{
                skip: (page - 1) * count,
                limit: count
            })
            .populate({ path: 'author', model: 'User' })
            .populate({ path: 'structure_id', model: 'TS' })
            .addCreatedAt()
            .exec();
    },
    getTableContentCountByStructureId: function getTableContentCountByStructureId(id) {
        var query = {};
        if (id) {
            query.structure_id = id
        }
        return TC.count(query);
    },
    updateTableContentById: function updateTableContentById(id, data) {
        return TC.update({ _id: id }, { $set: data }).exec();
    },

    tcvCreate: function tcvCreate(tcv) {
        return TCV.create(tcv).exec();
    },
};