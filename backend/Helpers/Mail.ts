import nodemailer from "nodemailer";

console.log(process.env.EMAIL_PASS)

export const mailer = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})