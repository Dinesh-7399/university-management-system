import app from './app';
import 'dotenv/config'; // Make sure environment variables are loaded

const PORT = process.env.PORT || 4000; // Use port from .env or default to 4000

app.listen(PORT, () => {
    console.log(`íº€ Server is listening on http://localhost:${PORT}`);
});
