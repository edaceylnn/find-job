import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// Shared bcrypt hashing + JWT issuance for any schema with a `password` field.
// Used by both Users and Companies, which previously duplicated this logic.
export default function authPlugin(schema) {
  schema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  schema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  schema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
  };
}
