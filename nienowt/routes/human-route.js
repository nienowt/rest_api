'use strict';

module.exports = (router) => {
  let Human = require(__dirname + '/../models/human-model');

  router.route('/humans')
    .get((req, res) => {
      Human.find({}, (err, humans) => {
        res.json({humans});
        res.end();
      });
    })
      .post((req, res) => {
        var newHuman = new Human(req.body);
        newHuman.save((err, human) => {
          res.json(human);
          res.end();
        });
      });

  router.route('/humans/:id')
  .get((req, res) => {
    Human.findById(req.params.id, (err, human) => {
      res.json(human);
      res.end();
    });
  })
    .put((req, res) => {
      Human.findByIdAndUpdate(req.params.id,{ $set: req.body }, (err) => {
        if (err) res.end(err);
        res.write('HUMAN ALTERED');
        res.end();
      });
    })
      .delete((req, res) => {
        Human.findById(req.params.id, (err, human) => {
          human.remove(() => {
            res.write('HUMAN ELIMINATED');
            res.end();
          });
        });
      });

  router.route('/howmanyteethdothehumanshavecollectively')
    .get((req, res) => {
      Human.aggregate([
          {$group: {_id: 'null', sum: {$sum: '$numTeeth'}}}
      ],(err, result) => {
        res.write('Altogether the humans have ' + result[0].sum + ' teeth');
        res.end();
      });
    });


  router.route('/howmanyofthesehumansarecool')
  .get((req,res) => {
    Human.count({isCool: true}, (err, count) => {
      res.write(count + ' of the humans in our database can be considered reliably cool');
      res.end();
    });
  });
};
