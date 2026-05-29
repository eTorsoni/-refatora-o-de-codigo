const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'chave_secreta_b7store_123'; // Em produção, use variáveis de ambiente
let db;

// Inicializar Banco de Dados SQLite
(async () => {
    db = await open({
        filename: './b7store.db',
        driver: sqlite3.Database
    });

    // Criar Tabela de Utilizadores
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    `);

    // Criar Tabela de Produtos
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            sku TEXT UNIQUE,
            price REAL,
            category TEXT,
            description TEXT
        )
    `);

    // Criar um Administrador padrão se não existir
    const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@b7store.com']);
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.run('INSERT INTO users (email, password) VALUES (?, ?)', ['admin@b7store.com', hashedPassword]);
        console.log('👤 Utilizador administrador padrão criado: admin@b7store.com / admin123');
    }
})();

// Middleware de Autenticação (Proteger rotas de cadastro)
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};

/* ==================== ROTAS DE AUTENTICAÇÃO ==================== */

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(400).json({ error: 'E-mail ou senha incorretos.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'E-mail ou senha incorretos.' });

        // Gerar Token JWT válido por 2 horas
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ message: 'Login efetuado com sucesso!', token });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
});


/* ==================== ROTAS DE PRODUTOS ==================== */

// Listar todos os produtos (Aberto ao público - usado na index e produtos.html)
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.all('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
});

// Cadastrar novo produto (Protegido - requer o Token de Login)
app.post('/api/products', authMiddleware, async (req, res) => {
    const { name, sku, price, category, description } = req.body;

    if (!name || !sku || !price || !category) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    try {
        await db.run(
            'INSERT INTO products (name, sku, price, category, description) VALUES (?, ?, ?, ?, ?)',
            [name, sku, price, category, description]
        );
        res.status(201).json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Este código SKU já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro ao salvar o produto.' });
    }
});

// Iniciar o Servidor na porta 3000
app.listen(3000, () => {
    console.log('🚀 Backend B7Store a correr em http://localhost:3000');
});