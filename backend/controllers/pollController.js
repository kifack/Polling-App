const Poll = require("../models/Poll");
const User = require("../models/User");
// Create poll
exports.createPoll = async (req, res) => {
  const { question, type, options } = req.body;
  const creator = req.user._id;

  if (!question || !type) {
    return res.status(400).json({ message: "Question and type are required" });
  }

  try {
    let proccessedOptions = [];

    switch (type) {
      case "single-choice":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "Single choice poll mush have at least two options.",
          });
        }

        proccessedOptions = options.map((option) => ({ optionText: option }));
        break;

      case "rating":
        proccessedOptions = [1, 2, 3, 4, 5].map((value) => ({
          optionText: value.toString(),
        }));
        break;
      case "yes/no":
        proccessedOptions = ["Yes", "No"].map((value) => ({
          optionText: value.toString(),
        }));
        break;
      case "open-ended":
        proccessedOptions = [];
        break;
      case "image-based":
        if (!options || options.length < 2) {
          return res.status(400).json({
            message: "Image based poll mush have at least two images.",
          });
        }
        proccessedOptions = options.map((url) => ({
          optionText: url,
        }));
        break;
      default:
        return res.status(400).json({ message: "Invalid poll type" });
    }

    const newPoll = await Poll.create({
      question,
      type,
      options: proccessedOptions,
      creator,
    });

    return res.status(201).json(newPoll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating poll", error: error.message });
  }
};

// Get all polls
exports.getAllPolls = async (req, res) => {
  const { type, creatorId, page = 1, limit = 10 } = req.query;

  const filter = {};

  const userId = req.user._id;
  if (type) filter.type = type;
  if (creatorId) filter.creator = creatorId;

  try {
    // Calculate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    const userSelect = "fullName username email profileImageUrl";

    // Fetch polls with pagination
    const polls = await Poll.find(filter)
      .populate("creator", userSelect)
      .populate({
        path: "responses.voterId",
        select: userSelect,
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // Add 'userHasVoted' flag for each poll
    const updatedPolls = updateUserPollsWithVote(polls, userId);

    // Get total count of polls for paginnation metadata
    const totalPolls = await Poll.countDocuments(filter);
    const stats = await Poll.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    // return res.json(stats);

    // Ensure all types are included in stats , even those with zero counts
    const allTypes = [
      {
        label: "Yes/No",
        type: "yes/no",
      },
      {
        label: "Single Choice",
        type: "single-choice",
      },
      {
        label: "Rating",
        type: "rating",
      },
      {
        label: "Image based",
        type: "image-based",
      },
      {
        label: "Open Ended",
        type: "open-ended",
      },
    ];

    const statsWithDefaults = allTypes
      .map((pollType) => {
        const stat = stats.find((item) => (item.type = pollType.type));
        return {
          label: pollType.label,
          type: pollType.type,
          count: stat ? stat.count : 0,
        };
      })
      .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPolls / pageSize),
      totalPolls,
      stat: statsWithDefaults,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all polls", error: error.message });
  }
};

exports.getVotedPolls = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  try {
    // Calculate pagination parameters
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;
    const userSelect = "fullName username email profileImageUrl";

    // Fetch polls where user has voted
    const polls = await Poll.find({ voters: userId })
      .populate("creator", userSelect)
      .populate({
        path: "responses.voterId",
        select: userSelect,
      })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // Add 'userHasVoted' flag for each poll
    const updatedPolls = updateUserPollsWithVote(polls, userId);

    // Get total count of polls for paginnation metadata
    const totalVotedPolls = await Poll.countDocuments({ voters: userId });
    res.status(200).json({
      polls: updatedPolls,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalVotedPolls / pageSize),
      totalVotedPolls,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching voted polls", error: error.message });
  }
};
exports.getPollById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch polls where user has voted
    const poll = await Poll.findById(id)
      .populate("creator", "username email")
      .populate({
        path: "responses.voterId",
        select: "fullName username email profileImageUrl",
      });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    return res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching  poll with id: " + id,
      error: error.message,
    });
  }
};
exports.voteOnPoll = async (req, res) => {
  const { id } = req.params;

  const { optionIndex, responseText } = req.body;
  const voterId = req.user._id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.closed) {
      return res.status(400).json({ message: "Poll is closed" });
    }

    if (poll.voters.includes(voterId)) {
      return res
        .status(400)
        .json({ message: "You have already voted on this poll." });
    }

    if (poll.type == "open-ended") {
      if (!responseText) {
        return res
          .status(400)
          .json({ message: "Response text is required for open ended polls." });
      }

      poll.responses.push({ voterId, responseText });
    } else {
      if (
        optionIndex == undefined ||
        optionIndex < 0 ||
        optionIndex >= poll.options.length
      ) {
        return res.status(400).json({
          message: "Invalid option index.",
        });
      }

      poll.options[optionIndex].votes++;
    }
    poll.voters.push(voterId);
    await poll.save();
    return res.status(200).json(poll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error voting  poll", error: error.message });
  }
};
exports.closePoll = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to close this poll." });
    }
    poll.closed = true;
    await poll.save();
    res.status(200).json({ message: "Poll closed successfully.", poll });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error closing poll", error: error.message });
  }
};
exports.bookmarkPoll = async (req, res) => {
  const { id } = req.params; // Poll id
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = user.bookmarkedPolls.includes(id);
    if (isBookmarked) {
      user.bookmarkedPolls = user.bookmarkedPolls.filter(
        (pollId) => pollId.toString() != id
      );
      await user.save();

      return res.status(200).json({
        message: "Poll removed from bookmarks",
        bookmarkedPolls: user.bookmarkedPolls,
      });
    }

    user.bookmarkedPolls.push(id);
    await user.save();
    return res.status(200).json({
      message: "Poll  bookmarked successfully.",
      bookmarkedPolls: user.bookmarkedPolls,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error bookmarking poll", error: error.message });
  }
};
exports.getBookmarkedPolls = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate({
      path: "bookmarkedPolls",
      populate: {
        path: "creator",
        select: "fullName username email profileImageUrl",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const bookmarkedPolls = updateUserPollsWithVote(
      user.bookmarkedPolls,
      userId
    );
    res.status(200).json({ bookmarkedPolls });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookmarked polls",
      error: error.message,
    });
  }
};
exports.deletePoll = async (req, res) => {
  const { id } = req.params; // Poll id
  const userId = req.user.id;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (poll.creator.toString() != userId) {
      return res
        .status(403)
        .json({ message: "Your not authorized to delete this poll." });
    }
    await User.findByIdAndUpdate(userId, { $pull: { bookmarkedPolls: id } });
    await Poll.findByIdAndDelete(id);
    res.status(200).json({ message: "Poll delted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting poll", error: error.message });
  }
};

function updateUserPollsWithVote(polls, userId) {
  return polls.map((poll) => {
    const userHasVoted = poll.voters.some((voterId) => voterId.equals(userId));

    return { ...poll.toObject(), userHasVoted };
  });
}
