import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
<<<<<<< Updated upstream
export default defineConfig({
  plugins: [react()],
  base: '/',
  test: { environment: 'node' },
});
=======
export default defineConfig({ plugins: [react()], base: '/', test: { environment: 'node' } });
>>>>>>> Stashed changes
