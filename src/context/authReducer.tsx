import {Usuario} from '../interfaces/appInterfaces'

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated'
  errorMessage: string | null
  token: string | null
  user: Usuario | null
}

type AuthAction =
  | {type: 'signUp'; payload: {token: string; user: Usuario}}
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'notAuthenticated'}
  | {type: 'logout'}

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'addError':
      return {
        ...state,
        user: null,
        token: null,
        status: 'not-authenticated',
        errorMessage: action.payload,
      }
    case 'removeError':
      return {
        ...state,
        errorMessage: null,
      }
    case 'signUp':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        errorMessage: null,
      }
    case 'logout': // hace el mismo codigo que el action 'notAuthenticated'
    case 'notAuthenticated':
      return {
        ...state,
        user: null,
        token: null,
        status: 'not-authenticated',
        errorMessage: null,
      }

    default:
      return state
  }
}
