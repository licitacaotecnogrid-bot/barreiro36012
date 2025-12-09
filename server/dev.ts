import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleGetUsuarios,
  handleCreateUsuario,
  handleUpdateUsuario,
  handleDeleteUsuario,
} from "./routes/usuarios";
import {
  handleGetEventos,
  handleGetEventoById,
  handleCreateEvento,
  handleUpdateEvento,
  handleDeleteEvento,
} from "./routes/eventos";
import {
  handleGetComentarios,
  handleCreateComentario,
  handleDeleteComentario,
  handleUpdateComentario,
} from "./routes/comentarios";
import prisma from "./prisma";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Example API routes
app.get("/api/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

app.get("/api/demo", handleDemo);

// Usuários endpoints
app.post("/api/login", handleLogin);
app.get("/api/usuarios", handleGetUsuarios);
app.post("/api/usuarios", handleCreateUsuario);
app.put("/api/usuarios/:id", handleUpdateUsuario);
app.delete("/api/usuarios/:id", handleDeleteUsuario);

// Eventos endpoints
app.get("/api/eventos", handleGetEventos);
app.get("/api/eventos/:id", handleGetEventoById);
app.post("/api/eventos", handleCreateEvento);
app.put("/api/eventos/:id", handleUpdateEvento);
app.delete("/api/eventos/:id", handleDeleteEvento);

// Comentários endpoints
app.get("/api/eventos/:eventoId/comentarios", handleGetComentarios);
app.post("/api/eventos/:eventoId/comentarios", handleCreateComentario);
app.put("/api/eventos/:eventoId/comentarios/:comentarioId", handleUpdateComentario);
app.delete("/api/eventos/:eventoId/comentarios/:comentarioId", handleDeleteComentario);

// Professor endpoints
app.get("/api/professores", async (_req, res) => {
  try {
    const professors = await prisma.professorCoordenador.findMany();
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professors" });
  }
});

app.post("/api/professores", async (req, res) => {
  try {
    const { nome, email, senha, curso } = req.body;
    if (!nome || !email || !senha || !curso) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const professor = await prisma.professorCoordenador.create({
      data: { nome, email, senha, curso },
    });
    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create professor" });
  }
});

app.get("/api/professores/:id", async (req, res) => {
  try {
    const professor = await prisma.professorCoordenador.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch professor" });
  }
});

// Projeto Pesquisa endpoints
app.get("/api/projetos-pesquisa", async (_req, res) => {
  try {
    const projetos = await prisma.projetoPesquisa.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch research projects" });
  }
});

app.post("/api/projetos-pesquisa", async (req, res) => {
  try {
    const { titulo, areaTematica, descricao, momentoOcorre, problemaPesquisa, metodologia, resultadosEsperados, imagem, professorCoordenadorId, materiaId } = req.body;
    const projeto = await prisma.projetoPesquisa.create({
      data: {
        titulo,
        areaTematica,
        descricao,
        momentoOcorre: new Date(momentoOcorre),
        problemaPesquisa,
        metodologia,
        resultadosEsperados,
        imagem,
        professorCoordenadorId,
        materias: materiaId ? {
          create: {
            materiaId,
          }
        } : undefined,
      },
    });
    res.status(201).json(projeto);
  } catch (error) {
    console.error("Error creating research project:", error);
    res.status(500).json({ error: "Failed to create research project" });
  }
});

// Projeto Extensão endpoints
app.get("/api/projetos-extensao", async (_req, res) => {
  try {
    const projetos = await prisma.projetoExtensao.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch extension projects" });
  }
});

app.post("/api/projetos-extensao", async (req, res) => {
  try {
    const { titulo, areaTematica, descricao, momentoOcorre, tipoPessoasProcuram, comunidadeEnvolvida, imagem, professorCoordenadorId, materiaId } = req.body;
    const projeto = await prisma.projetoExtensao.create({
      data: {
        titulo,
        areaTematica,
        descricao,
        momentoOcorre: new Date(momentoOcorre),
        tipoPessoasProcuram,
        comunidadeEnvolvida,
        imagem,
        professorCoordenadorId,
        materias: materiaId ? {
          create: {
            materiaId,
          }
        } : undefined,
      },
    });
    res.status(201).json(projeto);
  } catch (error) {
    console.error("Error creating extension project:", error);
    res.status(500).json({ error: "Failed to create extension project" });
  }
});

// Materia endpoints
app.get("/api/materias", async (_req, res) => {
  try {
    const materias = await prisma.materia.findMany();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

app.post("/api/materias", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const materia = await prisma.materia.create({
      data: { nome, descricao },
    });
    res.status(201).json(materia);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subject" });
  }
});

const port = parseInt(process.env.PORT || "3000", 10);

app.listen(port, () => {
  console.log(`🚀 API Server running on port ${port}`);
  console.log(`📱 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
