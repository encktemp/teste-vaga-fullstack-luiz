import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material'
import { signOut } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import logo from '../assets/logo-xyz-blue.webp'
import ConnectionsList from '../components/ConnectionsList'
import ContactsList from '../components/ContactsList'
import MessagesManager from '../components/MessagesManager'
import { auth } from '../firebase'

export default function DashboardPage() {
  const handleLogout = () => {
    signOut(auth)
  }

  return (
    <Box className="bg-slate-100 min-h-screen pb-10">
      {/* Header Profissional */}
      <Box className="bg-white border-b border-slate-200 mb-8 sticky top-0 z-10">
        <Container maxWidth="lg">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="XYZ Logo" className="h-8" />
            </div>
            <Button
              variant="text"
              color="error"
              startIcon={<LogOut size={18} />}
              onClick={handleLogout}
              className="hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box className="mb-8">
          <Typography variant="h4" className="font-bold text-slate-700 mb-1">
            Dashboard
          </Typography>
          <Typography className="text-slate-500">
            Bem-vindo de volta! Gerencie sua comunicação de forma centralizada.
          </Typography>
        </Box>

        <Grid container spacing={4} columns={12}>
          {/* Coluna da Esquerda: Conexões e Contatos */}
          <Grid size={{ xs: 12, md: 4 }}>
            <div className="flex flex-col gap-6 sticky top-20 z-20">
              <Paper
                elevation={0}
                className="p-5 border border-slate-200 rounded-xl sticky top-20 z-20"
              >
                <ConnectionsList />
              </Paper>

              <Paper
                elevation={0}
                className="p-5 border border-slate-200 rounded-xl sticky top-20 z-20"
              >
                <ContactsList />
              </Paper>
            </div>
          </Grid>

          {/* Coluna da Direita: Gerenciador de Mensagens */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} className="p-6 border border-slate-200 rounded-xl bg-white">
              <MessagesManager />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box textAlign="center" mt={4} color="text.secondary">
        Teste Desenvolvedor Full Stack -{' '}
        <a href="https://luizmoeller.lcmsistemas.com.br/" target="_blank" rel="noopener noreferrer">
          <b style={{ color: 'grey' }}>Luiz Möeller</b>
        </a>
      </Box>
    </Box>
  )
}
