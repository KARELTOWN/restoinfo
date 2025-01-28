import _ from "lodash";
import { matchedData, validationResult } from "express-validator";
import FileAvis from "../../models/FileAvis.js";
import Avis from "../../models/Avis.js";
export default function AvisController() {
  const storeAvis = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        const avis = await Avis.create(data);
        res.status(200).json({ message: "Avis créé", data: avis });
      }
    } catch (err) {
      next(err);
    }
  };

  const storeFileAvis = async (req, res, next) => {
    try {
      if (_.isArray(req.files) === false) {
        res.status(500).json({ message: "Aucun fichier uploadé", data: {} });
      }
      let files = [];
      for (let file of req.files) {
        let fileavis = await FileAvis.create({
          name: file.metadata.originalname,
          path: file.location,
          mimetype: file.contentType,
        });
        files.push(fileavis._id);
      }
      res.status(200).json({ data: files });
    } catch (err) {
      next(err);
    }
  };

  const changeStatutAvis = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          message: "Erreur de validation",
          data: errors.array(),
        });
      } else {
        const data = matchedData(req);
        const avis = await Avis.findByIdAndUpdate(
          data.avis,
          { statut: data.statut },
          { new: true }
        );
        res
          .status(200)
          .json({ message: "Statut de l'avis modifié", data: avis });
      }
    } catch (err) {
      next(err);
    }
  };

  return {
    storeAvis,
    storeFileAvis,
    changeStatutAvis,
  };
}
