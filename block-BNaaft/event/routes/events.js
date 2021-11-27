var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');
var moment = require('moment');

var allCategoriesAndLocations = (req, res, next) => {
  Event.distinct('event_category', (err, categories) => {
    Event.distinct('location', (err, locations) => {
      res.locals.categories = categories;
      res.locals.locations = locations;
      next();
    });
  });
};

router.get('/new', (req, res) => {
  res.render('eventForm');
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  req.body.event_category = req.body.event_category.split(',');
  Event.create(req.body, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

router.get('/', allCategoriesAndLocations, (req, res, next) => {
  Event.find({}, (err, events) => {
    res.render('event', { events });
  });
});
//single event

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id)
    .populate('remarkId')
    .exec((err, event) => {
      if (err) return next(err);
      res.render('singleEvent', { event: event });
    });
});

//update

router.get('/:id/edit', (req, res) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    console.log(event.start_date, 'dateEdit');
    let startDate = String(format_date(event.start_date));
    let endDate = format_date(event.end_date);
    console.log(startDate, endDate, 'inside edit form');
    if (err) return next(err);
    res.render('updateForm', { event, startDate, endDate });
  });
});

router.post('/:id', (req, res) => {
  console.log(req.body);
  console.log(typeof req.body.start_date);
  var id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

//delete

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});

//like
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;

  Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, event) => {
    console.log(event, 'hello');

    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

//add remark

router.post('/:id/remarks', (req, res, next) => {
  var id = req.params.id;
  req.body.eventId = id;
  Remark.create(req.body, (err, remark) => {
    console.log(err, remark);
    if (err) return next(err);
    Event.findByIdAndUpdate(
      id,
      { $push: { remarkId: remark._id } },
      (err, updateEvent) => {
        if (err) return next(err);
        res.redirect('/events/' + id);
      }
    );
  });
});

function format_date(date) {
  var year = new Date(date).getFullYear();
  var month = new Date(date).getMonth() + 1;
  var day = new Date(date).getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  console.log(date, year, month, day);
  return `${year}-${month}-${day}`;
}

module.exports = router;
