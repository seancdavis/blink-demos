import { defineConfig } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      gray: {
        100: '#eef1f5',
        200: '#eaeced',
        300: '#e4e8ed',
        400: '#c6cfd4',
        500: '#a0b0b8',
        600: '#76858d',
        700: '#4f6068',
        800: '#1b3846',
        900: '#051c28',
      },
      black: '#051c28',
      blue: {
        dark: '#1d4a8f',
        DEFAULT: '#2260bf',
        a50: '#2260bf50',
      },
      'gray-blue': '#4b6a8a',
      green: {
        DEFAULT: '#007785',
        light: '#01a791',
      },
      lime: '#9ce736',
      orange: '#ff6b00',
      pink: '#eea2bf',
      white: '#ffffff',
      yellow: '#ffd445',
    }
  }
})