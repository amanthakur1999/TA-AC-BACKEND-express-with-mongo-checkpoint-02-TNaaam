var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/:category', (req, res, next) => {
  let category = req.params.category;
  Event.find({ event_category: { $in: [category] } }).exec((err, event) => {
    // var some = event.filter((elm) => {
    //   if (elm.event_category.includes(category)) {
    //     return elm;
    //   }
    // });
    res.render('category', { events: event });
  });
});
module.exports = router;
