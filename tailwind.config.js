import tailwindConfig from '@dpa-id-components/dpa-shared-components/tailwindConfig'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: ['./src/**/*.vue', './node_modules/@dpa-id-components/dpa-shared-components/**/*.js'],
  theme: {
    extend: {
      screens: {
        lg: '1165px' // necessary to align with the breakpoint in dpa-id-auth project.
      }
    }
  }
}
