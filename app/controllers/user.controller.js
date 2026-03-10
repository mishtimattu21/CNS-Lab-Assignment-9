exports.allAccess = (req, res) => {
  res.status(200).json({ message: "Public Content." });
};

exports.userBoard = (req, res) => {
  res.status(200).json({ message: "User Content." });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({ message: "Admin Content." });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json({ message: "Moderator Content." });
};
