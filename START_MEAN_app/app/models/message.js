var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
    sessionId : String,
	text : String,
    likes : Number,
	type : String
});