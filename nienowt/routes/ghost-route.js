'use strict';
let Ghost = require(__dirname + '/../models/ghost-model');
let Powers = require(__dirname + '/../models/powers-model');

module.exports = (router) => {
  let decode = require('../lib/auth');

  router.use(decode);
  router.use('/ghosts/:id', (req, res, next) => {
    if (req.decodedToken.id !== req.params.id) {
      res.write('DENIED');
      return res.end();
    }
    next();
  });

  router.route('/ghosts')
    .get((req, res) => {
      Ghost.find({})
        .populate('powers')
        .populate('haunting')
        .exec((err, ghosts) => {
          res.json(ghosts);
          res.end();
        });
    });

  router.route('/ghosts/:id')
  .get((req, res) => {
    Ghost
    .findOne({_id: req.params.id})
    .populate('powers')
    .populate('haunting')
    .exec((err, ghost) => {
      res.json(ghost);
      res.end();
    });
  })
    .put((req, res) => {
      console.log(Object.keys(req.body.ghost));
      Ghost.findByIdAndUpdate(req.params.id,{ $set: req.body.ghost }, (err, ghost) => {
        if (err) {
          console.log(err);
          return res.end();
        }
        Powers.findByIdAndUpdate(ghost.powers, { $set: req.body.powers}, (err) =>{
          if (err) {
            console.log(err);
            return res.end();
          }
          console.log('powers stored');
        });
        res.write('Ghost updated!');
        res.end();
      });
    })
      .delete((req, res) => {
        Ghost.findById(req.params.id, (err, ghost) => {
          Powers.findById(ghost.powers, (err, power) =>{
            if (err) res.send('oh no');
            power.remove(() =>{
              console.log('Powers gone');
            });
          });
          ghost.remove(() => {
            res.send('GHOST BUSTED');
          });
        });
      });

  router.route('/coolghosts')
    .get((req, res) => {
      var stream = Ghost.where('isEvil').ne(true).stream();
      var ghosts = '';
      stream.on('data', (doc) => {
        ghosts += doc.name + ' ';
      }).on('end', ()=> {
        res.write('These ghosts are guaranteed to be pretty good ghosts: '+ghosts);
        res.end();
      });
    });

  router.route('/ghosteyes')
    .get((req, res) => {
      Ghost.aggregate([
          {$group: {_id: '$isEvil', average: {$avg: '$numEyes'}}}
      ],(err, result) => {
        res.write('Our Evil ghosts, on average, have '+ result[0].average + ' eyes, while our non-evil ghosts average '+ result[1].average + ' eyes');
        res.end();
      });
    });
};
