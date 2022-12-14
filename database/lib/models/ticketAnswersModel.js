"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;

function ticketAnswersModel(ticketId, authorId, text, attachmentsURL) {
  if (ticketId) this.ticketId = new mongodb.ObjectID(ticketId);
  if (authorId) this.author = new mongodb.ObjectID(authorId);
  if (text) this.text = String(text);
  if (attachmentsURL) this.attachmentsURL = String(attachmentsURL);
}

module.exports = {
  ticketAnswersModel,
};
