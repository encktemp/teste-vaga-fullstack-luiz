/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 'important' garante que as classes do Tailwind sobrescrevam o MUI quando necessário
  important: '#root',
  theme: {
    extend: {}
  },
  corePlugins: {
    // Desabilita o 'preflight' para evitar conflitos de reset de CSS com o Material UI
    preflight: false
  },
  plugins: []
}
