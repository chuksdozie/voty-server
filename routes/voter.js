var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");
const { isLoggedIn } = require("../middlewares/index");

const {
  signUpOrganization,

  verifyEmail,
  loginOrganization,
  updateOrganizationById,
  changePasswordUserById,
  getAllOrganizations,
} = require("../controllers/auth");
const { addNewCandidateQuery } = require("../controllers/candidate");
const { createNewVoter, verifyVoter } = require("../controllers/voter");

/* Create New Voter. */
router.post("/new-voter", async function (req, res, next) {
  try {
    const { first_name, last_name, email, phonenumber, address } = req.body;
    const data = await createNewVoter({
      first_name,
      last_name,
      email,
      phonenumber,
      address,
    });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    next(error);
  }
});

router.get("/verify", async (req, res) => {
  try {
    const { voter_id } = req.body;
    const data = await verifyVoter(voter_id);
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
    return;
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await getAllOrganizations();
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
    return;
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await loginOrganization({
      email,
      password,
    });
    console.log({ data });
    res.status(httpStatus.OK).json({ data });
    return;
  } catch (error) {
    console.log(error.message);
    next(error);
    return;
  }
});

router.put("/update/:id", isLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      phonenumber,
      logo,
      address,
      city,
      state,
      country,
    } = req.body;
    const data = await updateOrganizationById(id, {
      name,
      description,
      phonenumber,
      logo,
      address,
      city,
      state,
      country,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/change-password/:id", isLoggedIn, async function (req, res, next) {
  try {
    const id = req.params;
    const { old_password, new_password, confirm_new_password } = req.body;
    const data = await changePasswordUserById(id, {
      old_password,
      new_password,
      confirm_new_password,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
