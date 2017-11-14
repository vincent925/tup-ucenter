var express = require('express');
var router = express.Router();
var TableModel = require('../models/table');
var checkLogin = require('../middlewares/check').checkLogin;

router.post('/structure/create', function (req, res, next) {
    var name = req.body.name;
    var structure = JSON.parse(req.body.structure);
    var author = req.body.author;
    // 校验参数
    if (!(name.length >= 1 && name.length <= 16)) {
        return res.status(400).send({ code: 11001, message: '名称至少 6 个字符' });
    }
    if (structure == undefined) {
        return res.status(400).send({ code: 11002, message: '结构不能为空' });
    }
    var ts = {};
    ts.structure_name = name;
    ts.structure = structure;
    ts.author = author;
    TableModel.tsCreate(ts)
        .then(function (result) {
            tsr = result.ops[0];
            return res.json({ code: 0, message: 'Successfully', tsId: tsr._id });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

router.post('/structure/update', function (req, res, next) {
    var name = req.body.name;
    var id = req.body.id;
    var structure = JSON.parse(req.body.structure);
    // 校验参数
    if (id == undefined) {
        return res.status(400).send({ code: 11005, message: 'id不能为空' });
    }
    if (structure == undefined) {
        return res.status(400).send({ code: 11002, message: '结构不能为空' });
    }

    TableModel.getTableStructureById(id)
        .then(function (ts) {
            if (name != undefined) {
                ts.structure_name = name;
            }
            if (structure != undefined) {
                ts.structure = structure;
            }
            ts.author=ts.author._id.toString();
            TableModel.updateTableStructureById(id, ts)
                .then(function (result) {
                    return res.json({ code: 0, message: 'Successfully', tsId: id });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });


});

router.get('/structure/getall', function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var count = req.query.count ? parseInt(req.query.count) : 10;
    TableModel.getAllTableStructureCount()
        .then(function (n) {
            TableModel.getAllTableStructure(page, count)
                .then(function (result) {
                    return res.json({ code: 0, message: 'successfully', page: page, count: count, total: n, tss: result });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});


router.post('/content/create', function (req, res, next) {
    var structureId = req.body.structureId;
    var content = JSON.parse(req.body.content);
    var author = req.body.author;
    // 校验参数
    if (structureId == undefined) {
        return res.status(400).send({ code: 11003, message: '结构编号不能为空' });
    }
    if (content == undefined) {
        return res.status(400).send({ code: 11004, message: '表内容不能为空' });
    }
    var tc = {};
    tc.structure_id = structureId;
    tc.content = content;
    tc.author = author;
    TableModel.tcCreate(tc)
        .then(function (result) {
            tcr = result.ops[0];
            return res.json({ code: 0, message: 'Successfully', tcId: tcr._id });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

router.post('/content/update', function (req, res, next) {
    var id = req.body.id;
    var content = JSON.parse(req.body.content);
    var author = req.body.author;
    // 校验参数
    if (id == undefined) {
        return res.status(400).send({ code: 11005, message: 'id不能为空' });
    }
    if (content == undefined) {
        return res.status(400).send({ code: 11004, message: '表内容不能为空' });
    }
    var tcv = {};

    TableModel.getTableContentById(id)
        .then(function (tc) {
            tcv.content = tc.content;
            tcv.content_id = tc._id;
            tcv.version_date = Date.now();
            tcv.author = author;
            TableModel.tcvCreate(tcv);
            if (content != undefined) {
                tc.content = content;
            }
            tc.author=tc.author._id.toString();
            TableModel.updateTableContentById(id, tc)
                .then(function (result) {
                    return res.json({ code: 0, message: 'Successfully', tcId: id });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });


});

router.get('/content/bystructure', function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var count = req.query.count ? parseInt(req.query.count) : 10;
    var structureId = req.query.structureId;
    TableModel.getTableContentCountByStructureId(structureId)
        .then(function (n) {
            TableModel.getTableContentByStructureId(structureId, page, count)
                .then(function (result) {
                    return res.json({ code: 0, message: 'successfully', page: page, count: count, total: n, tcs: result });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});

module.exports = router;