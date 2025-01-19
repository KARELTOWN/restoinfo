import userAgentParser from "user-agent";
export const agentInfo = (req) => {
  const userAgent = req.headers["user-agent"];
  const parsedUserAgent = userAgentParser.parse(userAgent); // Si vous utilisez user-agent package
  console.log("parsedUserAgent", parsedUserAgent);
  // Extraire des informations de la requête
  const detail = {
    typ: "mobile", // Exemple : vous pourriez détecter ça via un package comme 'express-device'
    browser: parsedUserAgent.browser?.name, // Ou parsez avec d'autres données
    os: parsedUserAgent.os, // Système d'exploitation
    ip: req.ip, // Adresse IP de l'utilisateur
    userAgent: userAgent, // User-agent brut
  };
  return detail;
};
