const userService = require("../../services/users");
const utils = require("../utils");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../../config/keys").JWT_KEY;

describe("User service tests", () => {
  beforeAll(async () => await utils.connect());

  afterEach(async () => await utils.clearDB());

  afterAll(async () => await utils.closeDB());

  describe("User-retrieval tests", () => {
    it("Should retrieve a user by name", async () => {
      const userDetails = {
        username: "name",
        email: "someone@something.com",
      };

      try {
        const user = await utils.createUser(userDetails);
        const retrieved = await userService.getUserByName(userDetails.username);
        expect(retrieved.email).to.equal(userDetails.email);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to retrieve a user by an invalid name", async () => {
      const userDetails = {
        username: "name",
        email: "someone@something.com",
      };

      try {
        const user = await utils.createUser(userDetails);
        const retrieved = await userService.getUserByName(userDetails.username + "aaaaa");
        expect(retrieved).to.be.null;
      } catch (err) {
        fail(err);
      }
    });

    it("Should retrieve a user by email", async () => {
      const userDetails = {
        username: "name",
        email: "someone@something.com",
      };

      try {
        const user = await utils.createUser(userDetails);
        const retrieved = await userService.getUserByEmail(userDetails.email);
        expect(retrieved.username).to.equal(userDetails.username);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to retrieve a user by an invalid email", async () => {
      const userDetails = {
        username: "name",
        email: "someone@something.com",
      };

      try {
        const user = await utils.createUser(userDetails);
        const retrieved = await userService.getUserByEmail(userDetails.email + "aaaaa");
        expect(retrieved).to.be.null;
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("Password-validation and -setting tests", () => {
    it("Should pass validation", async () => {
      const valid = "validpassword001";
      expect(userService.isValidPassword(valid)).to.be.true;
    });

    it("Should fail validation", async () => {
      const invalid = "invalid";
      expect(userService.isValidPassword(invalid)).to.be.false;
    });

    it("Should change password", async () => {
      const userDetails = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "password12345",
      };

      try {
        let user = await utils.createUser(userDetails);
        const prevHash = user.passwordHash;
        await userService.changePassword(user, "newPassword123");
        user = await userService.getUserByName(userDetails.username);
        expect(user.passwordHash).to.exist;
        expect(user.passwordHash).to.not.equal(prevHash);
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("User creation tests", () => {
    it("Should fail to create a user with an empty username", async () => {
      const invalidUser = {
        username: "",
        email: "someone@something.com",
        password: "password12345",
        passwordConfirmation: "password12345",
      };

      try {
        const user = await userService.createUser(invalidUser);
        expect(user.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to create a user with an empty email", async () => {
      const invalidUser = {
        username: "name",
        email: "",
        password: "password12345",
        passwordConfirmation: "password12345",
      };

      try {
        const user = await userService.createUser(invalidUser);
        expect(user.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to create a user with an empty password", async () => {
      const invalidUser = {
        username: "name",
        email: "someone@something.com",
        password: "",
        passwordConfirmation: "",
      };

      try {
        const user = await userService.createUser(invalidUser);
        expect(user.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to create a user with a non-matching password", async () => {
      const invalidUser = {
        username: "name",
        email: "someone@something.com",
        password: "password12345",
        passwordConfirmation: "password12346",
      };

      try {
        const user = await userService.createUser(invalidUser);
        expect(user.errors.length).to.equal(1);
      } catch (err) {
        fail(err);
      }
    });

    it("Should create a user", async () => {
      const validUser = {
        username: "name",
        email: "someone@something.com",
        password: "password12345",
        passwordConfirmation: "password12345",
      };

      try {
        const user = await userService.createUser(validUser);
        expect(user.username).to.equal("name");
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("JWT tests", () => {
    it("Should create a token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateJWT(createdUser);
        expect(token).to.exist;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to validate a non-matching token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateJWT(createdUser);
        const nonMatching = jwt.sign(
          {
            username: user.username,
          },
          JWT_KEY,
          {
            expiresIn: 1000000,
          }
        );
        const retrievedUser = await userService.checkJWT(nonMatching);
        expect(retrievedUser).to.be.null;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail to validate a malformed JWT", async () => {
      const user = {
        username: "nname",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateJWT(createdUser);
        const retrievedUser = await userService.checkJWT("incorrectToken");
        expect(retrievedUser).to.be.null;
      } catch (err) {
        fail(err);
      }
    });

    it("Should delete a token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        await userService.generateJWT(createdUser);
        await userService.deleteJWT(user.username);
        const retrievedUser = await userService.getUserByName(user.username);
        const token = retrievedUser.jwt;
        expect(token).to.not.exist;
      } catch (err) {
        fail(err);
      }
    });
  });

  describe("Email Verification and Forgot-Password Tests", () => {
    it("Should generate an email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateEmailVerificationToken(createdUser.username);
        const retrievedUser = await userService.getUserByName(createdUser.username);
        expect(token).to.exist;
        expect(token).to.equal(retrievedUser.verificationToken);
        expect(retrievedUser.verificationSet).to.exist;
      } catch (err) {
        fail(err);
      }
    });

    it("Should verify a correct email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateEmailVerificationToken(createdUser.username);
        const isValid = await userService.verifyEmail(user.username, token);
        expect(isValid).to.be.true;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail on an incorrect email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateEmailVerificationToken(createdUser.username);
        const isValid = await userService.verifyEmail(user.username, token + "aaa");
        expect(isValid).to.be.false;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail on an expired email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateEmailVerificationToken(createdUser.username);
        createdUser.verificationSet = 1000000; // Way in the past
        await createdUser.save();
        const isValid = await userService.verifyEmail(user.username, token);
        expect(isValid).to.be.false;
      } catch (err) {
        fail(err);
      }
    });

    it("Should generate a password-reset token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateForgotPasswordToken(createdUser.username);
        const retrievedUser = await userService.getUserByName(createdUser.username);
        expect(token).to.exist;
        expect(token).to.equal(retrievedUser.resetPasswordToken);
        expect(retrievedUser.resetTokenSet).to.exist;
      } catch (err) {
        fail(err);
      }
    });

    it("Should verify a correct email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateForgotPasswordToken(createdUser.username);
        const isValid = await userService.verifyForgotPassword(user.username, token);
        expect(isValid).to.be.true;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail on an incorrect email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateForgotPasswordToken(createdUser.username);
        const isValid = await userService.verifyForgotPassword(user.username, token + "aaa");
        expect(isValid).to.be.false;
      } catch (err) {
        fail(err);
      }
    });

    it("Should fail on an expired email-verification token", async () => {
      const user = {
        username: "name",
        email: "someone@something.com",
        passwordHash: "hash",
      };
      const createdUser = await utils.createUser(user);

      try {
        const token = await userService.generateForgotPasswordToken(createdUser.username);
        createdUser.resetTokenSet = 1000000; // Way in the past
        await createdUser.save();
        const isValid = await userService.verifyForgotPassword(user.username, token);
        expect(isValid).to.be.false;
      } catch (err) {
        fail(err);
      }
    });
  });
});
