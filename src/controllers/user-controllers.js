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
					.select("-__v -password -createdAt -updatedAt ")
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
					.select("-__v -password -createdAt -updatedAt ")
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
				.select("-__v -password -createdAt -updatedAt ")
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
				`There are no users with that filter under application`
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
