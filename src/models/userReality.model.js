"use strict";
var db = require("../../config/db.config");
const { getPagination, getPaginationData } = require("../helpers/fn");
const { executeQuery } = require("../helpers/utils");
const moment = require("moment");
var userReality = function () {};

userReality.getMyReality = async function (id) {
  try {
    const query = "select * from user_proposed_reality where profileId = ?";
    const values = [id];
    const userReality = await executeQuery(query, values);
    console.log(userReality);
    return userReality;
  } catch (error) {}
};

userReality.addEditReality = async function (params) {
  try {
    const reality = params.reality;
    const profileId = params.profileId;
    reality.forEach(async (element) => {
      const data = {
        rulesNo: element.rulesNo,
        rulesDescription: element.rulesDescription,
        profileId: profileId,
      };
      const updateQuery = `UPDATE user_proposed_reality SET rulesDescription = '${
        data.rulesDescription
      }',updatedDate = '${moment(new Date())
        .utc()
        .format("YYYY-MM-DD HH:mm:ss")}' WHERE rulesNo = ${
        data.rulesNo
      } AND profileId = ${data.profileId};`;
      const insertQuery = `INSERT INTO user_proposed_reality (profileId, rulesNo, rulesDescription) SELECT ${data.profileId}, ${data.rulesNo}, '${data.rulesDescription}' FROM dual WHERE NOT EXISTS (SELECT 1 FROM user_proposed_reality WHERE rulesNo = ${data.rulesNo} AND profileId = ${data.profileId});`;
      const updateData = await executeQuery(updateQuery);
      const addData = await executeQuery(insertQuery);
      console.log(updateData, addData);
    });
    return reality;
  } catch (error) {
    return error;
  }
};
module.exports = userReality;
