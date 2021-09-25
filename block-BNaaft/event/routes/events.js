var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/new', (req, res) => {
  res.render('eventForm');
});

router.post('/', (req, res, next) => {
  Event.create(req.body, (err, event) => {
    console.log(err, event);
    if (err) return redirect('/events/new');
    res.redirect('/events');
  });
});

router.get('/', (req, res, next) => {
  Event.find({}, (err, event) => {
    if (err) return next(err);
    let allCategories = [];
    event.filter((event) => {
      console.log(event.event_category);
      let splittedCategory = event.event_category;
      for (var i = 0; i < splittedCategory.length; i++) {
        if (!allCategories.includes(splittedCategory[i])) {
          allCategories.push(splittedCategory[i]);
        }
      }
    });
    let allLocations = [];
    event.filter((elm) => {
      if (!allLocations.includes(elm.location)) {
        allLocations.push(elm.location);
      }
    });

    res.render('event', { events: event, allCategories, allLocations });
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
    if (err) return next(err);
    res.render('updateForm', { event });
  });
});

router.post('/:id', (req, res) => {
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

module.exports = router;
