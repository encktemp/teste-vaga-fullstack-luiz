import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCvGQSw8bQxvgo-yVsOTkA35VnsZTclAEQ',
  authDomain: 'teste-vaga-fullstack-luiz.firebaseapp.com',
  projectId: 'teste-vaga-fullstack-luiz',
  storageBucket: 'teste-vaga-fullstack-luiz.firebasestorage.app',
  messagingSenderId: '819289792504',
  appId: '1:819289792504:web:e0773923c21df2d97f800d'
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)

// Exporta os serviços que você vai usar na aplicação
export const auth = getAuth(app)
export const db = getFirestore(app)
