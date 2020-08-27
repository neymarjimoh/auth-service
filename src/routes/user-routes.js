const router = require("express").Router();
const {
	getAllUsersDetails,
	getSingleUserDetails,
	changeUserStatus,
} = require("../controllers/user-controllers");

router.get("/:orgname/:appName/users", getAllUsersDetails);
router.get("/:orgname/:appName/:email", getSingleUserDetails);
router.patch("/:orgname/:appName/change/:id", changeUserStatus);

module.exports = router;
