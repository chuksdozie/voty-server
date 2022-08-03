const {
  addNewCandidateQuery,
  getAllCandidatesQuery,
  getCandidateByCandidateIdQuery,
  getCandidateByIdQuery,
  updateCandidateByIdQuery,
  addNewVoterQuery,
  getVotersByEmailQuery,
  getVoterByVoterIdQuery,
  getAllVotersQuery,
  getVoterByIdQuery,
  updateVoterByIdQuery,
  signUpOrganizationQuery,
  getAllOrganizationsQuery,
  getOrganizationByEmailQuery,
  getOrganizationByNameQuery,
  verifyOrganizationQuery,
  getOrganizationByIdQuery,
  updateOrganizationByIdQuery,
  changePasswordByOrganizationIdQuery,
} = require("../queries/index");
const { sendMyMail } = require("../config/sendgrid");
const redis = require("../config/redis");
const uuid = require("uuid");
var httpStatus = require("http-status");
var { APIError } = require("../config/error");
const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
const { now, generateVoterId } = require("../utils");

const emailVerificationSetup = (email) => {
  // THIS IS TO GENERATE VERIFICATION LINK
  const token = uuid.v4();
  const emailKey = `${process.env.REDIS_PREFIX}-${token}`;
  const mainurl = `${process.env.BASE_URL}/org/verify/${token}`;
  redis.set(emailKey, email);

  const reciever = email;
  const mailSubject = "Welcome to Profiler";
  const mailContent = `<p>Thanks for registering, please <a href="${mainurl}", target="_blank"><button>Verify Email</button></a></p>`;

  return { reciever, mailContent, mailSubject };
};

const notifyVoter = (voter_email, voter_name, generated_id) => {
  const reciever = voter_email;
  const mailSubject = "Welcome to Voty";
  const mailContent = `<p>Hello ${voter_name}, from ${party} has been added to the voty platform</p>
                        <p>Congratulations!! You have been registered on the voty platform. Please use this ID when the time for voting comes</p>
                        <h1>${generated_id}</h1>
                        <h5>Please remember that vote buying or selling is a crime</h5>`;

  return { reciever, mailContent, mailSubject };
};

const createNewVoter = async (payload) => {
  try {
    // "id",
    // "first_name",
    // "last_name",
    // "voter_id",
    // "email",
    // "phonenumber",
    // "address",
    // "voted",
    // "verified",
    // "created_at",
    // "updated_at",
    // "voted_at",
    // "deleted_at",
    if (!payload.first_name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the voter's first name",
        errors: "No voter's first name",
      });
    }
    if (!payload.last_name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the voter's last name",
        errors: "No voter's last name",
      });
    }
    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter an email for this voter",
        errors: "No voter email",
      });
    }
    if (!payload.phonenumber) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter a phone number for this",
        errors: "No voter phone number",
      });
    }

    if (!payload.address) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter the voter's address",
        errors: "No voter's address",
      });
    }

    const voter = await getVotersByEmailQuery(payload.email);

    if (voter.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "A voter with this email already exists",
        errors: "Voter already exists",
      });
    }

    const generated_voter_id = generateVoterId();
    const voter_fullname = `${payload.first_name} ${payload.last_name}`;
    const notificationDetails = notifyVoter(
      payload.email,
      voter_fullname,
      generated_voter_id
    );

    const voterDetails = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      voter_id: generated_voter_id,
      email: payload.email,
      phonenumber: payload.phonenumber,
      address: payload.address,
    };
    const [data] = await addNewVoterQuery(voterDetails);
    sendMyMail(
      notificationDetails.reciever,
      notificationDetails.mailSubject,
      notificationDetails.mailContent
    );
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const verifyVoter = async (payload) => {
  try {
    if (!payload.voter_id) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please enter a voter's id",
        errors: "No voter's id",
      });
    }

    const voter = await getVoterByVoterIdQuery(payload.voter_id);

    if (!voter) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This Voter does not exist",
        errors: "This Voter does not exist",
      });
    }

    return voter;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const verifyEmail = async (token) => {
  try {
    const emailKey = `${process.env.REDIS_PREFIX}-${token}`;

    const keyExists = await redis.exists(emailKey);
    // if key does not exist
    if (keyExists === 0) {
      throw new Error("Invalid token");
    }
    const email = await redis.get(emailKey);
    const [verifiedUser] = await verifyOrganizationQuery(email);
    const { password, ...rest } = verifiedUser;
    return [rest, `${verifiedUser.name}, You have been verified`];
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const getAllOrganizations = async () => {
  try {
    const data = await getAllOrganizationsQuery();
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const loginOrganization = async (payload) => {
  try {
    if (!payload.email) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please insert an Email Address",
        errors: "Email Address not provided",
      });
    }
    const [organization] = await getOrganizationByEmailQuery(payload.email);

    if (!organization) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address does not exist, please sign up instead.",
        errors: "Email does not exists",
      });
    }

    if (!organization.verified) {
      // THIS IS TO GENERATE VERIFICATION LINK
      const emailSetUp = await emailVerificationSetup(payload.email);

      sendMyMail(
        emailSetUp.reciever,
        emailSetUp.mailSubject,
        emailSetUp.mailContent
      );
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please verify your account. Check your Email Address",
        errors: "Email Address not verified",
      });
    }
    const password = await payload.password;
    const hashedPassword = await organization.password;

    if (await argon2.verify(hashedPassword, password)) {
      const token = jwt.sign(
        {
          id: organization.id,
          email: organization.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      const pay = {
        name: payload.name || organization.name,
        description: payload.description || organization.description,
        phonenumber: payload.phonenumber || organization.phonenumber,
        logo: payload.logo || organization.logo,
        address: payload.address || organization.address,
        city: payload.city || organization.city,
        state: payload.state || organization.state,
        country: payload.country || organization.country,
        logged_at: now(),
        updated_at: organization.updated_at,
      };

      const [data] = await updateOrganizationByIdQuery(organization.id, pay);

      const { password, ...rest } = data;
      return { ...rest, token };
    } else {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        errors: "Incorrect Credentials",
        message: "Incorrect Credentials, Please check and try again",
      });
    }
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const updateOrganizationById = async (id, payload) => {
  try {
    const [organization] = await getOrganizationByIdQuery(id);
    console.log(6786, organization);
    if (!organization) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Organization does not exist",
        errors: "Organization does not exist",
      });
    }

    const pay = {
      name: payload.name || organization.name,
      description: payload.description || organization.description,
      phonenumber: payload.phonenumber || organization.phonenumber,
      logo: payload.logo || organization.logo,
      address: payload.address || organization.address,
      city: payload.city || organization.city,
      state: payload.state || organization.state,
      country: payload.country || organization.country,
      logged_at: organization.logged_at,
      updated_at: now(),
    };
    console.log(4645, pay);
    const [data] = await updateOrganizationByIdQuery(id, pay);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const changePasswordUserById = async (user, payload) => {
  try {
    const id = user.id;
    const [userInfo] = await getUserByIdQuery(id);
    if (!userInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "User does not exist",
        errors: "User does not exist",
      });
    }

    const hashedPassword = userInfo.password;
    if (!(await argon2.verify(hashedPassword, payload.old_password))) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Incorrect Password, think and try again",
        errors: "Incorrect Password, think and try again",
      });
    }

    if (payload.new_password.length < 6) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please use a strong password atleast 6 characters long",
        errors: "Please use a strong password atleast 6 characters long",
      });
    }

    if (payload.new_password !== payload.confirm_new_password) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Confirm Password must be the same with new password",
        errors: "Confirm Password must be the same with new password",
      });
    }

    const verifiedPassword = await argon2.hash(payload.new_password);

    const pay = {
      password: verifiedPassword || userInfo.password,
      updated_at: now(),
    };

    const [data] = await changePasswordByUserIdQuery(userInfo.id, pay);
    const { password, ...rest } = data;

    return { ...rest };
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  createNewVoter,
  verifyVoter,
  verifyEmail,
  loginOrganization,
  getAllOrganizations,
  updateOrganizationById,
  changePasswordUserById,
};
