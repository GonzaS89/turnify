import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from 'bcryptjs'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors({ origin: "*" }));

app.use(express.json()) 

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

//OBTENER TODAS LAS COBERTURAS //

app.get("/api/coberturas", async (req, res) => {
        try {
            const [resultado] = await pool.execute("SELECT * FROM cobertura_medica");
            res.json(resultado);
        } catch {
            console.error("Error al obtener coberturas");
            res.status(500).send("Error al obtener coberturas");
        }
})

//OBTENER TODAS LAS PROVINCIAS //

app.get("/api/localidades/:provinciaId", async (req, res) => {
    const { provinciaId } = req.params;
    try {
        const [resultado] = await pool.execute("SELECT * FROM localidades WHERE provincia_id = ? ORDER BY nombre ASC;", [provinciaId]);
        res.json(resultado);
    } catch {
        console.error("Error al obtener localidades");
        res.status(500).send("Error al obtener localidades");
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
            t.hora

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
c.contrasena
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
    const { consultorioId, profesionalId, fecha, cantidadTurnos, horaInicio, duracionTurno = 30 } = req.body;
  
    // Validación básica
    if (!consultorioId || !profesionalId || !fecha || !cantidadTurnos || cantidadTurnos <= 0) {
      return res.status(400).json({ message: 'Faltan datos requeridos o cantidad de turnos inválida.' });
    }
  
    // Validar formato de horaInicio (espera "HH:MM")
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaInicio)) {
      return res.status(400).json({ message: 'Formato de hora de inicio inválido. Usa HH:MM.' });
    }
  
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
  
      const insertQuery = `
        INSERT INTO turnos (consultorio_id, profesional_id, fecha, hora)
        VALUES (?, ?, ?, ?)
      `;
  
      let currentHour = horaInicio; // "08:30"
  
      for (let i = 0; i < cantidadTurnos; i++) {
        // Insertar turno
        await connection.execute(insertQuery, [consultorioId, profesionalId, fecha, currentHour]);
  
        // Calcular próxima hora
        const [hours, minutes] = currentHour.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        date.setMinutes(date.getMinutes() + duracionTurno);
  
        // Formatear como "HH:MM"
        const nextHours = String(date.getHours()).padStart(2, '0');
        const nextMinutes = String(date.getMinutes()).padStart(2, '0');
        currentHour = `${nextHours}:${nextMinutes}`;
      }
  
      await connection.commit();
      res.status(200).json({ message: `Se han habilitado ${cantidadTurnos} turnos para el ${fecha}.` });
  
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error al habilitar turnos en la base de datos:', error);
      res.status(500).json({ message: 'Error interno del servidor al habilitar turnos.' });
    } finally {
      if (connection) connection.release();
    }
  });

// BORRAR COBERTURA DEL CONSULTORIO //

app.delete("/api/borrarCoberturaDeConsulotorio/:coberturaMedicaId/:consultorioId", async (req, res) => {
    const { coberturaMedicaId, consultorioId } = req.params;

    try {
        // Validación básica de los IDs
        if (!coberturaMedicaId || isNaN(coberturaMedicaId && !consultorioId || isNaN(consultorioId))) {
            return res.status(400).json({ message: "ID cobertura médica inválidos." });
        }

        // Consulta SQL para eliminar la relación en la tabla intermedia
        const query = `
            DELETE FROM consultorio_cobertura AS cc
            WHERE  cc.cobertura_medica_id = ? AND cc.consultorio_id = ?
        `;
        const [resultado] = await pool.execute(query, [coberturaMedicaId, consultorioId]);

        // 'affectedRows' indica cuántas filas fueron eliminadas
        if (resultado.affectedRows === 0) {
            // Si no se eliminó ninguna fila, es probable que la relación no existiera
            return res.status(404).json({ message: "Relación de cobertura no encontrada para este consultorio." });
        }

        // Éxito: retorna un estado 200 OK y un mensaje
        res.status(200).json({ message: "Cobertura eliminada del consultorio exitosamente." });

    } catch (error) {
        console.error("Error al eliminar cobertura del consultorio:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar la cobertura." });
    }
});

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
        res.status(500).json({ message: "Error interno del servidor al eliminar turno." });
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
        const [resultado] = await pool.execute(query, [IdConsultorio, idProfesional, fecha]);

        // 'affectedRows' indica cuántas filas fueron eliminadas
        if (resultado.affectedRows === 0) {
            // Si no se eliminó ninguna fila, es probable que la relación no existiera
            return res.status(404).json({ message: "Turnos no encontrados." });
        }

        // Éxito: retorna un estado 200 OK y un mensaje
        res.status(200).json({ message: "Turnos eliminados exitosamente." });

    } catch (error) {
        console.error("Error al eliminar turnos:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar turnos." });
    }
});

// AGREGAR COBERTURA Al CONSULTORIO //

app.post("/api/agregarCoberturaAlConsultorio/:coberturaMedicaId/:consultorioId", async (req, res) => {
    const { coberturaMedicaId, consultorioId } = req.params;

    // Validación básica de los IDs
    if (!coberturaMedicaId || isNaN(coberturaMedicaId) || !consultorioId || isNaN(consultorioId)) {
        return res.status(400).json({ message: "ID cobertura médica o consultorio inválidos." });
    }

    try {
        // Consulta SQL para insertar la relación en la tabla intermedia
        const query = `
            INSERT INTO consultorio_cobertura (cobertura_medica_id, consultorio_id)
            VALUES (?, ?)
        `;
        const [resultado] = await pool.execute(query, [coberturaMedicaId, consultorioId]);

        // Éxito: retorna un estado 201 Created y un mensaje
        res.status(201).json({ message: "Cobertura agregada al consultorio exitosamente.", insertId: resultado.insertId });

    } catch (error) {
        console.error("Error al agregar cobertura al consultorio:", error);
        res.status(500).json({ message: "Error interno del servidor al agregar la cobertura." });
    }
})


// MODIFICAR DATOS DEL CONSUTORIO //

app.put('/api/modificardatosconsultorio/:consultorioId', async (req, res) => {
    const { consultorioId } = req.params; 
    const { nombre, tipo, provincia, localidad, direccion, telefono, hora_inicio, hora_cierre } = req.body; 

    const query = `
        UPDATE consultorios
        SET
            nombre = ?,
            tipo = ?,
            provincia = ?,
            localidad = ?,
            direccion = ?,
            telefono = ?,
            hora_inicio = ?,
            hora_cierre = ?
            WHERE id = ?;
    `;

    // Los valores se pasan como un array para la consulta preparada
    const values = [nombre, tipo, provincia, localidad, direccion, telefono, hora_inicio, hora_cierre, consultorioId];

    try {
        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Consultorio con ID ${consultorioId} no encontrado.` });
        }

        res.status(200).json({
            message: 'Datos actualizados exitosamente.',
            updatedId: consultorioId,
            changes: result.affectedRows
        });

    } catch (error) {
        console.error('Error al actualizar el turno:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el turno.' });
    }
});

// MODIFICAR ESTADO DE TURNO //

app.put('/api/modificarestadoturno/:turnoId', async (req, res) => {

    const { turnoId } = req.params; 

    if (!turnoId || isNaN(turnoId)) {
        return res.status(400).json({ message: 'Turno no encontrado.' });
    }

    const query = `
        UPDATE turnos
        SET
        estado = 'finalizado'
        WHERE id = ?;
    `;

    // Los valores se pasan como un array para la consulta preparada


    try {
        const [result] = await pool.query(query,[turnoId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Turno con ID ${turnoId} no encontrado.` });
        }

        res.status(200).json({
            message: 'Estado del turno actualizado exitosamente.',
            updatedId: turnoId,
            changes: result.affectedRows
        });

    } catch (error) {
        console.error('Error al actualizar el estado del turno:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el estado del turno.' });
    }
})

app.put('/api/cambiarcredenciales', async (req, res) => {
    // Aquí asumimos que el ID del consultorio a actualizar se envía en el cuerpo.
    // En un sistema real, el ID vendría del token de autenticación del usuario logueado.
    const { id, currentUsuario, newUsuario, currentContrasena, newContrasena } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID del consultorio es requerido para la actualización.' });
    }

    try {
        // 1. Buscar el consultorio por su ID y usuario actual
        // Necesitamos el usuario actual para la verificación de contraseña
        const [rows] = await pool.execute(
            'SELECT id, usuario, contrasena FROM consultorios WHERE id = ? AND usuario = ?',
            [id, currentUsuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas o consultorio no encontrado.' });
        }

        const consultorio = rows[0];

        
        // 2. Verificar la contraseña actual
        const isPasswordValid = await bcrypt.compare(currentContrasena, consultorio.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta.' });
        }

        let updateFields = [];
        let updateValues = [];

        // 3. Preparar la actualización del usuario (nombre de usuario) si ha cambiado
        if (newUsuario && newUsuario.trim() !== '' && newUsuario !== consultorio.usuario) {
            // Verificar si el nuevo usuario ya está en uso por otro consultorio
            const [usuarioExistsRows] = await pool.execute(
                'SELECT id FROM consultorios WHERE usuario = ? AND id != ?',
                [newUsuario, consultorio.id]
            );
            if (usuarioExistsRows.length > 0) {
                return res.status(409).json({ message: 'El nuevo usuario ya está en uso por otro consultorio.' });
            }
            updateFields.push('usuario = ?');
            updateValues.push(newUsuario);
            console.log(`Consultorio (ID: ${consultorio.id}) cambió su usuario a: ${newUsuario}`);
        }

        // 4. Preparar la actualización de la contraseña si se proporcionó una nueva
        if (newContrasena && newContrasena.trim() !== '') {
            if (newContrasena.length < 6) {
                return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            }
            const newPasswordHash = await bcrypt.hash(newContrasena, 10);
            updateFields.push('contrasena = ?');
            updateValues.push(newPasswordHash);
            console.log(`Consultorio (ID: ${consultorio.id}) cambió su contraseña.`);
        }

        // Si no se cambió ni el usuario ni la contraseña
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron cambios para actualizar.' });
        }

        // 5. Ejecutar el UPDATE en la base de datos
        // Agregamos la actualización del timestamp updatedAt
        updateFields.push('updatedAt = NOW()');
        // El ID del consultorio va al final para la cláusula WHERE
        updateValues.push(consultorio.id);

        const updateQuery = `UPDATE consultorios SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(updateQuery, updateValues);

        res.status(200).json({ message: 'Credenciales actualizadas con éxito.' });

    } catch (error) {
        console.error('Error al actualizar credenciales:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El nuevo usuario ya está en uso.' });
        }
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
    


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
});

