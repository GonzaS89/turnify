import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import jwt from "jsonwebtoken";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;
import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Argentina/Buenos_Aires");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "10mb", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
const client = twilio(accountSid, authToken);

//OBTENER TODOS LOS PROFESIONALES //

app.get("/api/profesionales", async (req, res) => {
  try {
    const [resultado] = await pool.execute("SELECT * FROM profesionales");
    res.json(resultado);
  } catch {
    console.error("Error al obtener profesionales");
    res.status(500).send("Error al obtener profesionales");
  }
});

//OBTENER TODOS LOS CONSULTORIOS //

app.get("/api/consultorios", async (req, res) => {
  try {
    const [resultado] = await pool.execute(
      "SELECT c.id,c.direccion,c.nombre,c.tipo,c.telefono,l.nombre AS localidad,p.nombre AS provincia FROM consultorios AS c JOIN localidades AS l ON l.id = c.localidad JOIN provincias AS p ON p.id = c.provincia",
    );
    res.json(resultado);
  } catch {
    console.error("Error al obtener consultorios");
    res.status(500).send("Error al obtener consultorios");
  }
});

// OBTENER TODOS LOS PERFILES

app.get("/api/perfiles", async (req, res) => {
  try {
    const [resultado] = await pool.execute("SELECT * FROM perfiles");
    res.json(resultado);
  } catch {
    console.error("Error al obtener perfiles");
    res.status(500).send("Error al obtener perfiles");
  }
});

//OBTENER TODAS LAS COBERTURAS //

app.get("/api/coberturas", async (req, res) => {
  try {
    const [resultado] = await pool.execute("SELECT * FROM cobertura_medica");
    res.json(resultado);
  } catch {
    console.error("Error al obtener coberturas");
    res.status(500).send("Error al obtener coberturas");
  }
});

//OBTENER TODAS LAS PROVINCIAS //

app.get("/api/localidades/:provinciaId", async (req, res) => {
  const { provinciaId } = req.params;
  try {
    const [resultado] = await pool.execute(
      "SELECT * FROM localidades WHERE provincia_id = ? ORDER BY nombre ASC;",
      [provinciaId],
    );
    res.json(resultado);
  } catch {
    console.error("Error al obtener localidades");
    res.status(500).send("Error al obtener localidades");
  }
});

//OBTENER TODAS LAS ESPECIALIDADES //

app.get("/api/especialidades", async (req, res) => {
  try {
    const [resultado] = await pool.execute(
      "SELECT * FROM especialidades_medicas",
    );
    res.json(resultado);
  } catch {
    console.error("Error al obtener especialidades");
    res.status(500).send("Error al obtener especialidades");
  }
});

// OBTENER CODIGOS DISPONIBLES //

app.get("/api/codigosdisponibles", async (req, res) => {
  const query =
    "SELECT codigo_activacion AS codigos FROM perfiles WHERE usuario is NULL";

  try {
    const [resultado] = await pool.execute(query);
    res.json(resultado);
  } catch {
    console.error("Error al obtener codigos");
    res.status(500).send("Error al obtener codigos");
  }
});

//OBTENER LOCALIDADES SEGUN ID PROVINCIA //

app.get("/api/provincias", async (req, res) => {
  try {
    const [resultado] = await pool.execute("SELECT * FROM provincias");
    res.json(resultado);
  } catch {
    console.error("Error al obtener provincias");
    res.status(500).send("Error al obtener provincias");
  }
});

//OBTENER PACIENTES SEGUN ID CONSULTORIO //

app.get("/api/pacientes/:idConsultorio", async (req, res) => {
  const { idConsultorio } = req.params;
  try {
    const query = `
      SELECT 
        nombre_paciente AS nombre, 
        apellido_paciente AS apellido, 
        dni, 
        telefono,
        COUNT(*) AS cantidad_turnos
      FROM turnos 
      WHERE estado = ? AND consultorio_id = ?
      GROUP BY dni, nombre_paciente, apellido_paciente, telefono
      ORDER BY cantidad_turnos DESC
    `;

    const [resultado] = await pool.execute(query, ["reservado", idConsultorio]);
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    res.status(500).send("Error al obtener pacientes");
  }
});

app.get("/api/turnosxfecha/:fecha", async (req, res) => {
  const { fecha } = req.params;
  try {
    const query = `SELECT  
    t.id,
    t.nombre_paciente AS paciente,
    t.DNI,
    t.telefono,
    t.fecha, 
    t.hora,
    t.notificacion_5h_enviada AS notificacionEnviada,
    p.titulo,
    p.nombre AS nombreProfesional,
    p.apellido AS apellidoProfesional,
    c.direccion,
    c.telefono AS telefonoConsultorio,
    l.nombre as localidad
    FROM turnos AS t
    JOIN
    profesionales AS p ON p.id = t.profesional_id
    JOIN
    consultorios AS c ON c.id = t.consultorio_id
    JOIN 
    localidades AS l ON l.id = c.localidad
    WHERE fecha >= ? AND 
    estado = ?`;
    const [resultado] = await pool.execute(query, [fecha, "reservado"]);
    res.json(resultado);
  } catch {
    console.error("Error al obtener turnos por fecha");
    res.status(500).send("Error al obtener turnos por fecha");
  }
});

app.get("/api/todoslosturnosxfecha/:fecha/:idProf", async (req, res) => {
  const { fecha, idProf } = req.params;
  try {
    const query = `SELECT  
    t.id,
    t.nombre_paciente AS paciente,
    t.DNI,
    t.telefono,
    t.fecha, 
    t.hora,
    t.notificacion_5h_enviada AS notificacionEnviada,
    p.titulo,
    p.nombre AS nombreProfesional,
    p.apellido AS apellidoProfesional,
    c.direccion,
    c.telefono AS telefonoConsultorio,
    l.nombre as localidad
    FROM turnos AS t
    JOIN
    profesionales AS p ON p.id = t.profesional_id
    JOIN
    consultorios AS c ON c.id = t.consultorio_id
    JOIN 
    localidades AS l ON l.id = c.localidad
    WHERE fecha = ? AND ${idProf} = t.profesional_id`;
    const [resultado] = await pool.execute(query, [fecha]);
    res.json(resultado);
  } catch {
    console.error("Error al obtener turnos por fecha");
    res.status(500).send("Error al obtener turnos por fecha");
  }
});

//OBTENER TURNOS DE UN PROFESIONAL POR ID //

app.get(
  "/api/turnos-profesional/:profesionalId/:consultorioId",
  async (req, res) => {
    const { profesionalId, consultorioId } = req.params;

    // La validación sigue siendo importante
    if (isNaN(profesionalId) || isNaN(consultorioId)) {
      return res.status(400).json({
        message:
          "IDs de profesional o consultorio inválidos. Deben ser números.",
      });
    }

    // Tu consulta SQL para obtener los turnos del profesional
    const query = `
      SELECT
          t.id,
          CONCAT(p.apellido, ', ', p.nombre) AS medico,
          p.especialidad AS especialidad,
          c.direccion,
          t.fecha,
          t.estado,
          t.nombre_paciente,
          t.apellido_paciente,
          t.DNI,
          t.cobertura,
          t.telefono,
          t.hora,
          t.duracion

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
      const [resultado] = await pool.execute(query, [
        profesionalId,
        consultorioId,
      ]);
      res.json(resultado); // Envía los resultados como JSON
    } catch (error) {
      console.error(
        `Error al obtener turnos para el profesional ${profesionalId} y consultorio ${consultorioId}:`,
        error,
      );
      res
        .status(500)
        .send("Error interno del servidor al obtener turnos del profesional.");
    }
  },
);

app.get("/api/turnosxidconsultorio/:idConsultorio", async (req, res) => {
  const { idConsultorio } = req.params;
  try {
    const query = `SELECT 
    t.id,
    t.nombre_paciente,
    t.apellido_paciente,
    t.DNI,
    t.telefono,
    t.fecha,
    t.hora,
    t.estado,
    p.nombre AS nombreProfesional,
    p.apellido AS apellidoProfesional,
    p.especialidad,
    CASE 
        WHEN t.cobertura = 'particular' THEN '' 
        WHEN cm.siglas IS NULL THEN ''
        ELSE cm.siglas 
    END AS cobertura
FROM turnos AS t
JOIN profesionales AS p 
    ON p.id = t.profesional_id
JOIN consultorios AS c 
    ON c.id = t.consultorio_id
LEFT JOIN cobertura_medica AS cm 
    ON cm.id = t.cobertura
WHERE c.id = 1034 AND t.estado = 'reservado'`;
    const [resultado] = await pool.execute(query, [idConsultorio]);
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener turnos por consultorio", error);
    res.status(500).send("Error al obtener turnos por consultorio");
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
      c.hora_inicio AS inicio,
      c.hora_cierre AS cierre,
      l.nombre AS localidad
  FROM profesional_consultorio AS pc 
  JOIN consultorios AS c ON c.id = pc.consultorio_id
  JOIN profesionales AS p ON p.id = pc.profesional_id 
  JOIN localidades AS l ON l.id = c.localidad
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
    p.matricula AS matricula,
    p.telefono,
    p.slug
     FROM profesional_consultorio AS pc
     JOIN 
     profesionales AS p ON p.id = pc.profesional_id
     JOIN
     consultorios AS c ON c.id = pc.consultorio_id
    WHERE pc.consultorio_id = ? AND pc.estado = 'activo'
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
    cm.id AS id,
    cm.nombre AS nombre,
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
c.id,
c.nombre,
c.direccion,
p.nombre AS provincia,
l.nombre AS localidad,
c.tipo,
c.hora_inicio AS inicio,
c.hora_cierre AS cierre,
c.usuario,
c.contrasena,
c.sena AS seña,
c.telefono,
c.importe_sena AS importeSeña
FROM consultorios AS c
JOIN
provincias AS p ON p.id = c.provincia
JOIN
localidades AS l ON l.id = c.localidad
WHERE c.id = ?
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
p.id,    
p.nombre,
p.apellido,
p.especialidad,
p.matricula,
p.titulo,
p.slug
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

//OBTENER TURNO POR ID DE TURNO //

app.get("/api/todoslosturnos/:turnoID", async (req, res) => {
  const { turnoID } = req.params;
  const query = `SELECT t.id, CONCAT(t.nombre_paciente, ' ', t.apellido_paciente) 
  AS paciente, 
  t.dni,
  t.estado,
  t.fecha, 
  t.hora, 
  p.id AS profesionalID ,
  CONCAT(p.nombre, ' ', p.apellido) AS profesional, 
  p.especialidad,
  c.id AS consultorioID,
  c.direccion,
  c.telefono as telefono_consultorio,
  l.nombre AS localidad
  FROM turnos AS t 
  JOIN profesionales AS p ON t.profesional_id = p.id
  JOIN consultorios AS c ON t.consultorio_id = c.id
  JOIN localidades AS l ON c.localidad = l.id
       WHERE t.id = ?`;

  try {
    const [resultados] = await pool.execute(query, [turnoID]);
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener turno:", error); // Mensaje más específico
    res.status(500).send("Error interno del servidor al obtener turno");
  }
});

// OBTENER CONSULTORIOS X ID PERFIL //

app.get("/api/consultoriosxidperfil/:perfilId", async (req, res) => {
  const { perfilId } = req.params;

  const consulta = `SELECT 
  c.id,
  c.nombre,
  c.direccion,
  c.telefono,
  c.tipo,
  loc.nombre AS localidad,
  prov.nombre AS provincia
  FROM consultorios AS c
  JOIN
  localidades AS loc ON loc.id = c.localidad
  JOIN
  provincias AS prov ON prov.id = c.provincia
  JOIN
  perfiles_consultorios AS pc ON pc.consultorio_id = c.id
  JOIN
  perfiles AS p ON p.id = pc.perfil_id
  WHERE p.id = ?`;

  try {
    const [resultados] = await pool.execute(consulta, [perfilId]);
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener consultorios", error);
    res.status(500).send("Error interno del servidor al obtener consultorios");
  }
});

// OBTENER PROFESIONAL X ID PERFIL

app.get("/api/profesionalxidperfil/:perfilId", async (req, res) => {
  const { perfilId } = req.params;

  const consulta = `SELECT 
  p.id,
  p.nombre,
  p.apellido,
  p.matricula,
  p.especialidad,
  p.telefono,
  p.slug
  FROM profesionales AS p
  JOIN
  perfiles_profesionales AS pp ON pp.profesional_id = p.id
  WHERE pp.perfil_id = ?`;

  try {
    const [resultados] = await pool.execute(consulta, [perfilId]);
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener profesional", error);
    res.status(500).send("Error interno del servidor al obtener profesional");
  }
});

//  CAMBIAR ESTADO NOTIFICACION ENVIADA //

app.put("/api/cambiarNotificacionEnviada/:turnoId", async (req, res) => {
  const { turnoId } = req.params;
  const query = `
    UPDATE turnos
    SET notificacion_5h_enviada = ?
    WHERE id = ?;
  `;
  const values = [true, turnoId];
  try {
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `Turno con ID ${turnoId} no encontrado.` });
    }
    res.status(200).json({
      message: "Notificación marcada como enviada.",
      updatedId: turnoId,
    });
  } catch (error) {
    console.error("Error al actualizar la notificación:", error);
    res.status(500).json({
      message: "Error interno del servidor al actualizar la notificación.",
    });
  }
});

// RESERVAR TURNO //

app.put("/api/reservarturno/:turnoId", async (req, res) => {
  const { turnoId } = req.params;
  const {
    nombre_paciente,
    apellido_paciente,
    DNI,
    cobertura,
    telefono,
    estado,
    fecha,
    hora,
    profesionalID,
    consultorioID,
  } = req.body;

  // Validación de campos
  if (
    !nombre_paciente ||
    !apellido_paciente ||
    !DNI ||
    !cobertura ||
    !telefono ||
    !estado
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
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

  const values = [
    nombre_paciente,
    apellido_paciente,
    DNI,
    cobertura,
    telefono,
    estado,
    turnoId,
  ];

  try {
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `Turno con ID ${turnoId} no encontrado.` });
    }

    // ✅ Se eliminó completamente el envío de WhatsApp aquí

    res.status(200).json({
      message: "Turno actualizado exitosamente.",
      updatedId: turnoId,
      changes: result.affectedRows,
      notified: "No se envió notificación", // Opcional: puedes quitar este campo si ya no es relevante
    });
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar el turno." });
  }
});

// CANCELAR TURNOS //

app.put("/api/cancelarturno/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Actualiza el turno
    const [result] = await pool.query(
      "UPDATE turnos SET estado = ? , DNI = ? WHERE id = ?",
      ["disponible", "", id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    // ✅ IMPORTANTE: Debes enviar una respuesta
    return res.status(200).json({ message: "Turno cancelado con éxito" });
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
});

// HABILITAR TURNOS //

app.post("/api/habilitarturnos", async (req, res) => {
  const {
    consultorioId,
    profesionalId,
    fechas, // ← ahora es un array
    horaInicio,
    duracion,
    cantidadTurnosPorDia, // ← renombrado para claridad
  } = req.body;

  // Validación básica
  if (
    !consultorioId ||
    !profesionalId ||
    !Array.isArray(fechas) ||
    fechas.length === 0 ||
    !horaInicio ||
    !duracion ||
    !cantidadTurnosPorDia ||
    cantidadTurnosPorDia <= 0
  ) {
    return res.status(400).json({
      message:
        "Faltan datos requeridos: consultorioId, profesionalId, fechas (array), horaInicio, duracion y cantidadTurnosPorDia.",
    });
  }

  // Validar formato de cada fecha (espera "YYYY-MM-DD")
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (const fecha of fechas) {
    if (!dateRegex.test(fecha)) {
      return res.status(400).json({
        message: `Formato de fecha inválido: ${fecha}. Usa YYYY-MM-DD.`,
      });
    }
  }

  // Validar formato de horaInicio (espera "HH:MM")
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaInicio)) {
    return res.status(400).json({
      message: "Formato de hora de inicio inválido. Usa HH:MM.",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO turnos (consultorio_id, profesional_id, fecha, hora, duracion)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Procesar cada fecha
    for (const fecha of fechas) {
      let currentHour = horaInicio;

      for (let i = 0; i < cantidadTurnosPorDia; i++) {
        // Insertar turno
        await connection.execute(insertQuery, [
          consultorioId,
          profesionalId,
          fecha,
          currentHour,
          duracion,
        ]);

        // Calcular próxima hora
        const [hours, minutes] = currentHour.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + duracion);

        const nextHours = String(date.getHours()).padStart(2, "0");
        const nextMinutes = String(date.getMinutes()).padStart(2, "0");
        currentHour = `${nextHours}:${nextMinutes}`;
      }
    }

    await connection.commit();

    const totalTurnos = fechas.length * cantidadTurnosPorDia;
    res.status(200).json({
      message: `✅ Se han habilitado ${totalTurnos} turnos en ${fechas.length} día(s).`,
      totalTurnos,
      dias: fechas.length,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al habilitar turnos en la base de datos:", error);
    res.status(500).json({
      message: "Error interno del servidor al habilitar turnos.",
    });
  } finally {
    if (connection) connection.release();
  }
});

// BORRAR COBERTURA DEL CONSULTORIO //

app.delete(
  "/api/borrarCoberturaDeConsulotorio/:coberturaMedicaId/:consultorioId",
  async (req, res) => {
    const { coberturaMedicaId, consultorioId } = req.params;

    try {
      // Validación básica de los IDs
      if (
        !coberturaMedicaId ||
        isNaN((coberturaMedicaId && !consultorioId) || isNaN(consultorioId))
      ) {
        return res
          .status(400)
          .json({ message: "ID cobertura médica inválidos." });
      }

      // Consulta SQL para eliminar la relación en la tabla intermedia
      const query = `
            DELETE FROM consultorio_cobertura AS cc
            WHERE  cc.cobertura_medica_id = ? AND cc.consultorio_id = ?
        `;
      const [resultado] = await pool.execute(query, [
        coberturaMedicaId,
        consultorioId,
      ]);

      // 'affectedRows' indica cuántas filas fueron eliminadas
      if (resultado.affectedRows === 0) {
        // Si no se eliminó ninguna fila, es probable que la relación no existiera
        return res.status(404).json({
          message: "Relación de cobertura no encontrada para este consultorio.",
        });
      }

      // Éxito: retorna un estado 200 OK y un mensaje
      res
        .status(200)
        .json({ message: "Cobertura eliminada del consultorio exitosamente." });
    } catch (error) {
      console.error("Error al eliminar cobertura del consultorio:", error);
      res.status(500).json({
        message: "Error interno del servidor al eliminar la cobertura.",
      });
    }
  },
);

// BORRAR TURNO //

app.delete("/api/borrarTurno/:idTurno", async (req, res) => {
  const { idTurno } = req.params;

  try {
    // Validación básica de los IDs
    if (!idTurno || isNaN(idTurno)) {
      return res.status(400).json({ message: "ID turno inválido." });
    }

    // Consulta SQL para eliminar la relación en la tabla intermedia
    const query = `
            DELETE FROM turnos AS t
            WHERE  t.id = ?
        `;
    const [resultado] = await pool.execute(query, [idTurno]);

    // 'affectedRows' indica cuántas filas fueron eliminadas
    if (resultado.affectedRows === 0) {
      // Si no se eliminó ninguna fila, es probable que la relación no existiera
      return res.status(404).json({ message: "Turno no encontrado." });
    }

    // Éxito: retorna un estado 200 OK y un mensaje
    res.status(200).json({ message: "Turno eliminado exitosamente." });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar turno." });
  }
});

// BORRAR TODOS TURNOS DE UNA FECHA POR ID CONSULTORIO Y ID PROFESIONAL //

app.delete("/api/borrarTodosLosTurnos", async (req, res) => {
  const { IdConsultorio, idProfesional, fecha } = req.body;

  try {
    // Consulta SQL para eliminar la relación en la tabla intermedia
    const query = `
        DELETE FROM turnos
        WHERE consultorio_id = ? AND profesional_id = ? AND fecha = ? AND estado = 'disponible'
        `;
    const [resultado] = await pool.execute(query, [
      IdConsultorio,
      idProfesional,
      fecha,
    ]);

    // 'affectedRows' indica cuántas filas fueron eliminadas
    if (resultado.affectedRows === 0) {
      // Si no se eliminó ninguna fila, es probable que la relación no existiera
      return res.status(404).json({ message: "Turnos no encontrados." });
    }

    // Éxito: retorna un estado 200 OK y un mensaje
    res.status(200).json({ message: "Turnos eliminados exitosamente." });
  } catch (error) {
    console.error("Error al eliminar turnos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar turnos." });
  }
});

// AGREGAR COBERTURA Al CONSULTORIO //

app.post(
  "/api/agregarCoberturaAlConsultorio/:coberturaMedicaId/:consultorioId",
  async (req, res) => {
    const { coberturaMedicaId, consultorioId } = req.params;

    // Validación básica de los IDs
    if (
      !coberturaMedicaId ||
      isNaN(coberturaMedicaId) ||
      !consultorioId ||
      isNaN(consultorioId)
    ) {
      return res
        .status(400)
        .json({ message: "ID cobertura médica o consultorio inválidos." });
    }

    try {
      // Consulta SQL para insertar la relación en la tabla intermedia
      const query = `
            INSERT INTO consultorio_cobertura (cobertura_medica_id, consultorio_id)
            VALUES (?, ?)
        `;
      const [resultado] = await pool.execute(query, [
        coberturaMedicaId,
        consultorioId,
      ]);

      // Éxito: retorna un estado 201 Created y un mensaje
      res.status(201).json({
        message: "Cobertura agregada al consultorio exitosamente.",
        insertId: resultado.insertId,
      });
    } catch (error) {
      console.error("Error al agregar cobertura al consultorio:", error);
      res.status(500).json({
        message: "Error interno del servidor al agregar la cobertura.",
      });
    }
  },
);

//LOGIN //

app.post("/api/login", async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM perfiles WHERE usuario = ?",
      [usuario],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const perfil = rows[0];

    console.log(perfil);
    const isValid = await bcrypt.compare(contraseña, perfil.contrasena);

    console.log(isValid);

    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar JWT (opcional, pero recomendado)
    const token = jwt.sign(
      { id: perfil.id, usuario: perfil.usuario, tipo: perfil.tipo },
      "tu_clave_secreta", // Usa una variable de entorno
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login exitoso",
      perfil: { id: perfil.id, usuario: perfil.usuario, nombre: perfil.nombre },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// MODIFICAR DATOS DEL CONSUTORIO //

app.put("/api/modificardatosconsultorio/:consultorioId", async (req, res) => {
  const { consultorioId } = req.params;
  const { telefono, sena } = req.body;

  const query = `
        UPDATE consultorios
        SET
            
            telefono = ?,
            sena = ?
            WHERE id = ?;
    `;

  // Los valores se pasan como un array para la consulta preparada
  const values = [telefono, sena, consultorioId];

  try {
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: `Consultorio con ID ${consultorioId} no encontrado.`,
      });
    }

    res.status(200).json({
      message: "Datos actualizados exitosamente.",
      updatedId: consultorioId,
      changes: result.affectedRows,
    });
  } catch (error) {
    console.error("Error al actualizar el turno:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al actualizar el turno." });
  }
});

// MODIFICAR ESTADO DE TURNO //

app.put("/api/modificarestadoturno/:turnoId", async (req, res) => {
  const { turnoId } = req.params;

  if (!turnoId || isNaN(turnoId)) {
    return res.status(400).json({ message: "Turno no encontrado." });
  }

  const query = `
        UPDATE turnos
        SET
        estado = 'finalizado'
        WHERE id = ?;
    `;

  // Los valores se pasan como un array para la consulta preparada

  try {
    const [result] = await pool.query(query, [turnoId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: `Turno con ID ${turnoId} no encontrado.` });
    }

    res.status(200).json({
      message: "Estado del turno actualizado exitosamente.",
      updatedId: turnoId,
      changes: result.affectedRows,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del turno:", error);
    res.status(500).json({
      message: "Error interno del servidor al actualizar el estado del turno.",
    });
  }
});

// CREAR CONSULTORIO //

app.put("/api/crearconsultorio/:codigo", async (req, res) => {
  const { codigo } = req.params; // ✅ Extrae el código correctamente
  const {
    tipo,
    direccion,
    nombre,
    provincia,
    localidad,
    usuario,
    contraseña,
    telefono,
    seña,
    importeSeña,
    banco,
    cbu,
    alias,
    titular,
  } = req.body;

  // Validar campos obligatorios
  if (!direccion || !localidad || !provincia || !usuario || !contraseña) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    // ✅ Verificar si el usuario ya existe (en cualquier consultorio)
    const [existingUsers] = await pool.execute(
      "SELECT id FROM consultorios WHERE usuario = ?",
      [usuario],
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "El usuario ya está en uso." });
    }

    // ✅ Verificar que el código de activación exista y esté pendiente
    const [consultorios] = await pool.execute(
      "SELECT id FROM consultorios WHERE codigo_activacion = ?",
      [codigo],
    );
    if (consultorios.length === 0) {
      return res
        .status(404)
        .json({ message: "Código de activación inválido." });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Normalizar valores de seña
    const safeImporte =
      seña && importeSeña ? parseFloat(importeSeña) || null : null;
    const safeBanco = seña && banco ? banco : null;
    const safeCbu = seña && cbu ? cbu : null;
    const safeAlias = seña && alias ? alias : null;
    const safeTitular = seña && titular ? titular : null;

    // Actualizar el consultorio
    const [resultado] = await pool.execute(
      `UPDATE consultorios SET
        tipo = ?,
        direccion = ?,
        nombre = ?,
        provincia = ?,
        localidad = ?,
        usuario = ?,
        contrasena = ?,
        telefono = ?,
        sena = ?,
        importe_sena = ?,
        banco = ?,
        cbu = ?,
        alias = ?,
        cuenta_nombre = ?
      WHERE codigo_activacion = ?`,
      [
        tipo,
        direccion,
        nombre,
        provincia,
        localidad,
        usuario,
        hashedPassword,
        telefono || null,
        seña ? 1 : 0,
        safeImporte,
        safeBanco,
        safeCbu,
        safeAlias,
        safeTitular,
        codigo,
      ],
    );

    // ✅ Verificar si se afectó alguna fila
    if (resultado.affectedRows === 0) {
      return res.status(500).json({
        message:
          "No se pudo actualizar el consultorio (ninguna fila afectada).",
      });
    }

    res.status(200).json({
      message: "Consultorio creado con éxito.",
      affectedRows: resultado.affectedRows,
      nombre: nombre,
    });
  } catch (error) {
    console.error("Error al crear consultorio:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear el consultorio.",
    });
  }
});

// CREAR PERFIL

app.put("/api/crearperfil/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const { usuario, contraseña, tipo } = req.body;

  console.log(usuario, contraseña, tipo);

  if (!usuario || !contraseña || !tipo) {
    return res.status(400).json({ message: "Faltan campos obligatorios " });
  }

  try {
    const [perfilesExistentes] = await pool.execute(
      "SELECT id FROM perfiles WHERE usuario = ?",
      [usuario],
    );
    if (perfilesExistentes.length > 0) {
      return res.status(409).json({ message: "El usuario ya esta en uso" });
    }

    const [perfiles] = await pool.execute(
      "SELECT id FROM perfiles WHERE codigo_activacion = ?",
      [codigo],
    );
    if (perfiles.length === 0) {
      return res
        .status(404)
        .json({ message: "Código de activación inválido." });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const [resultado] = await pool.execute(
      `UPDATE perfiles SET usuario = ?, contrasena = ?, tipo = ? WHERE codigo_activacion = ?`,
      [usuario, hashedPassword, tipo, codigo],
    );

    if (resultado.affectedRows === 0) {
      return res.status(500).json({
        message: "No se pudo actualizar el perfil (ninguna fila afectada).",
      });
    }

    res.status(200).json({
      message: "Perfil creado con éxito.",
      affectedRows: resultado.affectedRows,
    });
  } catch (error) {
    console.error("Error al crear perfil:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear el perfil.",
    });
  }
});

// VINCULAR PROFESIONAL CON CONSULTORIO //

app.post("/api/unionprofesionalconsultorio", async (req, res) => {
  const { profesionalID, consultorioID } = req.body;

  // Validación de campos
  if (!profesionalID || !consultorioID) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: profesionalID y consultorioID.",
    });
  }

  try {
    // Intentar insertar o actualizar si ya existe
    const [result] = await pool.execute(
      `
      INSERT INTO profesional_consultorio (profesional_id, consultorio_id, estado) 
      VALUES (?, ?, 'activo') 
      ON DUPLICATE KEY UPDATE 
        estado = IF(estado = 'inactivo', 'activo', estado)
      `,
      [profesionalID, consultorioID],
    );

    // Analizar el resultado
    if (result.affectedRows === 0) {
      // Caso extremo: no se insertó ni actualizó
      return res.status(500).json({
        message: "No se realizó ningún cambio. Verifique los datos.",
      });
    }

    if (result.changedRows === 1) {
      // Se cambió el estado (de inactivo a activo)
      return res.status(200).json({
        message: "Profesional reactivado correctamente.",
      });
    } else if (result.affectedRows === 1 && result.changedRows === 0) {
      // Ya existía y ya estaba activo
      return res.status(200).json({
        message: "El profesional ya estaba asociado y activo.",
      });
    } else {
      // Nuevo registro insertado
      return res.status(201).json({
        message: "Profesional asociado correctamente.",
      });
    }
  } catch (error) {
    console.error("Error al asociar profesional:", error);

    // Error de clave foránea: profesional o consultorio no existen
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "Error: El profesional o el consultorio no existen.",
      });
    }

    // Error por falta de clave única (común si no está definida)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({
        message:
          "Error interno: Registro duplicado. Asegúrese de tener una clave única en (profesional_id, consultorio_id).",
      });
    }

    // Otros errores (ej: conexión DB)
    return res.status(500).json({
      message: "Error interno del servidor. Intente más tarde.",
    });
  }
});

// VINCULAR PROFESIONAL CON PERFIL

app.post("/api/unionprofesionalperfil", async (req, res) => {
  const { profesionalID, perfilID } = req.body;

  // Validación de campos
  if (!profesionalID || !perfilID) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: profesionalID y perfilID.",
    });
  }

  try {
    // Intentar insertar, ignorar si ya existe (o actualizar si es necesario)
    const [result] = await pool.execute(
      `
      INSERT IGNORE INTO perfiles_profesionales (perfil_id, profesional_id) 
      VALUES (?, ?)
      `,
      [perfilID, profesionalID],
    );

    // Si no se insertó nada, probablemente ya existía
    if (result.affectedRows === 0) {
      return res.status(200).json({
        message: "La asociación ya existía.",
      });
    }

    // Si se insertó correctamente
    return res.status(201).json({
      message: "Profesional asociado correctamente.",
    });
  } catch (error) {
    console.error("Error al asociar profesional con perfil:", error);

    // Clave foránea no encontrada
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        message: "Error: El profesional o el consultorio no existen.",
      });
    }

    // Error por duplicado (si no usamos INSERT IGNORE) o problema de índice
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(200).json({
        message: "La asociación ya existía.",
      });
    }

    // Otros errores (ej: problemas de conexión)
    return res.status(500).json({
      message: "Error interno del servidor. Intente más tarde.",
      error: error.message,
    });
  }
});

// CREAR Y VINCULAR PROFESIONAL CON CONSULTORIO //

const normalizarSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

app.post("/api/crear-y-vincular-profesional", async (req, res) => {
  const {
    nombre,
    apellido,
    matricula,
    especialidad,
    titulo,
    telefono,
    slug: slugEntrada,
    consultorioID,
  } = req.body;

  // Validación básica
  if (
    !nombre ||
    !apellido ||
    !matricula ||
    !especialidad ||
    !consultorioID ||
    !slugEntrada
  ) {
    return res.status(400).json({
      message:
        "Faltan campos obligatorios: nombre, apellido, matricula, especialidad, consultorioID o slug.",
    });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // ✅ Validar que el consultorio exista
    const [consultorioExistente] = await connection.execute(
      "SELECT id FROM consultorios WHERE id = ?",
      [consultorioID],
    );
    if (consultorioExistente.length === 0) {
      return res
        .status(404)
        .json({ message: "El consultorio especificado no existe." });
    }

    // 1. Buscar por matrícula
    const [existingByMatricula] = await connection.execute(
      "SELECT id, slug FROM profesionales WHERE matricula = ?",
      [matricula],
    );

    let profesionalID;
    let finalSlug = normalizarSlug(slugEntrada); // ✅ Normalizado

    if (existingByMatricula.length > 0) {
      profesionalID = existingByMatricula[0].id;
      finalSlug = existingByMatricula[0].slug;
      console.log(
        `Profesional con matrícula ${matricula} ya existe. ID: ${profesionalID}`,
      );
    } else {
      // ✅ Generar slug único
      let uniqueSlug = finalSlug;
      let counter = 1;
      const MAX_ATTEMPTS = 100;

      while (counter < MAX_ATTEMPTS) {
        const [existing] = await connection.execute(
          "SELECT id FROM profesionales WHERE slug = ?",
          [uniqueSlug],
        );
        if (existing.length === 0) break;
        uniqueSlug = `${finalSlug}-${counter}`;
        counter++;
      }

      if (counter >= MAX_ATTEMPTS) {
        return res.status(500).json({
          message:
            "No se pudo generar un slug único. Inténtalo con otro nombre.",
        });
      }

      finalSlug = uniqueSlug;

      const [insertResult] = await connection.execute(
        "INSERT INTO profesionales (nombre, apellido, especialidad, titulo, matricula, telefono, slug) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          nombre,
          apellido,
          especialidad,
          titulo || null,
          matricula,
          telefono || null,
          finalSlug,
        ],
      );
      profesionalID = insertResult.insertId;
      console.log(
        `Profesional creado con ID: ${profesionalID}, slug: ${finalSlug}`,
      );
    }

    // 2. Vincular con consultorio
    try {
      await connection.execute(
        "INSERT INTO profesional_consultorio (profesional_id, consultorio_id) VALUES (?, ?)",
        [profesionalID, consultorioID],
      );
      console.log(
        `Profesional ID ${profesionalID} asociado al consultorio ID ${consultorioID}`,
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(
          `Advertencia: ya vinculado (profesional ID ${profesionalID}, consultorio ID ${consultorioID})`,
        );
      } else {
        throw error;
      }
    }

    await connection.commit();

    return res.status(201).json({
      message:
        existingByMatricula.length > 0
          ? "Profesional ya existente y asociado correctamente."
          : "Profesional creado y asociado correctamente.",
      profesional: {
        id: profesionalID,
        nombre,
        apellido,
        especialidad,
        matricula,
        titulo,
        telefono,
        slug: finalSlug,
        consultorioID,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(console.error);
      connection.release();
    }

    console.error("Error en crear-y-vincular-profesional:", error);
    return res.status(500).json({
      message: "Error interno del servidor al crear o vincular el profesional.",
    });
  }
});

// app.post("/api/crear-y-vincular-profesional", async (req, res) => {
//   const {
//     nombre,
//     apellido,
//     matricula,
//     especialidad,
//     titulo,
//     telefono,
//     consultorioID,
//   } = req.body;

//   console.log("Datos recibidos:", req.body);

//   // Validación de campos obligatorios
//   if (!nombre || !apellido || !matricula || !especialidad || !consultorioID) {
//     return res.status(400).json({
//       message:
//         "Faltan campos obligatorios: nombre, apellido, matricula, especialidad o consultorioID.",
//     });
//   }

//   let connection;

//   try {
//     // Obtener conexión directa para manejar transacción
//     connection = await pool.getConnection();
//     await connection.beginTransaction();

//     // 1. Verificar si ya existe un profesional con esa matrícula
//     const [existing] = await connection.execute(
//       "SELECT id FROM profesionales WHERE matricula = ?",
//       [matricula]
//     );

//     let profesionalID;

//     if (existing.length > 0) {
//       // Si ya existe, usar el ID existente
//       profesionalID = existing[0].id;
//       console.log(
//         `Profesional con matrícula ${matricula} ya existe. ID: ${profesionalID}`
//       );
//     } else {
//       // Si no existe, crear uno nuevo
//       const [insertResult] = await connection.execute(
//         "INSERT INTO profesionales (nombre, apellido, especialidad, titulo, matricula, telefono) VALUES (?, ?, ?, ?, ?, ?)",
//         [
//           nombre,
//           apellido,
//           especialidad,
//           titulo || null,
//           matricula,
//           telefono || null,
//         ]
//       );
//       profesionalID = insertResult.insertId;
//       console.log(`Profesional creado con ID: ${profesionalID}`);
//     }

//     // 2. Intentar asociar al consultorio
//     try {
//       await connection.execute(
//         "INSERT INTO profesional_consultorio (profesional_id, consultorio_id) VALUES (?, ?)",
//         [profesionalID, consultorioID]
//       );
//       console.log(
//         `Profesional ID ${profesionalID} asociado al consultorio ID ${consultorioID}`
//       );
//     } catch (error) {
//       // Si ya está vinculado (duplicado), ignoramos el error y continuamos
//       if (error.code === "ER_DUP_ENTRY") {
//         console.log(
//           `Advertencia: El profesional ID ${profesionalID} ya está asociado al consultorio ID ${consultorioID}`
//         );
//       } else {
//         throw error; // Otro error sí debe romper la transacción
//       }
//     }

//     // 3. Confirmar transacción
//     await connection.commit();

//     // Responder con éxito
//     return res.status(201).json({
//       message:
//         existing.length > 0
//           ? "Profesional ya existente y asociado correctamente."
//           : "Profesional creado y asociado correctamente.",
//       profesional: {
//         id: profesionalID,
//         nombre,
//         apellido,
//         especialidad,
//         matricula,
//         titulo,
//         telefono,
//         consultorioID,
//       },
//     });
//   } catch (error) {
//     // Revertir transacción si falló algo
//     if (connection) {
//       await connection.rollback().catch(console.error);
//       connection.release();
//     }

//     console.error("Error en crear-y-vincular-profesional:", error);

//     // Manejo específico de errores
//     if (error.code === "ER_DUP_ENTRY") {
//       return res.status(409).json({
//         message: "Este profesional ya está asociado a este consultorio.",
//       });
//     }

//     return res.status(500).json({
//       message: "Error interno del servidor al crear o vincular el profesional.",
//     });
//   }
// });

// CREAR Y VINCULAR PROFESIONAL CON PERFIL //

app.post("/api/crear-y-vincular-profesional-perfil", async (req, res) => {
  const {
    nombre,
    apellido,
    matricula,
    especialidad,
    titulo,
    telefono,
    slug: slugEntrada,
    perfilID,
  } = req.body;

  // Validación de campos obligatorios
  if (
    !nombre ||
    !apellido ||
    !matricula ||
    !especialidad ||
    !perfilID ||
    !slugEntrada
  ) {
    return res.status(400).json({
      message:
        "Faltan campos obligatorios: nombre, apellido, matricula, especialidad o perfilID.",
    });
  }

  let connection;

  try {
    // Obtener conexión directa para manejar transacción
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Verificar si ya existe un profesional con esa matrícula
    const [existingByMatricula] = await connection.execute(
      "SELECT id FROM profesionales WHERE matricula = ?",
      [matricula],
    );

    let profesionalID;
    let finalSlug = normalizarSlug(slugEntrada);

    if (existingByMatricula.length > 0) {
      profesionalID = existingByMatricula[0].id;
      finalSlug = existingByMatricula[0].slug;
      console.log(
        `Profesional con matrícula ${matricula} ya existe. ID: ${profesionalID}`,
      );
    } else {
      // ✅ Generar slug único
      let uniqueSlug = finalSlug;
      let counter = 1;
      const MAX_ATTEMPTS = 100;

      while (counter < MAX_ATTEMPTS) {
        const [existing] = await connection.execute(
          "SELECT id FROM profesionales WHERE slug = ?",
          [uniqueSlug],
        );
        if (existing.length === 0) break;
        uniqueSlug = `${finalSlug}-${counter}`;
        counter++;
      }

      if (counter >= MAX_ATTEMPTS) {
        return res.status(500).json({
          message:
            "No se pudo generar un slug único. Inténtalo con otro nombre.",
        });
      }

      finalSlug = uniqueSlug;

      const [insertResult] = await connection.execute(
        "INSERT INTO profesionales (nombre, apellido, especialidad, titulo, matricula, telefono, slug) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          nombre,
          apellido,
          especialidad,
          titulo || null,
          matricula,
          telefono || null,
          finalSlug,
        ],
      );
      profesionalID = insertResult.insertId;
      console.log(
        `Profesional creado con ID: ${profesionalID}, slug: ${finalSlug}`,
      );
    }

    // 2. Intentar asociar al consultorio
    try {
      await connection.execute(
        "INSERT INTO perfiles_profesionales (perfil_id, profesional_id) VALUES (?, ?)",
        [perfilID, profesionalID],
      );
      console.log(
        `Profesional ID ${profesionalID} asociado al consultorio ID ${perfilID}`,
      );
    } catch (error) {
      // Si ya está vinculado (duplicado), ignoramos el error y continuamos
      if (error.code === "ER_DUP_ENTRY") {
        console.log(
          `Advertencia: El profesional ID ${profesionalID} ya está asociado al consultorio ID ${perfilID}`,
        );
      } else {
        throw error; // Otro error sí debe romper la transacción
      }
    }

    // 3. Confirmar transacción
    await connection.commit();

    // Responder con éxito
    return res.status(201).json({
      message:
        existingByMatricula.length > 0
          ? "Profesional ya existente y asociado correctamente."
          : "Profesional creado y asociado correctamente.",
      profesional: {
        id: profesionalID,
        nombre,
        apellido,
        especialidad,
        matricula,
        titulo,
        telefono,
        perfilID,
      },
    });
  } catch (error) {
    // Revertir transacción si falló algo
    if (connection) {
      await connection.rollback().catch(console.error);
      connection.release();
    }

    console.error("Error en crear-y-vincular-profesional:", error);

    // Manejo específico de errores
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Este profesional ya está asociado a este consultorio.",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor al crear o vincular el profesional.",
    });
  }
});

// CREAR Y VINCULAR CONSULTORIO CON PERFIL //

app.post(
  "/api/crear-y-unir-consultorio-a-perfil/:perfilID/:profesionalID",
  async (req, res) => {
    const { perfilID, profesionalID } = req.params;

    const {
      perfilTipo,
      direccion,
      localidad,
      provincia,
      telefono,
      nombre,
      seña,
      importe,
      banco,
      cbu,
      alias,
      titular,
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !direccion || !localidad || !provincia) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios: nombre, dirección, localidad o provincia.",
      });
    }

    let connection;
    let consultorioID;

    // Convertir valores seguros para la seña
    const safeImporte = seña && importe ? parseFloat(importe) : null;
    const safeBanco = seña ? banco : null;
    const safeCbu = seña ? cbu : null;
    const safeAlias = seña ? alias : null;
    const safeTitular = seña ? titular : null;

    // Validar que si seña es true, el importe sea válido
    if (seña && (isNaN(safeImporte) || safeImporte <= 0)) {
      return res.status(400).json({
        message: "El importe de la seña debe ser un número válido mayor a 0.",
      });
    }

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // 1. Insertar nuevo consultorio
      const [insertResult] = await connection.execute(
        `INSERT INTO consultorios 
        (tipo, nombre, direccion, localidad, provincia, telefono, sena, importe_sena, banco, cbu, alias, cuenta_nombre) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          perfilTipo,
          nombre,
          direccion,
          localidad,
          provincia,
          telefono || null,
          seña ? 1 : 0,
          safeImporte,
          safeBanco,
          safeCbu,
          safeAlias,
          safeTitular,
        ],
      );

      consultorioID = insertResult.insertId;
      console.log(`Consultorio creado con ID: ${consultorioID}`);

      // 2. Asociar el consultorio al perfil
      try {
        await connection.execute(
          "INSERT INTO perfiles_consultorios (perfil_id, consultorio_id) VALUES (?, ?)",
          [perfilID, consultorioID],
        );
        console.log(
          `Consultorio ID ${consultorioID} asociado al perfil ID ${perfilID}`,
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(
            `Advertencia: El consultorio ya está asociado al perfil ID ${perfilID}`,
          );
        } else {
          throw error;
        }
      }

      // 3. Asociar el profesional al consultorio
      try {
        await connection.execute(
          "INSERT INTO profesional_consultorio (profesional_id, consultorio_id) VALUES (?, ?)",
          [profesionalID, consultorioID],
        );
        console.log(
          `Profesional ID ${profesionalID} asociado al consultorio ID ${consultorioID}`,
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(
            "Advertencia: El profesional ya está asociado a este consultorio.",
          );
        } else {
          throw error;
        }
      }

      // 4. Confirmar transacción
      await connection.commit();

      return res.status(201).json({
        message:
          "Consultorio creado, asociado al perfil y al profesional correctamente.",
        consultorio: {
          id: consultorioID,
          nombre,
          direccion,
          localidad,
          provincia,
          telefono,
          seña,
          importe: safeImporte,
          banco: safeBanco,
          cbu: safeCbu,
          alias: safeAlias,
          titular: safeTitular,
          perfilID,
          profesionalID,
        },
      });
    } catch (error) {
      if (connection) {
        await connection
          .rollback()
          .catch((err) => console.error("Error en rollback:", err));
        connection.release();
      }

      console.error("Error en crear y vincular consultorio:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Este consultorio ya está asociado al profesional o perfil.",
        });
      }

      return res.status(500).json({
        message:
          "Error interno del servidor al crear o vincular el consultorio.",
      });
    }
  },
);

// CREAR Y VINCULAR CENTRO MEDICO CON PERFIL //

app.post(
  "/api/crear-y-unir-centromedico-a-perfil/:perfilID",
  async (req, res) => {
    const { perfilID } = req.params;

    const { perfilTipo, direccion, localidad, provincia, telefono, nombre } =
      req.body;

    // Validación de campos obligatorios
    if (!nombre || !direccion || !localidad || !provincia || !telefono) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios: nombre, dirección, teléfono, localidad o provincia.",
      });
    }

    let connection;
    let consultorioID;

    try {
      // Obtener conexión y comenzar transacción
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // 1. Insertar nuevo consultorio
      const [insertResult] = await connection.execute(
        `INSERT INTO consultorios 
        (tipo,nombre, direccion, localidad, provincia, telefono) 
       VALUES (?, ?, ?, ?, ?, ?)`,
        [perfilTipo, nombre, direccion, localidad, provincia, telefono || null],
      );

      consultorioID = insertResult.insertId;
      console.log(`Consultorio creado con ID: ${consultorioID}`);

      // 2. Asociar el consultorio al perfil
      try {
        await connection.execute(
          "INSERT INTO perfiles_consultorios (perfil_id, consultorio_id) VALUES (?, ?)",
          [perfilID, consultorioID],
        );
        console.log(
          `Consultorio ID ${consultorioID} asociado al perfil ID ${perfilID}`,
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(
            `Advertencia: El consultorio ya está asociado al perfil ID ${perfilID}`,
          );
        } else {
          throw error;
        }
      }

      // 4. Confirmar transacción
      await connection.commit();

      // Respuesta exitosa
      return res.status(201).json({
        message: "Centro medico creado, asociado al perfil correctamente",
        consultorio: {
          id: consultorioID,
          nombre,
          direccion,
          localidad,
          provincia,
          telefono,
          perfilID,
        },
      });
    } catch (error) {
      // Revertir transacción
      if (connection) {
        await connection
          .rollback()
          .catch((err) => console.error("Error en rollback:", err));
        connection.release();
      }

      console.error("Error en crear y vincular consultorio:", error);

      // Manejo de duplicados
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Este consultorio ya está asociado al perfil.",
        });
      }

      return res.status(500).json({
        message:
          "Error interno del servidor al crear o vincular el consultorio.",
      });
    }
  },
);

// DESVINCULAR PROFESIONAL DE CENTRO MEDICO //

app.put(
  "/api/desvincularprofesional/:consultorioId/:profesionalId",
  async (req, res) => {
    const { consultorioId, profesionalId } = req.params;

    try {
      const query = `
  UPDATE profesional_consultorio
  SET estado = 'inactivo'
  WHERE profesional_id = ? AND consultorio_id = ?
`;

      const [resultado] = await pool.execute(query, [
        profesionalId,
        consultorioId,
      ]);

      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Profesional no encontrado en centro médico" });
      }

      res
        .status(200)
        .json({ message: "Profesional encontrado y desvinculado" });
    } catch (err) {
      console.error("Error al desvincular profesional", err);
      res
        .status(500)
        .json({ message: "Error interno al no desvincular profesional" });
    }
  },
);

function formatearTitulo(titulo) {
  const normalizado = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  switch (normalizado) {
    case "doctor":
      return { pronombre: "el", tituloAbrev: "Dr." };
    case "doctora":
      return { pronombre: "la", tituloAbrev: "Dra." };
    case "licenciado":
      return { pronombre: "el", tituloAbrev: "Lic." };
    case "licenciada":
      return { pronombre: "la", tituloAbrev: "Lic." };
    default:
      return {
        pronombre: normalizado.endsWith("a") ? "la" : "el",
        tituloAbrev: titulo.charAt(0).toUpperCase() + titulo.slice(1) + ".",
      };
  }
}

// OBTENER SLUG //

app.get("/api/profesionales/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT id, nombre FROM profesionales WHERE slug = ? LIMIT 1",
      [slug],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profesional no encontrado" });
    }

    res.json(rows[0]); // { id: 22, nombre: "Dr. García" }
  } catch (err) {
    console.error("Error al buscar profesional:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cron.schedule("* * * * *", async () => {
  console.log("🔍 Buscando turnos que ocurran en 12 horas o menos...");

  const ahora = dayjs();

  try {
    const [rows] = await pool.execute(`
      SELECT 
        t.id, 
        t.DNI,
        t.telefono,
        t.nombre_paciente, 
        t.apellido_paciente, 
        t.telefono, 
        DATE_FORMAT(t.fecha, '%Y-%m-%d') AS fecha, 
        t.hora,
        t.notificacion_5h_enviada,
        p.nombre AS nombre_profesional,
        p.apellido AS apellido_profesional,
        p.titulo,
        c.direccion,
        c.telefono AS telConsultorio,
        l.nombre AS localidad
      FROM turnos t
      JOIN profesionales p ON t.profesional_id = p.id
      JOIN consultorios c ON t.consultorio_id = c.id
      JOIN localidades l ON c.localidad = l.id
      WHERE t.estado = 'reservado' 
      AND t.notificacion_5h_enviada = 0
    `);

    if (rows.length === 0) {
      console.log("📭 No hay turnos pendientes para notificar.");
      return;
    }

    console.log(`✅ ${rows.length} turnos encontrados.`);

    for (const turno of rows) {
      // Fecha y hora del turno en zona horaria local
      const fechaHoraTurno = dayjs.tz(
        `${turno.fecha} ${turno.hora}`,
        "YYYY-MM-DD HH:mm:ss",
        "America/Argentina/Buenos_Aires",
      );

      if (!fechaHoraTurno.isValid()) {
        console.warn(`⚠️ Fecha inválida para turno ID ${turno.id}`);
        continue;
      }

      const fechaFormateada = fechaHoraTurno.format("DD/MM");

      // Diferencia en minutos
      const diffMinutos = fechaHoraTurno.diff(ahora, "minute");
      const diffHoras = diffMinutos / 60;

      console.log(
        `📋 Turno: ${turno.nombre_paciente} | Faltan ${diffMinutos} min`,
      );

      // Si ya pasó el turno
      if (diffMinutos < 0) {
        console.log(`⚠️ Turno ID ${turno.id} ya pasó. Saltando...`);
        continue;
      }

      // ¿Faltan 5 horas o menos? (es decir, entre 0 y 5 horas)
      if (diffHoras <= 12) {
        console.log(`🟢 Enviando recordatorio para el turno ID ${turno.id}`);

        // Formatear hora: HH:mm (sin segundos)
        const [horas, minutos] = turno.hora.split(":");
        const horaFormateada = `${horas}:${minutos}`;

        // Formatear título
        const { pronombre, tituloAbrev } = formatearTitulo(turno.titulo);

        // Generar mensaje
        const mensaje = `
  👋 ¡Hola ${turno.nombre_paciente}!

  🆔 DNI: ${turno.DNI}
  📱 Teléfono: ${turno.telefono}

  Este es un recordatorio de tu turno con ${pronombre} ${tituloAbrev.toUpperCase()} ${turno.nombre_profesional.toUpperCase()} ${turno.apellido_profesional.toUpperCase()}.

  📅 El día ${fechaFormateada} a las ${horaFormateada} 
  📍 ${turno.direccion.toUpperCase()}, ${turno.localidad.toUpperCase()}

  ⏰ Te pedimos llegar con 10 minutos de anticipación.

  ❌ Si necesitás reprogramar https://turnate.site/cancelar-turno/${turno.id}

  (SOLO HASTA 2 HORAS LUEGO DE RECIBIR ESTE MENSAJE)

  NO RESPONDAS ESTE MENSAJE, es un sistema automático.

  Te esperamos 🩺✨
`
          .split("\n") // Divide en líneas
          .map((linea) => linea.trim()) // ✅ Elimina espacios SOLO al inicio y final de cada línea
          .filter((linea) => linea !== "") // Mantiene líneas vacías intencionales como separadores
          .join("\n"); // Vuelve a unirlas con saltos de línea

        try {
          // ✅ Enviar WhatsApp con Twilio
          await client.messages.create({
            from: twilioWhatsApp, // Ej: +14155238886
            to: `whatsapp:+5493815588504`, // Asegúrate que esté en formato internacional +549...
            body: mensaje,
          });

          console.log(
            `✅ Mensaje enviado a ${turno.telefono} para el turno ID ${turno.id}`,
          );

          // ✅ Marcar como notificado
          await pool.execute(
            "UPDATE turnos SET notificacion_5h_enviada = ? WHERE id = ?",
            [1, turno.id],
          );

          console.log(`📌 Turno ID ${turno.id} marcado como notificado.`);
        } catch (error) {
          console.error(
            `❌ Error al enviar mensaje al turno ID ${turno.id}:`,
            error.message,
          );
          // No actualizamos el estado si falló el envío, para reintentar luego
        }
      } else {
        console.log(
          `⏳ Faltan ${Math.floor(diffHoras)}h ${Math.round(
            diffMinutos % 60,
          )}m - Aún no es momento.`,
        );
      }
    }
  } catch (error) {
    console.error("❌ Error en el cron de notificaciones:", error.message);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
});
