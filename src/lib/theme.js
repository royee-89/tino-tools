import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#0020B0',
      bg: '#F9FAFB',
      text: '#1F2937',
      gray: {
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
      }
    }
  },
  fonts: {
    heading: 'var(--font-roboto)',
    body: 'var(--font-roboto)',
  },
  styles: {
    global: {
      body: {
        bg: 'brand.bg',
        color: 'brand.text'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.primary',
            opacity: 0.9,
          }
        },
        outline: {
          borderColor: 'brand.primary',
          color: 'brand.primary',
        }
      }
    }
  }
})

export default theme 