import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`💈 Barbershop Backend Server running at http://localhost:${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});

