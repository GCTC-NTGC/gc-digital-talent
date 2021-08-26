import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    id: "user.form.createHeading",
    defaultMessage: "Create User",
    description: "Title displayed on the create a user form.",
  },
  updateHeading: {
    id: "user.form.updateHeading",
    defaultMessage: "Update User",
    description: "Title displayed on the update a user form.",
  },
  emailLabel: {
    id: "user.form.emailLabel",
    defaultMessage: "Email:",
    description: "Label displayed on the user form email field.",
  },
  firstNameLabel: {
    id: "user.form.firstNameLabel",
    defaultMessage: "First Name:",
    description: "Label displayed on the user form first name field.",
  },
  lastNameLabel: {
    id: "user.form.lastNameLabel",
    defaultMessage: "Last Name:",
    description: "Label displayed on the user form last name field.",
  },
  telephoneLabel: {
    id: "user.form.telephoneLabel",
    defaultMessage: "Telephone:",
    description: "Label displayed on the user form telephone field.",
  },
  preferredLanguageLabel: {
    id: "user.form.preferredLanguageLabel",
    defaultMessage: "Preferred Language:",
    description: "Label displayed on the user form preferred language field.",
  },
  preferredLanguagePlaceholder: {
    id: "user.form.preferredLanguagePlaceholder",
    defaultMessage: "Select a language...",
    description:
      "Placeholder displayed on the user form preferred language field.",
  },
  createSuccess: {
    id: "user.form.createSuccess",
    defaultMessage: "User created successfully!",
    description:
      "Message displayed to user after user is created successfully.",
  },
  updateSuccess: {
    id: "user.form.updateSuccess",
    defaultMessage: "User updated successfully!",
    description:
      "Message displayed to user after user is updated successfully.",
  },
  createError: {
    id: "user.form.createError",
    defaultMessage: "Error: creating user failed",
    description: "Message displayed to user after user fails to get created.",
  },
  updateError: {
    id: "user.form.updateError",
    defaultMessage: "Error: updating user failed",
    description: "Message displayed to user after user fails to get updated.",
  },
  userNotFound: {
    id: "user.form.userNotFound",
    defaultMessage: "User {userId} not found.",
    description: "Message displayed for user not found.",
  },
});
