const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  createPoll,
  getAllPolls,
  getVotedPolls,
  getPollById,
  voteOnPoll,
  closePoll,
  bookmarkPoll,
  getBookmarkedPolls,
  deletePoll,
} = require("../controllers/pollController");

const router = express.Router();

router.post("/create", protect, createPoll);
router.get("/get-all-polls", protect, getAllPolls);
router.get("/voted-polls", protect, getVotedPolls);
router.get("/:id", protect, getPollById);
router.post("/:id/vote", protect, voteOnPoll);
router.post("/:id/close", protect, closePoll);
router.post("/:id/bookmark", protect, bookmarkPoll);
router.get("/user/bookmarked", protect, getBookmarkedPolls);
router.delete("/:id", protect, deletePoll);

module.exports = router;
