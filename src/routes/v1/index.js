const { Router } = require('express');

const userController = require('../../controllers/user');
const deviceController = require('../../controllers/device');
const paramController = require('../../controllers/param')
const Authz = require('../../middlewares/authz');

const router = Router();

router.route('/user/login').post(userController.login)
router.route('/user/register').post(userController.register)
router.route('/user/').get(Authz.verifyToken, userController.getProfile)
                     .put(Authz.verifyToken, userController.updateProfile)
router.route('/user/change-password').put(Authz.verifyToken, userController.changePassword)


router.route('/device/:id').get(Authz.verifyToken, deviceController.getDevice)
                           .put(Authz.verifyToken, deviceController.updateDevice)

router.route('/device/').get(Authz.verifyToken, deviceController.getAllDevices)

router.route('/params/:deviceId').get(Authz.verifyToken, paramController.getParams)

// router.post('/device/', deviceController.create);

module.exports = router;

