var ServiceModel = require("../models/service-model");
const UserModel = require("../models/user-model");
var WorkerModel = require("../models/worker-model");

module.exports.getDashboardData = async (req, res) => {
  try {
    const services = await ServiceModel.count();
    const users = await UserModel.count();
    const workers = await WorkerModel.count();
    const resValue = {
      services,
      users,
      workers,
    };
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};
