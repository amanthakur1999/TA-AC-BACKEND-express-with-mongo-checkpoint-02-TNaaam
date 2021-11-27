var express = require('express');
var router = express.Router();
var Event = require('../models/event');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/filter', (req, res, next) => {
  var query = req.query;

  if (query.fcategory !== '' && query.flocation != '') {
    var filtpara = {
      $and: [
        { even_category: { $in: [query.fcategory] } },
        { location: query.flocation },
      ],
    };
  } else if (query.fcategory === '' && query.flocation != '') {
    var filtpara = { location: query.flocation };
  } else if (query.fcategory !== '' && query.flocation === '') {
    var filtpara = { even_category: { $in: [query.fcategory] } };
  } else {
    var filtpara = {};
  }
  if (query.fdate === 'latest') {
    var sortEvent = { start_date: 1 };
  } else {
    var sortEvent = { start_date: -1 };
  }

  Event.find(filtpara)
    .sort(sortEvent)
    .exec((err, events) => {
      console.log(events);
      if (err) return next(err);
      Event.distinct('location', (err, locations) => {
        console.log(locations);
        res.render('event', { events, locations });
      });
    });
});

module.exports = router;
