import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import pug from "pug";
import { viewspath } from "../index.js";
import path from "path";
configDotenv();
const transporter = nodemailer.createTransport({
  mailer: "smtp",
  host: "ssl0.ovh.net",
  port: "587",
  secure: false,
  auth: {
    user: "Secretariat.batonnier@barreaudutogo.tg",
    pass: "L$b#2t9T5F@m",
  },
});

const mailing = async (receiver, subject, template, params) => {
  try {
    params.fronturl = process.env.FRONT_URL;
    const templatePath = path.join(viewspath, template);
    const htmlContent = pug.renderFile(templatePath, params);
    const info = await transporter.sendMail({
      from: '"Secretariat" <Secretariat.batonnier@barreaudutogo.tg>',
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: htmlContent, // html body
    });
    console.log("Message envoyé: %s", info.response);
  } catch (error) {
    throw new Error("Erreur d'envoi du mail : " + error);
  }
};

export default mailing;
