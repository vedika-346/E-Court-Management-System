const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const multer = require("multer");
const fs = require("fs");

// 📁 Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ➕ Add new case
router.post("/add", async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.json(newCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Get all cases
router.get("/", async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Update case (assign judge/lawyer/status)
router.put("/:id", async (req, res) => {
  try {
    await Case.findByIdAndUpdate(req.params.id, req.body);
    res.send("Updated");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📤 Upload evidence file
router.put("/:id/upload-evidence", upload.single("document"), async (req, res) => {
  try {
    const { uploadedBy, uploadedByRole } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          evidence: {
            fileName: req.file.originalname,
            filePath: `/uploads/${req.file.filename}`,
            uploadedBy,
            uploadedByRole,
          },
        },
      },
      { new: true }
    );

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ Delete evidence file
router.delete("/:caseId/delete-evidence/:index", async (req, res) => {
  try {
    const { caseId, index } = req.params;

    const caseData = await Case.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    const file = caseData.evidence[index];

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // delete file from uploads folder
    const filePath = `.${file.filePath}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // remove from DB
    caseData.evidence.splice(index, 1);
    await caseData.save();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;