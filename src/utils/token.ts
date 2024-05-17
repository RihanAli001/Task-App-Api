const jwt = require("jsonwebtoken");
const secretKey = "youhavetobeverycarefulaboutthesesecretkey";

const createToken = (userId: any): string => {
  try {
    if (typeof userId !== "number" || isNaN(userId)) {
      throw new Error("Invalid userId");
    }

    const token: string = jwt.sign({ id: userId }, secretKey, {
      expiresIn: "12h",
    });
    return token;
  } catch (err) {
    console.error("Token not created:", err);
    throw err;
  }
};

export { createToken, secretKey };
