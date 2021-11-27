var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/:location', (req, res, next) => {
  let location = req.params.location;
  Event.find({})
    .distinct('location')
    .exec((err, event) => {
      console.log(event, 'eventss');
      if (err) return next(err);
      let some = event.filter((elm) => {
        if (elm.location.includes(location)) {
          console.log(elm);
          return elm;
        }
      });
      res.render('location', { event: some });
    });
});

module.exports = router;
