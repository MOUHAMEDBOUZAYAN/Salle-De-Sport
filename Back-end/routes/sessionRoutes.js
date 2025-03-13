import express from 'express';
import Session from '../models/session.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Créer une session (Entraîneur uniquement)
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'entraineur') return res.status(403).json({ message: "Accès refusé" });

    try {
        const session = new Session({ ...req.body, trainer: req.user.id });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Réserver une session (Membre uniquement)
router.post('/:id/reserve', authMiddleware, async (req, res) => {
    if (req.user.role !== 'membre') return res.status(403).json({ message: "Accès refusé" });

    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: "Session non trouvée" });

        session.participants.push(req.user.id);
        await session.save();
        res.json({ message: "Session réservée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

export default router;
