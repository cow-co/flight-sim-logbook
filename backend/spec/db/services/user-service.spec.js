const User = require("../../../db/models/User");
const HashedPassword = require("../../../db/models/HashedPassword");
const TokenValidity = require("../../../db/models/TokenValidity");
const userService = require("../../../db/services/user-service");

jest.mock("../../../db/models/User");
jest.mock("../../../db/models/HashedPassword");
jest.mock("../../../db/models/TokenValidity");

describe("User service tests - get by ID", () => {
  test("Get user by ID - success - no hash", async () => {
    User.findById.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashId",
    });

    const res = await userService.getUserById("id", false);

    expect(res.name).toBe("name");
    expect(res.password).toBe("hashId");
  });

  test("Get user by ID - success - hash included", async () => {
    User.findById.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashId",
      populate: async function (field) {
        this[field] = {
          _id: "8282",
          hashedPassword: "hashyDooey",
        };
        return this;
      },
    });

    const res = await userService.getUserById("id", true);

    expect(res.name).toBe("name");
    expect(res.password.hashedPassword).toBe("hashyDooey");
  });

  test("Get user by ID - failure - not found", async () => {
    User.findById.mockResolvedValue(null);

    const res = await userService.getUserById("id", false);

    expect(res).toBeNull();
  });
});

describe("User service tests - get by name", () => {
  test("Get user by name - success - no hash", async () => {
    User.findOne.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashId",
    });

    const res = await userService.getUserByName("name", false);

    expect(res._id).toBe("id");
    expect(res.password).toBe("hashId");
  });

  test("Get user by name - success - hash included", async () => {
    User.findOne.mockResolvedValue({
      _id: "id",
      name: "name",
      password: "hashId",
      populate: async function (field) {
        this[field] = {
          _id: "8282",
          hashedPassword: "hashyDooey",
        };
        return this;
      },
    });

    const res = await userService.getUserByName("name", true);

    expect(res._id).toBe("id");
    expect(res.password.hashedPassword).toBe("hashyDooey");
  });

  test("Get user by name - failure - not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await userService.getUserByName("name", false);

    expect(res).toBeNull();
  });
});

describe("User service tests - create", () => {
  test("Create user - success", async () => {
    User.create.mockResolvedValue({
      _id: "id",
      name: "name",
      save: async function () {},
    });
    HashedPassword.create.mockResolvedValue({
      _id: "hashId",
      hashedPassword: "hashyDooey",
    });

    const res = await userService.createUser("name", "hashyDooey");

    expect(res._id).toBe("id");
    expect(res.password).toBe("hashId");
  });
});

describe("User service tests - logout", () => {
  test("Log out user - success - no entry existing", async () => {
    TokenValidity.findOne.mockResolvedValue(null);

    await userService.logUserOut("id");

    expect(TokenValidity.create).toHaveBeenCalledTimes(1);
  });

  test("Log out user - success - entry exists", async () => {
    let called = false;
    TokenValidity.findOne.mockResolvedValue({
      _id: "id",
      userId: "id",
      minTokenValidity: 100,
      save: async function () {
        called = true;
      },
    });

    await userService.logUserOut("id");

    expect(TokenValidity.create).toHaveBeenCalledTimes(0);
    expect(called).toBeTruthy();
  });
});

describe("User service tests - get token validity timestamp", () => {
  test("Get min timestamp - success - no entry existing", async () => {
    TokenValidity.findOne.mockResolvedValue(null);

    const timestamp = await userService.getMinValidTokenTimestamp("id");

    expect(timestamp).toBe(0);
  });

  test("Get min timestamp - success - entry exists", async () => {
    TokenValidity.findOne.mockResolvedValue({
      _id: "id",
      userId: "id",
      minTokenValidity: 100,
    });

    const timestamp = await userService.getMinValidTokenTimestamp("id");

    expect(timestamp).toBe(100);
  });
});
