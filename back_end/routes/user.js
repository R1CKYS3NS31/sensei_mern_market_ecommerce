var express = require('express');
var router = express.Router();

// controllers paths
const getUser = require('../controllers/getUser');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/', getUser)

// Respond to POST request on the root route (/user), the application’s home page:

router.post('/', (req, res) => {
  res.send('Got a POST request')
})

// Respond to a PUT request to the /user route:

router.put('/', (req, res) => {
  res.send('Got a PUT request at /user')
})

// Respond to a DELETE request to the /user route:

router.delete('/', (req, res) => {
  res.send('Got a DELETE request at /user')
})


module.exports = router;
