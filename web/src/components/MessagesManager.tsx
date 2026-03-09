import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { ptBR } from '@mui/x-date-pickers/locales'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import { addDoc, collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore'
import { Calendar, CheckCircle2, History, MessageSquare, Send, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'

import { DatePicker, TimePicker } from '@mui/x-date-pickers'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pt-br'

interface Contact {
  id: string
  name: string
}

interface Message {
  id: string
  content: string
  sentTo: string[]
  status: 'sent' | 'scheduled'
  scheduledAt?: any
  userId: string
}

export default function MessagesManager() {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [scheduleDate, setScheduleDate] = useState<Dayjs | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<'all' | 'sent' | 'scheduled'>('all')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

  useEffect(() => {
    if (!user) return
    const qContacts = query(collection(db, 'contacts'), where('userId', '==', user.uid))
    const unsubContacts = onSnapshot(qContacts, (snap) => {
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Contact))
    })

    const qMsgs = query(collection(db, 'messages'), where('userId', '==', user.uid))
    const unsubMsgs = onSnapshot(qMsgs, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Message))
    })

    return () => {
      unsubContacts()
      unsubMsgs()
    }
  }, [user])

  const handleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSendMessage = async () => {
    if (!content.trim() || !user || selectedContacts.length === 0) return
    await addDoc(collection(db, 'messages'), {
      content,
      userId: user.uid,
      sentTo: selectedContacts,
      status: scheduleDate ? 'scheduled' : 'sent',
      scheduledAt: scheduleDate ? Timestamp.fromDate(scheduleDate.toDate()) : null,
      createdAt: Timestamp.now()
    })
    setContent('')
    setScheduleDate(null)
    setSelectedDate(null)
    setSelectedContacts([])
  }

  const handleFilterChange = (_: any, newFilter: 'all' | 'sent' | 'scheduled') => {
    if (newFilter) setFilter(newFilter)
  }

  const filteredMessages = messages.filter((m) => filter === 'all' || m.status === filter)

  return (
    <Box>
      {/* Título da Seção */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2 rounded-lg">
          <MessageSquare size={22} className="text-blue-600" />
        </div>
        <div>
          <Typography variant="h6" className="font-bold text-slate-800 leading-none">
            Enviar Mensagem
          </Typography>
          <Typography variant="caption" className="text-slate-500">
            Crie campanhas e agende disparos para seus contatos
          </Typography>
        </div>
      </div>

      <Grid container spacing={3} alignItems="stretch">
        {/* COLUNA ESQUERDA */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box className="flex flex-col h-full gap-6">
            {/* Card Conteúdo */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
              <Typography
                variant="subtitle2"
                className="text-slate-600 font-semibold mb-3 flex items-center gap-2"
              >
                <span className="bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
                Conteúdo da Mensagem
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Olá! Como posso ajudar você hoje?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8fafc',
                    borderRadius: '14px',
                    '& fieldset': { borderColor: '#e2e8f0' }
                  }
                }}
              />
            </div>

            {/* Card Programar + CTA */}
            <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              <Typography
                variant="subtitle2"
                className="text-blue-800 font-bold flex items-center gap-2"
              >
                <Calendar size={16} />
                Programar Envio
              </Typography>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
                localeText={ptBR.components?.MuiLocalizationProvider?.defaultProps?.localeText}
              >
                <DatePicker
                  label="Data de Agendamento"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
                <TimePicker
                  label="Horário de Agendamento"
                  value={scheduleDate}
                  onChange={(newValue) => setScheduleDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </LocalizationProvider>

              {content.length > 0 && selectedContacts.length > 0 && (
                <Typography
                  variant="caption"
                  className="text-green-600 font-medium flex items-center gap-1"
                >
                  <CheckCircle2 size={14} /> Pronto para enviar
                </Typography>
              )}

              <Button
                variant="contained"
                size="large"
                disableElevation
                startIcon={scheduleDate ? <Calendar size={20} /> : <Send size={20} />}
                onClick={handleSendMessage}
                disabled={!content.trim() || selectedContacts.length === 0}
                className={`w-full py-3 rounded-xl normal-case font-bold transition-all ${
                  scheduleDate ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {scheduleDate ? 'Confirmar Agendamento' : 'Enviar Mensagem'}
              </Button>
            </div>
          </Box>
        </Grid>

        {/* COLUNA DIREITA */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Box className="h-full">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <Typography
                  variant="subtitle2"
                  className="font-bold text-slate-700 flex items-center gap-2"
                >
                  <Users size={16} className="text-blue-500" />
                  Destinatários
                </Typography>

                <Chip
                  label={`${selectedContacts.length} selecionados`}
                  size="small"
                  color={selectedContacts.length > 0 ? 'primary' : 'default'}
                  variant={selectedContacts.length > 0 ? 'filled' : 'outlined'}
                  sx={{ fontSize: '10px', fontWeight: 'bold' }}
                />
              </div>

              <Divider className="mb-3" />

              <Box className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
                <FormGroup>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <FormControlLabel
                        key={contact.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleSelectContact(contact.id)}
                          />
                        }
                        label={
                          <Typography className="text-sm text-slate-600">{contact.name}</Typography>
                        }
                        className="hover:bg-slate-50 rounded-md m-0 w-full"
                      />
                    ))
                  ) : (
                    <Typography
                      variant="caption"
                      className="text-slate-400 italic py-4 text-center"
                    >
                      Nenhum contato cadastrado.
                    </Typography>
                  )}
                </FormGroup>
              </Box>
            </div>
          </Box>
        </Grid>
      </Grid>

      {/* Seção de Histórico */}
      <Box className="mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-lg">
              <History size={20} className="text-slate-600" />
            </div>
            <Typography variant="h6" className="font-bold text-slate-800">
              Histórico de Atividades
            </Typography>
          </div>

          <Box sx={{ overflowX: 'auto', flexWrap: 'nowrap', display: 'block' }}>
            <ToggleButtonGroup
              size="small"
              value={filter}
              exclusive
              onChange={handleFilterChange}
              sx={{
                bgcolor: '#f1f5f9',
                p: 0.5,
                borderRadius: '10px',
                display: 'flex',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '8px !important',
                  px: 3,
                  fontWeight: '600',
                  color: '#64748b',
                  '&.Mui-selected': {
                    bgcolor: 'white',
                    color: '#2563eb',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }
                }
              }}
            >
              <ToggleButton value="all">Todas</ToggleButton>
              <ToggleButton value="sent">Enviadas</ToggleButton>
              <ToggleButton value="scheduled">Agendadas</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </div>

        <Grid container spacing={2}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <Grid size={{ xs: 12, md: 6 }} key={msg.id}>
                <Paper
                  elevation={0}
                  className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-grow">
                      <Typography className="text-slate-700 font-medium line-clamp-2 mb-2 group-hover:text-blue-900">
                        {msg.content}
                      </Typography>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="caption"
                          className="text-slate-400 flex items-center gap-1"
                        >
                          <Users size={12} /> {msg.sentTo.length} contatos
                        </Typography>
                        {msg.scheduledAt && (
                          <Typography variant="caption" className="text-amber-600 font-medium">
                            • Agenda: {new Date(msg.scheduledAt.toDate()).toLocaleDateString()}
                          </Typography>
                        )}
                      </div>
                    </div>
                    <Chip
                      label={msg.status === 'scheduled' ? 'Agendado' : 'Concluído'}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '10px',
                        bgcolor: msg.status === 'scheduled' ? '#fffbeb' : '#f0fdf4',
                        color: msg.status === 'scheduled' ? '#b45309' : '#166534',
                        border: '1px solid currentColor',
                        opacity: 0.8
                      }}
                    />
                  </div>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Box className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <Typography className="text-slate-400">
                  Nenhuma mensagem encontrada neste filtro.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  )
}
