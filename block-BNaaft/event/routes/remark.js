var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
var Event = require('../models/event');
var Remark = require('../models/remark');

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Remark.findById(id, (err, remark) => {
    if (err) return next(err);
    res.render('updateRemark', { remark: remark });
  });
});

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, updateRemark) => {
    if (err) return next(err);
    res.redirect('/events/' + updateRemark.eventId);
  });
});

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndDelete(id, (err, deleteRemark) => {
    if (err) return next(err);
    res.redirect('/events/' + deleteRemark.eventId);
  });
});

// like
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;

  Remark.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, incLikes) => {
    if (err) return next(err);
    res.redirect('/events/' + incLikes.eventId);
  });
});

// dislike
router.get('/:id/dislike', (req, res, next) => {
  var id = req.params.id;
  Remark.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, disLikes) => {
    if (err) return next(err);
    res.redirect('/events/' + disLikes.eventId);
  });
});

module.exports = router;
