const Profile = require("../models/profile.model");
const utils = require("../helpers/utils");
const environments = require("../environments/environment");
const { getPagination, getCount, getPaginationData } = require("../helpers/fn");
const User = require("../models/user.model");
const { query } = require("../../config/db.config");

exports.create = function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Error in application" });
  } else {
    // console.log(req.body);
    const profile = new Profile({ ...req.body });
    Profile.create(profile, async function (err, profile) {
      if (err) return utils.send500(res, err);
      return res.json({
        error: false,
        message: "Data saved successfully",
        data: profile,
      });
    });
  }
};

exports.FindProfieById = async function (req, res) {
  if (req.params.id) {
    const id = req.params.id;
    console.log(id);
    const profile = await Profile.FindById(id);
    if (!profile) {
      return utils.send500({ error: true, message: "not found" });
    } else {
      return res.json({ data: profile, error: false });
    }
    // Profile.FindById(id, async function   (err, profile) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //   }
    // });
  }
};

// exports.FindProfieById = function (req, res) {
//   if (req.params.id) {
//     const id = req.params.id;
//     console.log(id);
//     Profile.FindById(id, async function (err, profile) {
//       if (err) {
//         console.log(err);
//         return utils.send500(res, err);
//       } else {
//         return res.json({ data: profile, error: false });
//       }
//     });
//   }
// };

exports.updateProfile = async function (req, res) {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).send({ error: true, message: "Error in application" });
  } else {
    const profileId = +req.params.id;
    const reqBody = req.body;
    const profile = new Profile({ ...reqBody });
    const existingUsername = req.user.username;
    const isOccupied = await getUsername(reqBody.Username, existingUsername);

    console.log(isOccupied);
    if (isOccupied.length) {
      return res
        .status(400)
        .json({ error: true, message: "Username is already exist" });
    }

    if (profileId === req.user.id) {
      if (req.body.UserID) {
        const updateUserData = {
          Username: reqBody?.Username,
          FirstName: reqBody?.FirstName,
          LastName: reqBody?.LastName,
          Address: reqBody?.Address,
          Zip: reqBody?.Zip,
          City: reqBody?.City,
          State: reqBody?.State,
          Country: reqBody?.Country,
        };

        User.update(req.body.UserID, updateUserData, (err, result) => {
          if (err) return utils.send500(res, err);
        });
      }

      Profile.update(profileId, profile, async function (err, profile) {
        if (err) return utils.send500(res, err);
        return res.json({
          error: false,
          message: "Profile update successfully",
        });
      });
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  }
};

const getUsername = async function (username, exisingusername) {
  const query =
    "select Username from users where Username = ? and Username not in (?)";
  const value = [username, exisingusername];
  const user = await utils.executeQuery(query, value);
  return user;
};

exports.getUsersByUsername = async function (req, res) {
  const { searchText } = req.query;
  const data = await Profile.getUsersByUsername(searchText);
  return res.send({
    error: false,
    data: data,
  });
};

exports.editNotifications = async function (req, res) {
  const { id } = req.params;
  const { isRead } = req.query;
  Profile.editNotifications(id, isRead, function (err) {
    if (err) return utils.send500(res, err);
    res.json({ error: false, message: "Notification updated successfully" });
  });
};

exports.editNotificationSound = async function (req, res) {
  try {
    const { id } = req.user;
    const { property, value } = req.body;
    console.log("In====>", id, property, value);
    await Profile.editNotificationSound(id, property, value);
    return res.json({
      error: false,
      message: "successfully changed notification sound",
    });
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.getNotificationById = async function (req, res) {
  const { id } = req.params;
  const { page, size } = req.body;
  const { limit, offset } = getPagination(page, size);
  const notificationData = await Profile.getNotificationById(id, limit, offset);

  return res.send(
    getPaginationData(
      { count: notificationData.count, docs: notificationData.data },
      page,
      limit
    )
  );
  // return res.send({
  //   error: false,
  //   data: data,
  // });
};
exports.getNotification = async function (req, res) {
  const { id } = req.params;
  const data = await Profile.getNotification(id);
  return res.send({
    error: false,
    data: data,
  });
};

exports.deleteNotification = function (req, res) {
  Profile.deleteNotification(req.params.id, function (err, result) {
    if (err) return utils.send500(res, err);
    res.json({ error: false, message: "Notification deleted successfully" });
  });
};

exports.groupsAndPosts = async function (req, res) {
  try {
    const groupedPosts = await Profile.groupsAndPosts();

    return res.send(groupedPosts);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.getGroups = async function (req, res) {
  try {
    const groups = await Profile.getGroups();
    return res.send(groups);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.getGroupBasicDetails = async function (req, res) {
  try {
    const { uniqueLink } = req.params;
    const groupDetails = await Profile.getGroupBasicDetails(uniqueLink);

    return res.send(groupDetails);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.getGroupPostById = async function (req, res) {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const offset = page > 0 ? (page - 1) * limit : 0;

    const posts = await Profile.getGroupPostById(id, limit, offset);

    return res.send(posts);
  } catch (error) {
    console.log("error : ", error);
    return utils.send500(res, error);
  }
};

exports.getGroupFileResourcesById = async function (req, res) {
  try {
    const { id } = req.params;
    const posts = await Profile.getGroupFileResourcesById(id);

    return res.send(posts);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.groupsLists = async function (req, res) {
  try {
    const { page, size, search, pageType, startDate, endDate } = req.body;
    const { limit, offset } = getPagination(page, size);
    const groupedPosts = await Profile.groupsLists(
      limit,
      offset,
      search,
      pageType,
      startDate,
      endDate
    );

    return res.send(
      getPaginationData(
        { count: groupedPosts.count, docs: groupedPosts.data },
        page,
        limit
      )
    );
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.createGroup = async function (req, res) {
  try {
    const data = req.body;
    const groups = await Profile.createGroup(data);
    return res.send(groups);
  } catch (error) {
    return utils.send500(res, error);
  }
};
exports.editGroups = async function (req, res) {
  try {
    const { id } = req.params;
    const data = req.body.groupData;
    const membersIds = req.body.selectedMembers;
    const groups = await Profile.editGroups(id, data, membersIds);
    return res.send(groups);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.joinGroup = async function (req, res) {
  try {
    const { id } = req.user;
    const { researchProfileId } = req.body;
    const group = await Profile.joinGroup(id, researchProfileId);
    return res.send(group);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.leaveGroup = async function (req, res) {
  try {
    // const { id } = req.user;
    const { researchProfileId, profileId } = req.body;
    const group = await Profile.leaveGroup(profileId, researchProfileId);
    return res.send(group);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.deleteGroup = async function (req, res) {
  try {
    // const { id } = req.user;
    const { id } = req.params;
    const group = await Profile.deleteGroup(id);
    return res.send(group);
  } catch (error) {
    return utils.send500(res, error);
  }
};

exports.readAllNotifications = async function (req, res) {
  const { id } = req.params;
  Profile.readAllNotifications(id, function (err) {
    if (err) return utils.send500(res, err);
    res.json({ error: false, message: "Notification updated successfully" });
  });
};

exports.deleteAllNotification = function (req, res) {
  Profile.deleteAllNotification(req.params.id, function (err, result) {
    if (err) return utils.send500(res, err);
    res.json({ error: false, message: "Notification deleted successfully" });
  });
};
