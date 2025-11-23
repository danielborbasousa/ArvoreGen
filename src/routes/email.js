const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Config do Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "SEU_EMAIL@gmail.com",
        pass: "SENHA_DO_APP_DO_GMAIL"
    }
});

// ROTA PARA ENVIAR EMAIL
router.post("/send", async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to) return res.status(400).json({ error: "Email destino não enviado" });

    try {
        await transporter.sendMail({
            from: "SEU_EMAIL@gmail.com",
            to,
            subject,
            text: message
        });

        return res.json({ success: true, msg: "Email enviado com sucesso!" });
    } catch (err) {
        console.error("Erro ao enviar email:", err);
        return res.status(500).json({ error: "Erro ao enviar email." });
    }
});

module.exports = router;
