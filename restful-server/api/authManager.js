const apiResponse = require("./apiResponse");
const logger = require("infrastructure").logger;
const config = require("../config");
const jwt = require("jsonwebtoken");

exports.sign = function (id, role, res, callback) {
  try {
    let date = new Date(Date.now() + config.token_expires_in * 1000);

    let token = jwt.sign(
      {
        id: id,
        expireToken: date.toISOString(),
        role: role,
      },
      config.secret,
      {
        expiresIn: config.token_expires_in,
      }
    );

    callback(token, date.toISOString());
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.signTemp = function (mobilePhone, code, res, callback) {
  try {
    let token = jwt.sign(
      { mobilePhone: mobilePhone, code: code },
      config.secret_temp,
      {
        expiresIn: config.token_expires_in_temp,
      }
    );

    let date = new Date(Date.now() + config.token_expires_in * 1000);

    callback(token, date.toISOString());
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.authentication = function (req, res, callback) {
  try {
    var token = req.headers["x-access-token"];

    if (!token) {
      apiResponse.sendUnAuthorized(res);
      console.log(req)
      logger.log_info("account authentication failed");
      return;
    }
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        apiResponse.sendUnAuthorized(res);

        logger.log_info("account authentication failed");
        return;
      }
      callback(decoded.id);
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
    return;
  }
};

exports.authenticationWithRole = function (req, res, roles, callback) {
  try {
    var token = req.headers["x-access-token"];
    if (!token) {
      apiResponse.sendUnAuthorized(res);
      logger.log_info("account authentication failed");
      return;
    }
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        apiResponse.sendUnAuthorized(res);
        logger.log_info("account authentication failed");
        return;
      }
      let role = checkRoles(token, roles);
      if (!role) {
        apiResponse.sendNotAccessed(
          res,
          "سطح کاربری شما به این درخواست دسترسی لازم را ندارد."
        );
        logger.log_info("سطح کاربری شما به این درخواست دسترسی لازم را ندارد.");
        return;
      }
      callback(decoded.id, role);
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
    return;
  }
};

exports.authenticationTemp = function (tempToken, res, callback) {
  try {
    jwt.verify(tempToken, config.secret_temp, function (err, decoded) {
      if (err) {
        apiResponse.sendUnAuthorized(res);
        logger.log_info("account authentication failed");
        return;
      }
      callback(decoded);
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
    return;
  }
};

function checkRoles(token, roles) {
  let role = getRoleFromToken(token);
  let index = roles.findIndex((item) => {
    return String(item) === String(role);
  });
  return index != -1 ? String(role) : false;
}

function getRoleFromToken(token) {
  // let jwtJson = parseJwt(token);
  // let roles = Array.isArray(jwtJson.role) ? jwtJson.role : [jwtJson.role];
  // return JSON.parse(JSON.stringify(roles));
  let jwtJson = parseJwt(token);
  return jwtJson.role;
}

function getRoleFromDatabase(token) {
  // let jwtJson = parseJwt(token);
  // let roles = Array.isArray(jwtJson.role) ? jwtJson.role : [jwtJson.role];
  // return JSON.parse(JSON.stringify(roles));
  let jwtJson = parseJwt(token);
  return jwtJson.role;
}

function parseJwt(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let base64Decode = Buffer.from(base64, "base64");
  let jsonPayload = decodeURIComponent(
    String(base64Decode)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
