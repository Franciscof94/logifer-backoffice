import { createTamagui } from 'tamagui'

const config = createTamagui({
  defaultTheme: 'light',
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
    }
  }
})

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config