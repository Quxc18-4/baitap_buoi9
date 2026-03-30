const express = require('express');
const router = express.Router();
const msgController = require('../controllers/messageController');

router.get('/:userID', msgController.getMessagesWithUser);
router.post('/', msgController.createMessage);
router.get('/', msgController.getLastMessages);

module.exports = router;