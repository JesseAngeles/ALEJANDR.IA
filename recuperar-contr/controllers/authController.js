const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const token = crypto.randomBytes(4).toString('hex').slice(0, 8);
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 20); // 15 min
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de recuperación',
    html: `<p>Tu código de recuperación es: <strong>${token}</strong></p>`
  });
  

  res.json({ message: 'Correo enviado' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() }
  });

  if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Contraseña actualizada' });
};
