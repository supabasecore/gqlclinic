import axios from "axios";
import { Express } from "express";

const reniecRoute = (app: Express) => {
  app.get("/dni/:dni", async (req, res) => {
    const { dni } = req.params;

    if (!/^\d{8}$/.test(dni)) {
      return res.status(422).json({
        errorMessage: "DNI inválido, debe tener 8 caracteres numéricos.",
      });
    }

    const apiKey = "apis-token-1.aTSI1U7KEuT-6bbbCguH-4Y8TI6KS73N";
    const apiUrl = `https://api.apis.net.pe/v1/dni?numero=${dni}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.status === 200) {
        const jsonData = response.data;

        if (jsonData["nombres"] && jsonData["numeroDocumento"]) {
          const dniData = {
            dni: jsonData["numeroDocumento"],
            name: jsonData["nombres"],
            lastname: `${jsonData["apellidoPaterno"]} ${jsonData["apellidoMaterno"]}`,
          };
          return res.json({ data: dniData });
        } else {
          return res
            .status(404)
            .json({ errorMessage: "Número de DNI no encontrado." });
        }
      } else if (response.status === 422) {
        return res
          .status(422)
          .json({ errorMessage: "DNI inválido, intenta nuevamente." });
      } else if (response.status === 404) {
        return res
          .status(404)
          .json({ errorMessage: "Número de DNI no encontrado." });
      } else {
        return res.status(response.status).json({
          errorMessage: `Error en la solicitud. Código de estado: ${response.status}`,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          return res
            .status(422)
            .json({ errorMessage: "DNI inválido, intenta nuevamente." });
        } else if (error.response && error.response.status === 404) {
          return res
            .status(404)
            .json({ errorMessage: "Número de DNI no encontrado." });
        } else {
          return res
            .status(500)
            .json({ errorMessage: `Error en la solicitud: ${error.message}` });
        }
      } else {
        return res
          .status(500)
          .json({ errorMessage: `Error en la solicitud: ${error.message}` });
      }
    }
  });
};

export default reniecRoute;
