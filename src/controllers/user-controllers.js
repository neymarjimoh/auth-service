const ErrorHelper = require("../helpers/errorHelper");
const { User } = require("../models/");

exports.getAllUsersDetails = async (req, res, next) => {
	const { appName, orgname } = req.params;
	const { page = 1, limit = 10, filter } = req.query;

	try {
		let err;
		let count;
		let users;
		if (filter) {
			if (filter.toString() == "active") {
				users = await User.find({
					app_name: appName,
					organisation_name: orgname,
					status: "active",
				})
					.select("-__v -password -createdAt -updatedAt -unique_id -app_name ")
					.limit(limit * 1)
					.skip((page - 1) * 1)
					.exec();
				count = await User.countDocuments({
					app_name: appName,
					organisation_name: orgname,
					status: "active",
				});
			} else if (filter.toString() == "disabled") {
				users = await User.find({
					app_name: appName,
					organisation_name: orgname,
					status: "disabled",
				})
					.select("-__v -password -createdAt -updatedAt -unique_id -app_name ")
					.limit(limit * 1)
					.skip((page - 1) * 1)
					.exec();
				count = await User.countDocuments({
					app_name: appName,
					organisation_name: orgname,
					status: "disabled",
				});
			}
		} else {
			users = await User.find({
				app_name: appName,
				organisation_name: orgname,
			})
				.select("-__v -password -createdAt -updatedAt -unique_id -app_name ")
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			count = await User.countDocuments({
				app_name: appName,
				organisation_name: orgname,
			});
		}

		if (count == 0) {
			err = new ErrorHelper(
				404,
				"fail",
				`There are no users with that filter value under the ${appName}`
			);
			return next(err, req, res, next);
		}

		return res.status(200).json({
			message: "Users found",
			total_results: count,
			users,
			total_pages: Math.ceil(count / limit),
			current_page: page,
		});
	} catch (error) {
		console.log(`Error in getting users details >>> ${error.message}`);
		return next(error);
	}
};

exports.getSingleUserDetails = async (req, res, next) => {
	const { appName, orgname, email } = req.params;

	try {
		const user = await User.findOne({
			app_name: appName,
			organisation_name: orgname,
			email: email,
		}).select("-__v -password -createdAt -updatedAt -unique_id -app_name");

		if (!user) {
			err = new ErrorHelper(
				404,
				"fail",
				`There is no user registered with that email under ${appName}`
			);
			return next(err, req, res, next);
		}

		return res.status(200).json({
			message: "User found",
			user,
		});
	} catch (error) {
		console.log(`Error in getting the user's details >>> ${error.message}`);
		return next(error);
	}
};

exports.changeUserStatus = async (req, res, next) => {
	const { appName, orgname, id } = req.params;
	const { status_to } = req.query;
	try {
		let err;
		const user = await User.findOne({
			_id: id,
			app_name: appName,
			organisation_name: orgname,
		});

		if (!user) {
			return res.status(404).json({
				message: `User is not registered under ${appName}`,
			});
		}

		let userStatus;

		if (status_to.toString() === "disable") {
			if (user.status == "disabled") {
				err = new ErrorHelper(409, "fail", "User has been disabled initially");
				return next(err, req, res, next);
			}
			userStatus = await User.findOneAndUpdate(
				{
					app_name: appName,
					organisation_name: orgname,
					_id: id,
				},
				{ status: "disabled" }
			);

			return res.status(200).json({
				message: `User with the Id - ${id} under the application - ${appName} has been disabled `,
			});
		}

		if (status_to.toString() === "enable") {
			if (user.status == "active") {
				err = new ErrorHelper(409, "fail", "User has been enabled initially");
				return next(err, req, res, next);
			}
			userStatus = await User.findOneAndUpdate(
				{
					app_name: appName,
					organisation_name: orgname,
					_id: id,
				},
				{ status: "active" }
			);

			return res.status(200).json({
				message: `User with the Id - ${id} under the application - ${appName} has been enabled `,
			});
		}
	} catch (error) {
		console.log(`Error in changing user's status >>> ${error.message}`);
		return next(error);
	}
};
