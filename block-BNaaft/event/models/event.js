var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema(
  {
    title: String,
    summary: String,
    host: String,
    start_date: { type: Date },
    end_date: { type: Date },
    event_category: { type: [String] },
    location: String,
    likes: { type: Number, default: 0 },
    remarkId: [{ type: Schema.Types.ObjectId, ref: 'Remark' }],
  },
  { timestamps: true }
);

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
