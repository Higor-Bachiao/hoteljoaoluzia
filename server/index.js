const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hotel_system",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(dbConfig)

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    console.log("🔄 Inicializando banco de dados...")

    // Criar tabelas se não existirem
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        number VARCHAR(10) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        beds INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        amenities JSON,
        status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
        guest_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(50) PRIMARY KEY,
        room_id VARCHAR(50) NOT NULL,
        guest_data JSON NOT NULL,
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS guest_history (
        id VARCHAR(50) PRIMARY KEY,
        guest_data JSON NOT NULL,
        room_number VARCHAR(10) NOT NULL,
        room_type VARCHAR(50) NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'guest') DEFAULT 'guest',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Inserir usuários padrão se não existirem
    const [existingUsers] = await pool.execute("SELECT COUNT(*) as count FROM users")
    if (existingUsers[0].count === 0) {
      console.log("📝 Criando usuários padrão...")

      const adminPassword = await bcrypt.hash("admin123", 10)
      const staffPassword = await bcrypt.hash("staff123", 10)
      const guestPassword = await bcrypt.hash("guest123", 10)

      await pool.execute(
        `
        INSERT INTO users (id, name, email, password, role, phone) VALUES
        ('admin_1', 'Administrador', 'admin@hotel.com', ?, 'admin', '(11) 99999-9999'),
        ('staff_1', 'Funcionário', 'staff@hotel.com', ?, 'staff', '(11) 88888-8888'),
        ('guest_1', 'Hóspede', 'guest@hotel.com', ?, 'guest', '(11) 77777-7777')
      `,
        [adminPassword, staffPassword, guestPassword],
      )
    }

    // Inserir quartos padrão se não existirem
    const [existingRooms] = await pool.execute("SELECT COUNT(*) as count FROM rooms")
    if (existingRooms[0].count === 0) {
      console.log("🏨 Criando quartos padrão...")
      await insertDefaultRooms()
    }

    console.log("✅ Banco de dados inicializado com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error)
  }
}

// Função para inserir quartos padrão
async function insertDefaultRooms() {
  const defaultRooms = [
    // Andar 1 - Quartos 101-120
    ...Array.from({ length: 20 }, (_, i) => {
      const roomNumber = (101 + i).toString()
      const types = ["Solteiro", "Casal", "Triplo"]
      const type = types[i % 3]
      const capacity = type === "Solteiro" ? 1 : type === "Casal" ? 2 : 3
      const beds = type === "Triplo" ? 2 : 1
      const price = type === "Solteiro" ? 80 : type === "Casal" ? 120 : 150
      const amenities = ["wifi", "tv"]
      if (type === "Casal") amenities.push("ar-condicionado")
      if (type === "Triplo") amenities.push("minibar")

      return {
        id: `room_${roomNumber}`,
        number: roomNumber,
        type,
        capacity,
        beds,
        price,
        amenities: JSON.stringify(amenities),
        status: "available",
      }
    }),

    // Andar 2 - Quartos 201-220
    ...Array.from({ length: 20 }, (_, i) => {
      const roomNumber = (201 + i).toString()
      const types = ["Solteiro", "Casal", "Triplo"]
      const type = types[i % 3]
      const capacity = type === "Solteiro" ? 1 : type === "Casal" ? 2 : 3
      const beds = type === "Triplo" ? 2 : 1
      const price = type === "Solteiro" ? 85 : type === "Casal" ? 125 : 155
      const amenities = ["wifi", "tv"]
      if (type === "Casal") amenities.push("ar-condicionado")
      if (type === "Triplo") amenities.push("minibar")

      return {
        id: `room_${roomNumber}`,
        number: roomNumber,
        type,
        capacity,
        beds,
        price,
        amenities: JSON.stringify(amenities),
        status: "available",
      }
    }),

    // Andar 3 - Quartos 301-309 (Suítes)
    ...Array.from({ length: 9 }, (_, i) => {
      const roomNumber = (301 + i).toString()
      const type = i === 8 ? "Suíte Premium" : "Suíte"
      const capacity = i === 8 ? 4 : i % 2 === 0 ? 2 : 3
      const beds = i === 8 ? 2 : capacity === 3 ? 2 : 1
      const price = i === 8 ? 300 : capacity === 3 ? 250 : 200
      const amenities = ["wifi", "tv", "ar-condicionado", "minibar", "banheira"]
      if (i === 8) amenities.push("varanda")

      return {
        id: `room_${roomNumber}`,
        number: roomNumber,
        type,
        capacity,
        beds,
        price,
        amenities: JSON.stringify(amenities),
        status: "available",
      }
    }),
  ]

  // Inserir quartos em lotes
  for (const room of defaultRooms) {
    await pool.execute(
      `
      INSERT INTO rooms (id, number, type, capacity, beds, price, amenities, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [room.id, room.number, room.type, room.capacity, room.beds, room.price, room.amenities, room.status],
    )
  }

  console.log(`✅ ${defaultRooms.length} quartos inseridos com sucesso!`)
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token de acesso requerido" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "hotel_secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido" })
    }
    req.user = user
    next()
  })
}

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" })
    }

    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos" })
    }

    const user = users[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Email ou senha incorretos" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "hotel_secret_key",
      { expiresIn: "24h" },
    )

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
})

// ==================== ROTAS DE QUARTOS ====================

// Listar todos os quartos
app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, number, type, capacity, beds, price, amenities, status, guest_data, updated_at
      FROM rooms 
      ORDER BY number
    `)

    const rooms = rows.map((room) => ({
      id: room.id,
      number: room.number,
      type: room.type,
      capacity: room.capacity,
      beds: room.beds,
      price: Number.parseFloat(room.price),
      amenities: JSON.parse(room.amenities || "[]"),
      status: room.status,
      guest: room.guest_data ? JSON.parse(room.guest_data) : undefined,
      updatedAt: room.updated_at,
    }))

    res.json(rooms)
  } catch (error) {
    console.error("Erro ao buscar quartos:", error)
    res.status(500).json({ error: "Erro ao buscar quartos" })
  }
})

// Criar novo quarto
app.post("/api/rooms", authenticateToken, async (req, res) => {
  try {
    const { number, type, capacity, beds, price, amenities } = req.body
    const id = `room_${number}`

    await pool.execute(
      `
      INSERT INTO rooms (id, number, type, capacity, beds, price, amenities, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
    `,
      [id, number, type, capacity, beds, price, JSON.stringify(amenities || [])],
    )

    res.json({ id, message: "Quarto criado com sucesso" })
  } catch (error) {
    console.error("Erro ao criar quarto:", error)
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Número do quarto já existe" })
    } else {
      res.status(500).json({ error: "Erro ao criar quarto" })
    }
  }
})

// Atualizar quarto
app.put("/api/rooms/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const setClause = []
    const values = []

    Object.keys(updates).forEach((key) => {
      if (key === "amenities") {
        setClause.push(`${key} = ?`)
        values.push(JSON.stringify(updates[key]))
      } else if (key === "guest") {
        setClause.push("guest_data = ?")
        values.push(updates[key] ? JSON.stringify(updates[key]) : null)
      } else {
        setClause.push(`${key} = ?`)
        values.push(updates[key])
      }
    })

    if (setClause.length === 0) {
      return res.status(400).json({ error: "Nenhum campo para atualizar" })
    }

    values.push(id)

    await pool.execute(
      `
      UPDATE rooms SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `,
      values,
    )

    res.json({ message: "Quarto atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar quarto:", error)
    res.status(500).json({ error: "Erro ao atualizar quarto" })
  }
})

// Deletar quarto
app.delete("/api/rooms/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    await pool.execute("DELETE FROM rooms WHERE id = ?", [id])

    res.json({ message: "Quarto deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar quarto:", error)
    res.status(500).json({ error: "Erro ao deletar quarto" })
  }
})

// ==================== ROTAS DE RESERVAS ====================

// Listar reservas futuras
app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, room_id, guest_data, status, created_at
      FROM reservations 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `)

    const reservations = rows.map((reservation) => ({
      id: reservation.id,
      roomId: reservation.room_id,
      guest: JSON.parse(reservation.guest_data),
      status: reservation.status,
      createdAt: reservation.created_at,
    }))

    res.json(reservations)
  } catch (error) {
    console.error("Erro ao buscar reservas:", error)
    res.status(500).json({ error: "Erro ao buscar reservas" })
  }
})

// Criar nova reserva
app.post("/api/reservations", authenticateToken, async (req, res) => {
  try {
    const { roomId, guest } = req.body
    const id = `reservation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await pool.execute(
      `
      INSERT INTO reservations (id, room_id, guest_data, status) 
      VALUES (?, ?, ?, 'active')
    `,
      [id, roomId, JSON.stringify(guest)],
    )

    res.json({ id, message: "Reserva criada com sucesso" })
  } catch (error) {
    console.error("Erro ao criar reserva:", error)
    res.status(500).json({ error: "Erro ao criar reserva" })
  }
})

// Cancelar reserva
app.delete("/api/reservations/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    await pool.execute("DELETE FROM reservations WHERE id = ?", [id])

    res.json({ message: "Reserva cancelada com sucesso" })
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error)
    res.status(500).json({ error: "Erro ao cancelar reserva" })
  }
})

// ==================== ROTAS DE HISTÓRICO ====================

// Listar histórico de hóspedes
app.get("/api/history", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, guest_data, room_number, room_type, check_in_date, check_out_date, 
             total_price, status, created_at
      FROM guest_history 
      ORDER BY created_at DESC
    `)

    const history = rows.map((entry) => ({
      id: entry.id,
      guest: JSON.parse(entry.guest_data),
      roomNumber: entry.room_number,
      roomType: entry.room_type,
      checkInDate: entry.check_in_date,
      checkOutDate: entry.check_out_date,
      totalPrice: Number.parseFloat(entry.total_price),
      status: entry.status,
      createdAt: entry.created_at,
    }))

    res.json(history)
  } catch (error) {
    console.error("Erro ao buscar histórico:", error)
    res.status(500).json({ error: "Erro ao buscar histórico" })
  }
})

// Adicionar ao histórico
app.post("/api/history", authenticateToken, async (req, res) => {
  try {
    const { guest, roomNumber, roomType, checkInDate, checkOutDate, totalPrice, status } = req.body
    const id = `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await pool.execute(
      `
      INSERT INTO guest_history (id, guest_data, room_number, room_type, check_in_date, 
                                check_out_date, total_price, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [id, JSON.stringify(guest), roomNumber, roomType, checkInDate, checkOutDate, totalPrice, status],
    )

    res.json({ id, message: "Histórico adicionado com sucesso" })
  } catch (error) {
    console.error("Erro ao adicionar histórico:", error)
    res.status(500).json({ error: "Erro ao adicionar histórico" })
  }
})

// Atualizar status do histórico
app.put("/api/history/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    await pool.execute("UPDATE guest_history SET status = ? WHERE id = ?", [status, id])

    res.json({ message: "Status do histórico atualizado com sucesso" })
  } catch (error) {
    console.error("Erro ao atualizar histórico:", error)
    res.status(500).json({ error: "Erro ao atualizar histórico" })
  }
})

// Deletar histórico
app.delete("/api/history/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    await pool.execute("DELETE FROM guest_history WHERE id = ?", [id])

    res.json({ message: "Histórico deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar histórico:", error)
    res.status(500).json({ error: "Erro ao deletar histórico" })
  }
})

// Rota de teste
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando!",
    timestamp: new Date().toISOString(),
  })
})

// Inicializar servidor
async function startServer() {
  try {
    await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📡 API disponível em http://localhost:${PORT}/api`)
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error)
    process.exit(1)
  }
}

startServer()
