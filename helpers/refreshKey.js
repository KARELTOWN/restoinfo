import crypto from "crypto";
const refreshKey = crypto.randomBytes(32).toString("hex");
export default refreshKey;
