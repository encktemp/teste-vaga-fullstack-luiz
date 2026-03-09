import { Box, IconButton, List, ListItem, ListItemText, TextField, Typography } from '@mui/material'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { Pencil, Plus, Trash2, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

// Definindo o tipo para uma conexão
interface Connection {
  id: string
  name: string
}

export default function ConnectionsList() {
  const { user } = useAuth()
  const [connections, setConnections] = useState<Connection[]>([])
  const [newConnectionName, setNewConnectionName] = useState('')

  // Efeito para buscar as conexões em tempo real
  useEffect(() => {
    if (!user) return // Se não houver usuário, não faz nada

    // Cria uma query para buscar apenas as conexões do usuário logado
    const q = query(collection(db, 'connections'), where('userId', '==', user.uid))

    // onSnapshot ouve as mudanças em tempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const connectionsData: Connection[] = querySnapshot.docs.map((doc) => {
        const data = doc.data()

        return {
          id: doc.id,
          name: data.name
        } as Connection
      })
      setConnections(connectionsData)
    })

    // Limpa o listener quando o componente é desmontado ou quando o usuário muda
    return () => unsubscribe()
  }, [user]) // Roda o efeito sempre que o usuário mudar

  // Função para adicionar uma nova conexão
  const handleAddConnection = async () => {
    if (newConnectionName.trim() === '' || !user) return

    try {
      await addDoc(collection(db, 'connections'), {
        name: newConnectionName,
        userId: user.uid // Associa a conexão ao usuário logado
      })
      setNewConnectionName('') // Limpa o campo de input
    } catch (error) {
      console.error('Erro ao adicionar conexão: ', error)
    }
  }

  // Função para deletar uma conexão
  const handleDeleteConnection = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'connections', id))
    } catch (error) {
      console.error('Erro ao deletar conexão: ', error)
    }
  }

  // Função para atualizar uma conexão
  const handleUpdateConnection = async (id: string, currentName: string) => {
    const newName = prompt('Digite o novo nome para a conexão:', currentName)
    if (newName && newName.trim() !== '') {
      try {
        await updateDoc(doc(db, 'connections', id), {
          name: newName
        })
      } catch (error) {
        console.error('Erro ao atualizar conexão: ', error)
      }
    }
  }

  return (
    <Box className="flex flex-col gap-4 bg-white">
      <div className="flex items-center gap-2">
        <Wifi size={20} className="text-blue-600" />
        <Typography variant="h6" className="font-bold text-slate-800">
          Minhas Conexões
        </Typography>
      </div>

      <div className="flex items-center gap-2">
        <TextField
          size="small"
          placeholder="Nome da nova conexão..."
          value={newConnectionName}
          onChange={(e) => setNewConnectionName(e.target.value)}
          fullWidth
          sx={{ bgcolor: 'white' }}
        />
        <IconButton
          onClick={handleAddConnection}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
        >
          <Plus size={20} />
        </IconButton>
      </div>

      <List className="max-h-[300px] overflow-y-auto pr-1">
        {connections?.map((conn) => (
          <ListItem
            key={conn.id}
            className="mb-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
            secondaryAction={
              <Box className="flex gap-1">
                <IconButton
                  size="small"
                  onClick={() => handleUpdateConnection(conn.id, conn.name)}
                  color="primary"
                >
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteConnection(conn.id)}
                  color="error"
                >
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={<span className="text-sm font-medium text-slate-700">{conn.name}</span>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
