import nodemailer from 'nodemailer';

const sendEmail = async (option) => {
  try {

    const transporter = nodemailer.createTransport({
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_EMAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_EMAIL,
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log(error.message)
    res.status(500).send({ success: false, status: 500, error: error.message });
  }
}
export default sendEmail;