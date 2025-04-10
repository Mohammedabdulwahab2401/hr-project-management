const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Leave Route Working');
});

module.exports = router;
