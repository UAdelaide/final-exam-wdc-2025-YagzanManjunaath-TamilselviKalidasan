var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  try{

  }catch(err){
    const error_message = `Error occurred during request ${err.message}`;
    console.err(error_message);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

module.exports = router;
