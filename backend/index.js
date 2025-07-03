import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({ origin: "*" }));

app.use(express.json())/

//OBTENER TODOS LOS PROFESIONALES //

app.get("/api/profesionales", async (req, res) => {
  try {
    const [resultado] = await pool.execute("SELECT * FROM profesionales");
    res.json(resultado);
  } catch {
    console.error("Error al obtener canchas");
    res.status(500).send("Error al obtener canchas");
  }
})

//OBTENER TURNOS DE UN PROFESIONAL POR ID //

app.get("/api/turnos-profesional/:profesionalId/:consultorioId", async (req, res) => {
  const { profesionalId, consultorioId } = req.params;

  // La validación sigue siendo importante
  if (isNaN(profesionalId) || isNaN(consultorioId)) {
      return res.status(400).json({ message: "IDs de profesional o consultorio inválidos. Deben ser números." });
  }

  // Tu consulta SQL para obtener los turnos del profesional
  const query = `
      SELECT
          CONCAT(p.apellido, ', ', p.nombre) AS medico,
          p.especialidad AS especialidad,
          c.direccion,
          t.fecha,
          t.estado
      FROM
          turnos AS t
      JOIN
          profesional_consultorio AS pc
          ON t.profesional_id = pc.profesional_id
          AND t.consultorio_id = pc.consultorio_id
      JOIN
          profesionales AS p ON pc.profesional_id = p.id
      JOIN
          consultorios AS c ON pc.consultorio_id = c.id
      WHERE p.id = ? AND c.id = ?
  `;

  try {
      // Ejecuta la consulta, pasando los IDs como parámetros
      // El pool.execute se encarga de escapar el valor para prevenir inyecciones SQL
      const [resultado] = await pool.execute(query, [profesionalId, consultorioId]);
      res.json(resultado); // Envía los resultados como JSON
  } catch (error) {
      console.error(`Error al obtener turnos para el profesional ${profesionalId} y consultorio ${consultorioId}:`, error);
      res.status(500).send("Error interno del servidor al obtener turnos del profesional.");
  }
});



//OBTENER PROFESIONAL POR ID //

app.get("/api/consultorios/:id", async (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT
      c.id,
      c.tipo,
      c.direccion,
      c.nombre,
      c.localidad
  FROM profesional_consultorio AS pc -- Alias para la tabla intermedia
  JOIN consultorios AS c ON c.id = pc.consultorio_id
  JOIN profesionales AS p ON p.id = pc.profesional_id -- Asegúrate de usar el alias correcto aquí también
  WHERE p.id = ?
  `;
  try {
      const [resultados] = await pool.execute(query, [id]); // Cambiado a 'resultados' para claridad

      // Si no se encuentran consultorios para el profesional, devuelve un array vacío (200 OK)
      // o un 404 si prefieres indicar que el recurso (consultorios para ese ID) no existe.
      // Un array vacío con 200 OK es a menudo más flexible para el frontend.
      if (resultados.length === 0) {
          return res.status(200).json([]); // Devuelve un array vacío si no hay consultorios
          // O si realmente quieres un 404:
          // return res.status(404).send("Consultorios no encontrados para el profesional especificado.");
      }

      res.json(resultados); // <--- ¡CORRECCIÓN AQUÍ! Envía el array completo
  } catch (error) { // Captura el objeto de error para loguear más detalles
      console.error("Error al obtener consultorios del profesional:", error); // Mensaje más específico
      res.status(500).send("Error interno del servidor al obtener consultorios.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
});

