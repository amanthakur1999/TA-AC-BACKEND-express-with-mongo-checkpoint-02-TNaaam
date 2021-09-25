var express = require('express');
const { get } = require('.');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/ascend', (req, res, next) => {
  Event.find({})
    .sort({ start_date: 1 })
    .exec((err, event) => {
      res.render('ascend', { events: event });
    });
});

router.get('/descend', (req, res, next) => {
  Event.find({})
    .sort({ start_date: -1 })
    .exec((err, event) => {
      res.render('descend', { events: event });
    });
});

module.exports = router;
