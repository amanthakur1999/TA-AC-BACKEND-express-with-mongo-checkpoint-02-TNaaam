var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/:location', (req, res, next) => {
  let location = req.params.location;
  Event.find({}).exec((err, event) => {
    let some = event.filter((elm) => {
      if (elm.location.includes(location)) {
        return elm;
      }
    });
    res.render('location', { event: some });
  });
});

module.exports = router;
