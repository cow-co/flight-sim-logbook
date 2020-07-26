const createLogbook = async (logbookSetup) => {
  let newLogbook = {
    aircraft: null,
    errors: [],
  };

  let existingLogbook = await getUserByName(logbookSetup.username);
  if (existingUser) {
    userExists = true;
  } else {
    existingUser = await getUserByEmail(userSetup.email);
    userExists = existingUser ? true : false;
  }

  if (userExists) {
    newUser.errors.push("User already exists!");
  } else {
    if (isEmptyOrNull(userSetup.username)) {
      newUser.errors.push("Please enter a username");
    }

    if (isEmptyOrNull(userSetup.email)) {
      newUser.errors.push("Please enter an email");
    }

    if (userSetup.password !== userSetup.passwordConfirmation) {
      newUser.errors.push("Password confirmation does not match");
    }
  }

  if (newUser.errors.length === 0) {
    try {
      if (isValidPassword(userSetup.password)) {
        const hash = await argon2.hash(userSetup.password);
        await User.create({
          username: userSetup.username,
          email: userSetup.email,
          passwordHash: hash,
        });

        newUser.username = userSetup.username;
        newUser.email = userSetup.email;
      } else {
        newUser.errors.push("Password does not satisfy requirements");
      }
    } catch (error) {
      newUser.errors.push(error.message);
    }
  }

  return newUser;
};
