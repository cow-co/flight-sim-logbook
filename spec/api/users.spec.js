const User = require("../../models/User");
const expect = require("chai").expect;
const server = require("../../index");

describe("User API tests", () => {
	it("Should log a user in by returning a JWT", (done) => {
		let user = {
			_id: 1,
			name: "user",
			email: "email@email.com"
		};
		spyOn(User, "findOne").and.returnValue(Promise.resolve(user));
		spyOn(User, "checkPassword").and.returnValue(Promise.resolve(true));

		const request = {
			name: "user",
			password: "password"
		};
		request(server).post("/api/users/login").send(request).expect(200).end((err) => {
			expect(User.findOne).toHaveBeenCalledWith(request.name);

			if(err) {
				return done(err);
			} else {
				return done();
			}
		})
	})
});