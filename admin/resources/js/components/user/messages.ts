import { defineMessages } from "react-intl";

export default defineMessages({
  createHeading: {
    defaultMessage: "Create User",
    description: "Title displayed on the create a user form.",
  },
  updateHeading: {
    defaultMessage: "Update User",
    description: "Title displayed on the update a user form.",
  },
  emailLabel: {
    defaultMessage: "Email:",
    description: "Label displayed on the user form email field.",
  },
  firstNameLabel: {
    defaultMessage: "First Name:",
    description: "Label displayed on the user form first name field.",
  },
  lastNameLabel: {
    defaultMessage: "Last Name:",
    description: "Label displayed on the user form last name field.",
  },
  telephoneLabel: {
    defaultMessage: "Telephone:",
    description: "Label displayed on the user form telephone field.",
  },
  preferredLanguageLabel: {
    defaultMessage: "Preferred Language:",
    description: "Label displayed on the user form preferred language field.",
  },
  preferredLanguagePlaceholder: {
    defaultMessage: "Select a language...",
    description:
      "Placeholder displayed on the user form preferred language field.",
  },
  createSuccess: {
    defaultMessage: "User created successfully!",
    description:
      "Message displayed to user after user is created successfully.",
  },
  updateSuccess: {
    defaultMessage: "User updated successfully!",
    description:
      "Message displayed to user after user is updated successfully.",
  },
  createError: {
    defaultMessage: "Error: creating user failed",
    description: "Message displayed to user after user fails to get created.",
  },
  updateError: {
    defaultMessage: "Error: updating user failed",
    description: "Message displayed to user after user fails to get updated.",
  },
  userNotFound: {
    defaultMessage: "User {userId} not found.",
    description: "Message displayed for user not found.",
  },
});
