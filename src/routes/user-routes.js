const router = require("express").Router();
const { getAllUsersDetails } = require("../controllers/user-controllers");

router.get("/:orgname/:appName/users", getAllUsersDetails);

module.exports = router;
