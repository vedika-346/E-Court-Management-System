const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "pending",
  },
  assignedJudge: {
    type: String,
    default: "Not Assigned",
  },
  assignedLawyer: {
    type: String,
    default: "Not Assigned",
  },
  hearingDate: {
    type: String,
    default: "Not Scheduled",
  },
  createdBy: {
    type: String,
    default: "",
  },
  createdByRole: {
    type: String,
    default: "",
  },
  evidence: [
    {
      fileName: String,
      filePath: String,
      uploadedBy: String,
      uploadedByRole: String,
    },
  ],
});

module.exports = mongoose.model("Case", caseSchema);