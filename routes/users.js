

var express = require('express');
var router = express.Router();

var models = require('../models');

// var passport = require('../config/passport');

const passport = require('passport');


/* GET users listing. */
router.get('/', function(req, res, next) {
  models.users.findAll({
    // attributes: ['actor_id', 'first_name', 'last_name'],
    // include: [{
      // model: models.users
      // attributes: ['film_id', 'title', 'description', 'rental_rate', 'rating']
  //   }]
  })

  .then(usersFound => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(usersFound));
  });
});

  
router.get('/signup', function(req, res, next) {
  res.render('signup');
});


router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: req.body.password
      }
    })

    .spread(function(result, created) {

      if (created) {
        res.redirect('/users/login');  

      } else {
        res.send('This user already exists');
      }
    });
});


// A FEW LINES DIFFERENT, CHECK IF DOESN'T WORK
router.get('/profile/:id', function (req, res, next) {
  if (req.user) {
    models.users
      .findByPk(parseInt(req.user.UserId))
      .then(user => {
        if (user) {
          res.render('profile', {
            UserId: req.user.UserId,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Username: user.Username
          });
        } else {
          res.send('User not found');
        }
      });
  } else {
    res.redirect('/users/login');
  }
});

router.post('/login', passport.authenticate('local', { 
  failureRedirect: '/users/login' 
}),

  function (req, res, next) { 
    res.redirect('profile/' + req.user.UserId); 
  }); 


  // May reinstate:
  
// router.get('/profile/:id', 
//   function (req, res, next) {
    
//   if (req.user.UserId === parseInt(req.params.id)) {
//       res.render('profile', {
//         FirstName: req.user.FirstName,
//         LastName: req.user.LastName,
//         Email: req.user.Email,
//         UserId: req.user.UserId,
//         Username: req.user.Username,
//       });

//     } else {
//         res.send('This is not your profile');
//     };
//   });

// router.get('/:id', function (req, res, next) {
//   models.users
//     .findByPk(parseInt(req.params.UserId), {
//       // include: [{ model: models.users }]
//     })

//     .then(usersFound => {
//       res.setHeader('Content-Type', 'application/json');
//       res.send(JSON.stringify(usersFound));
//     })
// });


router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/users/login');
});


router.get('/specificUser/:id', 
  function (req, res, next) {
  
  if (req.user.Admin === true) {
    
    let viewUser = parseInt(req.params.id);
    models.users
      .find({
        where: {
          UserId: viewUser
        },
      })

      .then(user => {
        res.render('specificUser', {
          FirstName: user.FirstName,
          LastName: user.LastName,
          Username: user.Username,
          Admin: user.Admin,
          createdAt: user.createdAt,
          UserId: user.UserId
        });
      });

  } else {
    res.send('Access Denied, please login as admin.');
  }
});


router.delete("/:id/delete", function (req, res, next) {
    if (req.user.Admin === true) {

      let userId = parseInt(req.params.id);
      models.users
        .update(
          {
            Deleted: 'true'
          },
          {
            where: {
              UserId: userId
            }
          }
        )

        .then(track => {
          models.users
            .update(
              {
                Deleted: 'true'
              },
              {
                where: {
                  UserId: userId
                }
              }
            )

            .then(users => {
              res.redirect('/users/');
            });
        });

    } else {
      res.send('Access Denied, please login as admin.');
    }
  });

//   let usersId = parseInt(req.params.id);
//   models.users
//     .destroy({
//       where: { users_id: usersId }
//     })
//     .then(result => res.redirect('/users'))
//     .catch(err => {
//       res.status(400);
//       res.send("There was a problem deleting the user.  Please make sure you are specifying the correct id.");
//     });
// });


module.exports = router;
