/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("voters", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a voter",
    },
    first_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The first name of the voter",
    },
    last_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The last name of the voter",
    },
    voter_id: {
      type: "VARCHAR(250)",
      unique: true,
      comment: "The voter's id of a voter",
    },
    email: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: true,
      comment: "The email of a voter",
    },
    phonenumber: {
      type: "VARCHAR(250)",
      unique: true,
      comment: "The phone number of the voter",
    },
    address: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The address of the voter",
    },
    voted: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "The address of the voter",
    },
    verified: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "The voter email has been verified or not",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the voter created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the voter updated an info on the account",
    },
    voted_at: {
      type: "timestamp",
      default: null,
      comment: "When the voter voted",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the voter deleted their account",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("voters", {
    ifExists: true,
  });
};
