import nodemailer from 'nodemailer';

const sendEmail = async (option) => {
  try {

    const transporter = await nodemailer.createTransport({
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_EMAIL,
        pass: process.env.SMPT_PASSWROD,
      },
    });

    const mailOptions = await {
      from: process.env.SMPT_EMAIL,
      to: option.email,
      subject: option.subject,
      text: option.message
    };

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error.message)
    return option.res.status(404).send({
      seccess: false, status: 400, message: error.message
  })
  }
}
export default sendEmail;