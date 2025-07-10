import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({ origin: "*" }));

app.use(express.json()) /

    //OBTENER TODOS LOS PROFESIONALES //

    app.get("/api/profesionales", async (req, res) => {
        try {
            const [resultado] = await pool.execute("SELECT * FROM profesionales");
            res.json(resultado);
        } catch {
            console.error("Error al obtener profesionales");
            res.status(500).send("Error al obtener profesionales");
        }
    })

    //OBTENER TODOS LOS CONSULTORIOS //

    app.get("/api/consultorios", async (req, res) => {
        try {
            const [resultado] = await pool.execute("SELECT * FROM consultorios");
            res.json(resultado);
        } catch {
            console.error("Error al obtener consultorios");
            res.status(500).send("Error al obtener consultorios");
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
            t.id AS turno_id,
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


// OBTENER CONSULTORIOS POR ID PROFESIONAL //

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
        const [resultados] = await pool.execute(query, [id]);
        if (resultados.length === 0) {
            return res.status(200).json([]);

        }

        res.json(resultados);
    } catch (error) {
        console.error("Error al obtener consultorios del profesional:", error); // Mensaje más específico
        res.status(500).send("Error interno del servidor al obtener consultorios.");
    }
});


// OBTENER PROFESIONAL X ID CONSULTORIO //

app.get("/api/profesionalxidconsultorio/:id", async (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT 
    p.id AS id,
    p.nombre AS nombre,
    p.apellido AS apellido,
    p.especialidad AS especialidad,
    p.matricula AS matricula
     FROM profesional_consultorio AS pc
     JOIN 
     profesionales AS p ON p.id = pc.profesional_id
     JOIN
     consultorios AS c ON c.id = pc.consultorio_id
    WHERE pc.consultorio_id = ?
  `;
    try {
        const [resultados] = await pool.execute(query, [id]);
        if (resultados.length === 0) {
            return res.status(200).json([]);

        }

        res.json(resultados);
    } catch (error) {
        console.error("Error al obtener consultorios del profesional:", error); // Mensaje más específico
        res.status(500).send("Error interno del servidor al obtener consultorios.");
    }
});

// OBTENER OBRAS SOCIALES Y PREPAGAS POR ID DE PROFESIONAL //

app.get("/api/coberturas/:id", async (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT 
    cm.nombre AS cobertura,
    cm.siglas AS siglas
    FROM consultorio_cobertura AS cc
    JOIN 
    consultorios AS c ON c.id = cc.consultorio_id
    JOIN
    cobertura_medica AS cm ON cm.id = cc.cobertura_medica_id
    WHERE c.id = ?
  `;
    try {
        const [resultados] = await pool.execute(query, [id]);
        if (resultados.length === 0) {
            return res.status(200).json([]);

        }

        res.json(resultados);
    } catch (error) {
        console.error("Error al obtener coberturas", error); // Mensaje más específico
        res.status(500).send("Error interno del servidor al obtener coberturas.");
    }
});

// OBTENER CONSULTORIOS POR ID //

app.get("/api/consultorio/:id", async (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT 
c.nombre,
c.direccion,
c.localidad,
c.tipo,
c.hora_inicio AS inicio,
c.hora_cierre AS cierre
FROM consultorios AS c
WHERE id = ?
    `;
    try {
        const [resultados] = await pool.execute(query, [id]);
        if (resultados.length === 0) {
            return res.status(200).json([]);
        }

        res.json(resultados);
    } catch (error) {
        console.error("Error al obtener consultorios del profesional:", error); // Mensaje más específico
        res.status(500).send("Error interno del servidor al obtener consultorios.");
    }
});

// OBTENER PROFESIONAL POR ID //

app.get("/api/profesional/:id", async (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT 
p.nombre,
p.apellido,
p.especialidad,
p.matricula
FROM profesionales AS p
WHERE id = ?
    `;
    try {
        const [resultados] = await pool.execute(query, [id]);
        res.json(resultados);
    } catch (error) {
        console.error("Error al obtener profesional:", error); // Mensaje más específico
        res.status(500).send("Error interno del servidor al obtener profesional");
    }
});

// RESERVAR TURNO //

app.put('/api/reservarturno/:turnoId', async (req, res) => {
    const { turnoId } = req.params; 
    const { nombre_paciente, apellido_paciente, DNI, cobertura, telefono, estado } = req.body; 

    if (!nombre_paciente || !apellido_paciente || !DNI || !cobertura || !telefono || !estado) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    
    const query = `
        UPDATE turnos
        SET
            nombre_paciente = ?,
            apellido_paciente = ?,
            DNI = ?,
            cobertura = ?,
            telefono = ?,
            estado = ?
        WHERE id = ?;
    `;

    // Los valores se pasan como un array para la consulta preparada
    const values = [nombre_paciente, apellido_paciente, DNI, cobertura, telefono, estado, turnoId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Turno con ID ${turnoId} no encontrado.` });
        }

        res.status(200).json({
            message: 'Turno actualizado exitosamente.',
            updatedId: turnoId,
            changes: result.affectedRows
        });

    } catch (error) {
        console.error('Error al actualizar el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el turno.' });
    }
});

// HABILITAR TURNOS //

app.post('/api/habilitarturnos', async (req, res) => {
    const { consultorioId, profesionalId, fecha, cantidadTurnos } = req.body;

    // Validación básica
    if (!consultorioId || !profesionalId || !fecha || !cantidadTurnos || cantidadTurnos <= 0) {
        return res.status(400).json({ message: 'Faltan datos requeridos o cantidad de turnos inválida.' });
    }

    let connection;
    try {
        connection = await pool.getConnection(); // Obtener una conexión del pool
        await connection.beginTransaction(); // Iniciar una transacción

        const insertQuery = `
            INSERT INTO turnos (consultorio_id, profesional_id, fecha)
            VALUES (?, ?, ?)
        `;

        // Ejecutar la consulta de inserción 'cantidadTurnos' veces
        for (let i = 0; i < cantidadTurnos; i++) {
            await connection.execute(insertQuery, [consultorioId, profesionalId, fecha]);
        }

        await connection.commit(); // Confirmar la transacción
        res.status(200).json({ message: `Se han habilitado ${cantidadTurnos} turnos para el ${fecha}.` });

    } catch (error) {
        if (connection) {
            await connection.rollback(); // Deshacer la transacción en caso de error
        }
        console.error('Error al habilitar turnos en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor al habilitar turnos.' });
    } finally {
        if (connection) {
            connection.release(); // Liberar la conexión de vuelta al pool
        }
    }
});



app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
});

