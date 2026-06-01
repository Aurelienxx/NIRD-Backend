const placeService = require('../service/placeService');

exports.getPlaces = async (req, res) => {
  try {
    const places = await placeService.getAll();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des lieux" });
    console.error(err);
  }
};

exports.getPlace = async (req, res) => {
  try {
    const place = await placeService.getById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Lieu non trouvé" });
    }

    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du lieu" });
  }
};

exports.getPlacesByUser = async (req, res) => {
  try {
    const places = await placeService.getByUserId(req.params.userId);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des lieux utilisateur" });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const place = await placeService.create(req.body);
    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création du lieu" });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const place = await placeService.update(req.params.id, req.body);
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du lieu" });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    await placeService.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du lieu" });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const places = await placeService.getAllLocations();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des positions" });
  }
};