const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS BÁSICAS ---

app.get("/", (req, res) => {
  res.send("Servidor de Proyectos funcionando 🚀");
});

// --- RUTA DE LOGIN ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.pass === password) {
        res.json({
          success: true,
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            foto: user.foto,
          },
        });
      } else {
        res.status(401).json({ success: false, message: "Contraseña incorrecta" });
      }
    } else {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// --- RUTA DE REGISTRO (SIGN-UP) ---
app.post("/api/register", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const checkUser = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "El usuario ya existe" });
    }
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, pass, rol) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, email, password, "usuario"]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error al registrar:", err.message);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// --- NUEVAS RUTAS DE GESTIÓN (Para el componente Users.js) ---

// 1. Obtener todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nombre, email, pass, rol, foto FROM usuarios ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la lista de usuarios" });
  }
});

// 2. Actualizar usuario (Edición desde el Modal)
app.put("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  const { nombre, pass, rol } = req.body;
  try {
    // Protección: No permitir que nadie le quite el rol de admin al master desde aquí
    if (email === "admin@oneredrd.info" && rol !== "admin") {
      return res.status(403).json({ error: "No puedes degradar al Administrador Maestro" });
    }

    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, pass = $2, rol = $3 WHERE email = $4 RETURNING *",
      [nombre, pass, rol, email]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

// 3. Eliminar usuario (handleDelete)
app.delete("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  try {
    // Bloqueo de seguridad para el Admin Maestro
    if (email === "admin@oneredrd.info") {
      return res.status(403).json({ error: "No se permite eliminar la cuenta maestra" });
    }

    await pool.query("DELETE FROM usuarios WHERE email = $1", [email]);
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el usuario de la DB" });
  }
});

// Configuración del Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Backend corriendo en http://localhost:${PORT}`);
});
