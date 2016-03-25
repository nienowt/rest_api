'use strict';

let Ghost = require(__dirname + '/../models/ghost-model');
let Powers = require(__dirname + '/../models/powers-model');

module.exports  = (publicRouter) => {

  publicRouter.route('/new-ghost')
    .post((req, res) => {
      var based = req.headers.authorization.split(' ')[1];
      var authArr = new Buffer(based, 'base64').toString().split(':');
      var newPowers = new Powers(req.body.powers);
      newPowers.save((err) => {
        if (err) res.send('powers not recieved yo');
        var newGhost = new Ghost({
          name: authArr[0],
          isEvil: req.body.isEvil,
          numEyes: req.body.numEyes,
          powers: newPowers._id,
          password: authArr[1]
        });
        newGhost.save((err, ghost) => {
          if (!ghost) {
            console.log(err);
            res.write('Name Taken');
            return res.end();
          }
          if (ghost){
            res.write('Ghost Saved');
            return res.end();
          }
        });
      });
    });

  publicRouter.route('/login')
    .post((req, res) => {
      var based = req.headers.authorization.split(' ')[1];
      var authArr = new Buffer(based, 'base64').toString().split(':');
      Ghost.findOne({name: authArr[0]}, (err, ghost) => {

        if (err) console.log(err);
        var valid = ghost.compareHash(authArr[1]);
        if (!valid) {
          res.write('Invalid credentials');
          return res.end();
        } else {
          res.json({token: ghost.genToken()});
          res.end();
        }
      });
    });
};
