import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { pnr, bookingId } = req.body;

    if (!pnr || !bookingId) {
      return res.status(400).json({ message: 'PNR and booking ID required' });
    }

    const data = JSON.stringify({
      pnr,
      bookingId,
      time: Date.now()
    });

    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return res.json({
      success: true,
      qrCode: qrDataUrl
    });
  } catch {
    return res.status(500).json({ message: 'Failed to generate QR code' });
  }
});

export default router;