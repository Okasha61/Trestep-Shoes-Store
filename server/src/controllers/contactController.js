import { sendEmail } from "../services/emailService.js";

export const sendContactMessage = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return res.status(400).json({
        message:
          "Name, email, subject and message are required",
      });
    }

    await sendEmail({
      to: process.env.CONTACT_RECEIVER_EMAIL,

      subject: `Trestep Contact: ${subject}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          padding: 30px;
        ">

          <h2 style="color: #65a30d;">
            New Trestep Contact Message
          </h2>

          <hr />

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>

          <p>
            <strong>Subject:</strong>
            ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
          ">
            ${message}
          </div>

        </div>
      `,
    });

    return res.status(200).json({
      message:
        "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "Contact message error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send your message.",
    });
  }
};