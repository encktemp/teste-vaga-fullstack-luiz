import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { Pencil, Phone, Trash, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

interface Contact {
  id: string
  name: string
  phone: string
  formattedPhone?: string
}

export default function ContactsList() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContactName, setNewContactName] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('')

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'contacts'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data
        } as Contact
      })
      setContacts(contactsData)
    })
    return () => unsubscribe()
  }, [user])

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim() || !user) return
    await addDoc(collection(db, 'contacts'), {
      name: newContactName,
      phone: formattedPhoneNumber,
      userId: user.uid
    })
    setNewContactName('')
    setNewContactPhone('')
    setFormattedPhoneNumber('')
  }

  const formatPhoneNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '')

    if (numericValue.length > 11) {
      return numericValue.slice(0, 11)
    }

    let formattedNumber = numericValue
    if (numericValue.length > 2) {
      formattedNumber = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`
    }
    if (numericValue.length > 7) {
      formattedNumber = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7)}`
    }
    return formattedNumber
  }

  return (
    <Box>
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-blue-600" />
        <Typography variant="h6" className="font-bold text-slate-800">
          Meus Contatos
        </Typography>
      </div>

      <Box className="flex flex-col gap-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <TextField
          fullWidth
          size="small"
          label="Nome Completo"
          variant="outlined"
          value={newContactName}
          onChange={(e) => setNewContactName(e.target.value)}
          sx={{ bgcolor: 'white' }}
        />
        <TextField
          fullWidth
          size="small"
          label="Telefone"
          variant="outlined"
          value={newContactPhone}
          onChange={(e) => {
            const formattedNumber = formatPhoneNumber(e.target.value)
            setFormattedPhoneNumber(formattedNumber)
            setNewContactPhone(formattedNumber)
          }}
          sx={{ bgcolor: 'white' }}
        />
        <Button
          variant="contained"
          disableElevation
          startIcon={<UserPlus size={18} />}
          onClick={handleAddContact}
          className="bg-blue-600 hover:bg-blue-700 normal-case font-semibold"
        >
          Adicionar
        </Button>
      </Box>

      <List className="max-h-[400px] overflow-y-auto pr-2">
        {contacts.map((contact) => (
          <ListItem
            key={contact.id}
            className="mb-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
            secondaryAction={
              <Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    /* logic update */
                  }}
                  color="primary"
                >
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => deleteDoc(doc(db, 'contacts', contact.id))}
                  color="error"
                >
                  <Trash size={16} />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={<span className="font-medium text-slate-700">{contact.name}</span>}
              secondary={
                <span className="flex items-center text-xs mt-1">
                  <Phone size={12} className="mr-1 text-slate-400" /> {contact.phone}
                </span>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
