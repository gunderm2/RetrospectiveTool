var Message = require('./models/message');

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all messages
    app.get('/api/messages/:sessionId', function (req, res) {
        // Disable caching for content files otherwise it will send 304 when data set not activly changing
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

        // use mongoose to get all todos in the database
        Message.find(function (err, messages) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                console.log('ERROR :', err);
                res.send(err)
            } else {
                console.log('success');
                //res.json(messages); // return all todos in JSON format
                var msgs = [];
                for (var x = 0; x < messages.length; x++) {
                    if (messages[x].sessionId === req.params.sessionId) {
                        msgs.push(messages[x]);
                    }
                }
                res.json(msgs);
            }
        });
    });

    // create message and send back all messages after creation
    app.post('/api/messages/', function (req, res) {
        // create a message, information comes from AJAX request from Angular
        Message.create({
            sessionId: req.body.sessionId,
            text: req.body.text,
            likes: req.body.likes,
            type: req.body.type
        }, function (err, message) {
            if (err) {
                console.log('ERROR :', err);
                res.send(err);
            } else {
                console.log('success');
                // get and return all the messages then filter by sessionId
                Message.find(function (err, messages) {
                    if (err)
                        res.send(err)
                    var msgs = [];
                    for (var x = 0; x < messages.length; x++) {
                        if (messages[x].sessionId === req.body.sessionId) {
                            msgs.push(messages[x]);
                        }
                    }
                    res.json(msgs);
                });
            }
        });

    });

    // update message and send back all messages for sessionId after update
    app.put('/api/messages/:message_id', function (req, res) {
        Message.findById(req.params.message_id, function (err, message) {
            if (!message)
                return next(new Error('Error geting message to update!'));
            else {
                // update a message, information comes from AJAX request from Angular
                // do your updates here
                message.text = req.body.text,
                    message.likes = req.body.likes,
                    message.type = req.body.type

                message.save(function (err) {
                    if (err) {
                        console.log('error :', err);
                    } else {
                        console.log('success');
                        // get and return all the messages after you create another
                        Message.find(function (err, messages) {
                            if (err)
                                res.send(err)
                            var msgs = [];
                            for (var x = 0; x < messages.length; x++) {
                                if (messages[x].sessionId === req.body.sessionId) {
                                    msgs.push(messages[x]);
                                }
                            }
                            res.json(msgs);
                        });
                    }
                });
            }
        });

    });

    app.delete('/api/messages/:message_id', function (req, res) {
        Message.findById(req.params.message_id, function (err, message) {
            if (!message)
                return next(new Error('Error geting message to update!'));
            else {
                Message.remove({
                    _id: req.params.message_id
                }, function (err, result) {
                    if (err) {
                        console.log('error :', err);
                        res.send(err);
                    } else {
                        Message.find(function (err, messages) {
                            if (err) {
                                res.send(err)
                            }
                            var msgs = [];
                            for (var j = 0; j < messages.length; j++) {
                                if (messages[j].sessionId === message.sessionId) {
                                    msgs.push(messages[j]);
                                }
                            }
                            res.json(msgs);
                        });
                    }

                });

            }
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};