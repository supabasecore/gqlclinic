import axios from "axios";
import { Express } from "express";

const sunatRoute = (app: Express) => {
  app.get("/ruc/:numero", async (req, res) => {
    const { numero } = req.params;

    if (!/^\d{11}$/.test(numero)) {
      return res.status(422).json({
        errorMessage: "RUC inválido, debe tener 11 caracteres numéricos.",
      });
    }

    const apiKey = "apis-token-1.aTSI1U7KEuT-6bbbCguH-4Y8TI6KS73N";
    const apiUrl = `https://api.apis.net.pe/v1/ruc?numero=${numero}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.status === 200) {
        const jsonData = response.data;

        if (jsonData["nombre"] && jsonData["numeroDocumento"]) {
          const rucData = {
            name: jsonData["nombre"],
            ruc: jsonData["numeroDocumento"],
            address: jsonData["direccion"],
            district: jsonData["distrito"],
            province: jsonData["provincia"],
            department: jsonData["departamento"],
          };
          return res.json({ data: rucData });
        } else {
          return res
            .status(404)
            .json({ errorMessage: "Número de RUC no encontrado." });
        }
      } else if (response.status === 422) {
        return res
          .status(422)
          .json({ errorMessage: "RUC inválido, intenta nuevamente." });
      } else if (response.status === 404) {
        return res
          .status(404)
          .json({ errorMessage: "Número de RUC no encontrado." });
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
            .json({ errorMessage: "RUC inválido, intenta nuevamente." });
        } else if (error.response && error.response.status === 404) {
          return res
            .status(404)
            .json({ errorMessage: "Número de RUC no encontrado." });
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

export default sunatRoute;
