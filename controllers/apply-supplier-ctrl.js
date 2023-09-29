const ApplySupplierModal = require("../models/apply-supplier-model");

module.exports.applySupplier = async (req, res) => {
  const { name, email, address, business, contact } = req.body;
  const newApplier = {
    name: name,
    email: email,
    address: address,
    business: business,
    contact: contact,
  };
  const applier = new ApplySupplierModal(newApplier);

  try {
    applier.save();
    return res.status(200).json({ data: applier });
  } catch (error) {
    return res.status(501).json({ data: error });
  }
};

module.exports.getSupplierRequests = async (req, res) => {
  try {
    const applierList = await ApplySupplierModal.find();
    return res.status(200).send({ data: applierList });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports.deleteSupplierRequest = async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ApplySupplierModal.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Deleted!" });
  }
  return res.status(401).json({ msg: "Not found" });
};
