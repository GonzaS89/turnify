import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import twilio from "twilio";
import jwt from 'jsonwebtoken';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({ origin: "*" }));

app.use(express.json());

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
    const [resultado] = await pool.execute("SELECT * FROM consultorios");
    res.json(resultado);
  } catch {
    console.error("Error al obtener consultorios");
    res.status(500).send("Error al obtener consultorios");
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
      [provinciaId]
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
    const [resultado] = await pool.execute("SELECT * FROM especialidades_medicas");
    res.json(resultado);
  } catch {
    console.error("Error al obtener especialidades");
    res.status(500).send("Error al obtener especialidades");
  }
})

// OBTENER CODIGOS DISPONIBLES //

app.get("/api/codigosdisponibles", async(req,res) => {
  const query = 'SELECT codigo_activacion AS codigos FROM consultorios WHERE usuario is NULL';

  try{
    const [resultado] = await pool.execute(query);
    res.json(resultado);
  }catch{
    console.error("Error al obtener codigos");
    res.status(500).send("Error al obtener codigos")
  }
})

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

//OBTENER TURNOS DE UN PROFESIONAL POR ID //

app.get("/api/turnos-profesional/:profesionalId/:consultorioId",
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
        error
      );
      res
        .status(500)
        .send("Error interno del servidor al obtener turnos del profesional.");
    }
  }
);

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
    p.telefono
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
p.titulo
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
  const query = `SELECT t.id, CONCAT(t.nombre_paciente, ' ', t.apellido_paciente) AS paciente, t.dni,t.estado,t.fecha, t.hora, CONCAT(p.nombre, ' ', p.apellido) AS profesional, p.especialidad FROM turnos AS t JOIN profesionales AS p ON t.profesional_id = p.id
     WHERE t.id = ?`;

  try {
    const [resultados] = await pool.execute(query, [turnoID]);
    res.json(resultados);
  } catch (error) {
    console.error("Error al obtener turno:", error); // Mensaje más específico
    res.status(500).send("Error interno del servidor al obtener turno");
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

    // ✅ Si el estado es "reservado", enviamos WhatsApp al admin
    if (estado === "reservado") {
      const [datosConsultorio] = await pool.execute(
        "SELECT c.nombre, c.direccion,l.nombre AS localidad, c.tipo, c.telefono, c.sena AS seña, c.importe_sena AS importe, c.banco, c.cbu, c.alias, c.cuenta_nombre AS titular FROM consultorios AS c JOIN localidades AS l ON l.id = c.localidad WHERE c.id = ?",
        [consultorioID]
      );

      const [datosProfesional] = await pool.execute(
        "SELECT nombre, apellido FROM profesionales WHERE id = ?",
        [profesionalID]
      );

    

      const linkCancelar = `https://turnify1.netlify.app/cancelar-turno/${turnoId}`; // Cambia "tusitio.com" por tu dominio real

      const mensaje = `
🔔 *¡Nuevo Turno Reservado!* 🔔

✅ *Paciente:* ${nombre_paciente} ${apellido_paciente}
🆔 *DNI:* ${DNI} || 
📞 *Teléfono:* ${telefono}

📅 *Fecha:* ${fecha}
⏰ *Hora:* ${hora}
👨‍⚕️ *Profesional:* Dr/a ${datosProfesional[0].nombre} ${
        datosProfesional[0].apellido
      }
🏥 *Consultorio:* ${datosConsultorio[0].tipo === 'Particular' ? datosConsultorio[0].tipo : `${datosConsultorio[0].tipo} ${datosConsultorio[0].nombre}`}
📍 *Dirección:* ${datosConsultorio[0].direccion}, ${
        datosConsultorio[0].localidad
      }

${
  datosConsultorio[0].seña === 1 ?
  `
💰 *Importe de la seña:* $${datosConsultorio[0].importe}
🏦 *Banco:* ${datosConsultorio[0].banco}
🏧 *CBU:* ${datosConsultorio[0].cbu}
🏷️ *Alias:* ${datosConsultorio[0].alias}
👤 *Titular de la cuenta:* ${datosConsultorio[0].titular}

Enviar comprobante a ${datosConsultorio[0].telefono} para que se haga efectivo el turno.
` : ""
}

❌ *¿Necesitás cancelar?*
Puedes hacerlo fácilmente aquí:
${linkCancelar} 

Gracias por confiar en nosotros. ¡Te esperamos! 🙌
`;
      // `✅ Turno el ${new Date().toLocaleDateString('es-AR')}`;

      try {
        await client.messages.create({
          body: mensaje,
          from: twilioWhatsApp, // whatsapp:+14155238886
          to: `whatsapp:+5493815588504`, // Tu número de WhatsApp
        });
        console.log("✅ Notificación enviada por WhatsApp al administrador");
      } catch (error) {
        console.error("❌ Error al enviar WhatsApp:", error.message);
      }
    }

    res.status(200).json({
      message: "Turno actualizado exitosamente.",
      updatedId: turnoId,
      changes: result.affectedRows,
      notified:
        estado === "reservado"
          ? "Notificación enviada al admin"
          : "No se envió notificación",
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
      ["disponible", "", id]
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
    fecha,
    cantidadTurnos,
    horaInicio,
    duracion
  } = req.body;


  // Validación básica
  if (
    !consultorioId ||
    !profesionalId ||
    !fecha ||
    !cantidadTurnos ||
    cantidadTurnos <= 0
  ) {
    return res.status(400).json({
      message: "Faltan datos requeridos o cantidad de turnos inválida.",
    });
  }

  // Validar formato de horaInicio (espera "HH:MM")
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaInicio)) {
    return res
      .status(400)
      .json({ message: "Formato de hora de inicio inválido. Usa HH:MM." });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const insertQuery = `
        INSERT INTO turnos (consultorio_id, profesional_id, fecha, hora, duracion)
        VALUES (?, ?, ?, ?, ?)
      `;

    let currentHour = horaInicio; // "08:30"

    for (let i = 0; i < cantidadTurnos; i++) {
      // Insertar turno
      await connection.execute(insertQuery, [
        consultorioId,
        profesionalId,
        fecha,
        currentHour,
        duracion
      ]);

      // Calcular próxima hora
      const [hours, minutes] = currentHour.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      date.setMinutes(date.getMinutes() + duracion);

      // Formatear como "HH:MM"
      const nextHours = String(date.getHours()).padStart(2, "0");
      const nextMinutes = String(date.getMinutes()).padStart(2, "0");
      currentHour = `${nextHours}:${nextMinutes}`;
    }

    await connection.commit();
    res.status(200).json({
      message: `Se han habilitado ${cantidadTurnos} turnos para el ${fecha}.`,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al habilitar turnos en la base de datos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al habilitar turnos." });
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
  }
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
  }
);

//LOGIN //

app.post('/api/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM consultorios WHERE usuario = ?',
      [usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const consultorio = rows[0];
    const isValid = await bcrypt.compare(contraseña, consultorio.contrasena);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT (opcional, pero recomendado)
    const token = jwt.sign(
      { id: consultorio.id, usuario: consultorio.usuario },
      'tu_clave_secreta', // Usa una variable de entorno
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      consultorio: { id: consultorio.id, usuario: consultorio.usuario, nombre: consultorio.nombre },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
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

  console.log("Código recibido:", codigo);
  console.log("Datos recibidos:", req.body);

  // Validar campos obligatorios
  if (!direccion || !localidad || !provincia || !usuario || !contraseña) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    // ✅ Verificar si el usuario ya existe (en cualquier consultorio)
    const [existingUsers] = await pool.execute(
      "SELECT id FROM consultorios WHERE usuario = ?",
      [usuario]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "El usuario ya está en uso." });
    }

    // ✅ Verificar que el código de activación exista y esté pendiente
    const [consultorios] = await pool.execute(
      "SELECT id FROM consultorios WHERE codigo_activacion = ?",
      [codigo]
    );
    if (consultorios.length === 0) {
      return res.status(404).json({ message: "Código de activación inválido." });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Normalizar valores de seña
    const safeImporte = seña && importeSeña ? (parseFloat(importeSeña) || null) : null;
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
        codigo
      ]
    );

    // ✅ Verificar si se afectó alguna fila
    if (resultado.affectedRows === 0) {
      return res.status(500).json({ message: "No se pudo actualizar el consultorio (ninguna fila afectada)." });
    }

    res.status(200).json({
      message: "Consultorio creado con éxito.",
      affectedRows: resultado.affectedRows,
      nombre: nombre,
    });

  } catch (error) {
    console.error("Error al crear consultorio:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear el consultorio."
    });
  }
});

// CREAR PROFESIONAL //

// app.post("/api/crearprofesional", async (req, res) => {
//   const { nombre, apellido, matricula, especialidad, titulo, telefono } = req.body;

//   console.log("Datos recibidos:", req.body);

//   // Validación
//   if (!nombre || !apellido || !matricula || !especialidad) {
//     return res.status(400).json({ message: "Faltan campos obligatorios." });
//   }

//   try {
//     // Verificar si ya existe por matrícula
//     const [existing] = await pool.execute(
//       "SELECT id FROM profesionales WHERE matricula = ?",
//       [matricula]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({
//         message: "Ya existe un profesional con esa matrícula.",
//       });
//     }

//     // Insertar nuevo profesional
//     const [result] = await pool.execute(
//       "INSERT INTO profesionales (nombre, apellido, especialidad, titulo, matricula, telefono) VALUES (?, ?, ?, ?, ?, ?)",
//       [nombre, apellido, especialidad, titulo || null, matricula, telefono]
//     );

//     // ✅ Usamos `res` para responder, NO `result`
//     res.status(201).json({
//       message: "Profesional creado con éxito.",
//       id: result.insertId,
//       nombre,
//       apellido,
//       especialidad,
//       matricula,
//       titulo,
//       telefono
//     });

//   } catch (error) {
//     console.error("Error al crear profesional:", error);

//     // Manejo de error de duplicado (opcional)
//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({
//         message: "Matrícula ya registrada.",
//       });
//     }

//     // Error genérico
//     res.status(500).json({
//       message: "Error interno del servidor al crear el profesional.",
//     });
//   }
// });

// // CREAR UNION PROFESIONA Y CONSULTORIO //

app.post("/api/unionprofesionalconsultorio", async (req, res) => {
  const { profesionalID, consultorioID } = req.body;

  if (!profesionalID || !consultorioID) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: profesionalID y consultorioID."
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO profesional_consultorio (profesional_id, consultorio_id, estado) 
       VALUES (?, ?, 'activo') 
       ON DUPLICATE KEY UPDATE 
       estado = IF(estado = 'inactivo', 'activo', estado)`,
      [profesionalID, consultorioID]
    );

    // Analizamos el resultado:
    // - Si es inserción: result.affectedRows = 1
    // - Si actualizó estado (de inactivo a activo): result.affectedRows = 1, result.changedRows = 1
    // - Si ya estaba activo: result.affectedRows = 1, result.changedRows = 0

    if (result.affectedRows === 1) {
      if (result.changedRows === 1) {
        return res.status(200).json({
          message: "Profesional reactivado correctamente."
        });
      } else {
        return res.status(201).json({
          message: "Profesional asociado correctamente."
        });
      }
    }

    // Caso raro, pero por seguridad
    return res.status(500).json({
      message: "No se pudo procesar la solicitud."
    });

  } catch (error) {
    console.error("Error al asociar profesional:", error);

    // Clave duplicada ya la maneja ON DUPLICATE, pero otros errores:
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        message: "Profesional o consultorio no existen."
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor."
    });
  }
});


app.post("/api/unionprofesionalconsultorio", async (req, res) => {
  const { profesionalID, consultorioID } = req.body;

  if (!profesionalID || !consultorioID) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: profesionalID y consultorioID."
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO profesional_consultorio (profesional_id, consultorio_id, estado) 
       VALUES (?, ?, 'activo') 
       ON DUPLICATE KEY UPDATE 
       estado = IF(estado = 'inactivo', 'activo', estado)`,
      [profesionalID, consultorioID]
    );

    // Analizamos el resultado:
    // - Si es inserción: result.affectedRows = 1
    // - Si actualizó estado (de inactivo a activo): result.affectedRows = 1, result.changedRows = 1
    // - Si ya estaba activo: result.affectedRows = 1, result.changedRows = 0

    if (result.affectedRows === 1) {
      if (result.changedRows === 1) {
        return res.status(200).json({
          message: "Profesional reactivado correctamente."
        });
      } else {
        return res.status(201).json({
          message: "Profesional asociado correctamente."
        });
      }
    }

    // Caso raro, pero por seguridad
    return res.status(500).json({
      message: "No se pudo procesar la solicitud."
    });

  } catch (error) {
    console.error("Error al asociar profesional:", error);

    // Clave duplicada ya la maneja ON DUPLICATE, pero otros errores:
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        message: "Profesional o consultorio no existen."
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor."
    });
  }
});

// DESVINCULAR PROFESIONAL DE CENTRO MEDICO //

app.put("/api/desvincularprofesional/:consultorioId/:profesionalId", async(req, res) => {
  const { consultorioId, profesionalId } = req.params;

  try{
    const query = `
  UPDATE profesional_consultorio
  SET estado = 'inactivo'
  WHERE profesional_id = ? AND consultorio_id = ?
`;

    const [resultado] = await pool.execute(query,[
      profesionalId, 
      consultorioId
    ]);

    if(resultado.affectedRows === 0) {
      return res.status(404).json({message: "Profesional no encontrado en centro médico"});
    };

    res.status(200).json({message: "Profesional encontrado y desvinculado"})
  }catch(err){
    console.error("Error al desvincular profesional",err);
    res.status(500).json({message: "Error interno al no desvincular profesional"})
  }
})



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
});
