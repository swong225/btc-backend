const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  res.json([
    {
      id: 1,
      username: 'testUN',
    },
    {
      id: 2,
      username: 'anotherTest',
    },
  ]);
});

module.exports = router;
