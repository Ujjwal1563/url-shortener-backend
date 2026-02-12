import express from "express";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validations/request.validation.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail, createUser } from "../services/user.service.js";
import {createUserToken} from "../utils/token.js"

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }
  const { firstname, lastname, email, password } = validationResult.data;
  const existingUser = await getUserByEmail(email);
  if (existingUser)
    return res.status(400).json({
      error: `User with email ${email} already exists`,
    });
  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);
  const user = await createUser(
    firstname,
    lastname,
    email,
    salt,
    hashedPassword,
  );
  return res.status(201).json({
    data: {
      userId: user.id,
    },
  });
});

userRouter.post("/login", async (req, res) => {
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }
  const { email, password } = validationResult.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({
      error: `User with email ${email} does not exist`,
    });
  }
  const { password: hashedPassword } = hashPasswordWithSalt(
    password,
    user.salt,
  );
  if (user.password !== hashedPassword) {
    return res.status(400).json({
      error: "Invalid Password",
    });
  }
  const token =await createUserToken({id:user.id})
  return res.json({
    token
  })

});

export default userRouter;
