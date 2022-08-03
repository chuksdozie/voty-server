/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("candidates", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a candidate",
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
    candidate_id: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: true,
      comment: "The candidate's id of a candidate",
    },
    party: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: false,
      comment: "The party of a candidate",
    },
    picture: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The picture of the candidate",
    },
    logo: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The logo of the candidates party",
    },
    position: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The position the candidate is vying for",
    },
    number_of_votes: {
      type: "VARCHAR(250)",
      unique: false,
      comment: "The number of votes a candidate has",
    },
    verified: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "The candidates email has been verified or not",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the candidate created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the candidates account was updated",
    },
    voted_at: {
      type: "timestamp",
      default: null,
      comment: "When the candidate was last voted for",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the candidates account was deleted",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("candidates", {
    ifExists: true,
  });
};
