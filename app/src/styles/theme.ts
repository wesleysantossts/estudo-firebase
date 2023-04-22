export interface ThemeInterface {
  header: ThemePropertie
  body: ThemePropertie
  button: ThemePropertie
}

export type ThemePropertie = {
  background?: ThemePropertieType
  text?: ThemePropertieType
}

export type ThemePropertieType = {
  primary: string
  secondary: string
}

const Theme = {
  header: {
    background: {
      primary: 'black',
      secondary: ''
    },
    text: {
      primary: 'white',
      secondary: ''
    }
  },
  body: {
    background: {
      primary: '#ffffff',
      secondary: '#ffffff'
    }
  },
  button: {
    background: {
      primary: '#c6a04d',
      secondary: ''
    },
    text: {
      primary: '#fff',
      secondary: ''
    }
  }
} as ThemeInterface

export default Theme
