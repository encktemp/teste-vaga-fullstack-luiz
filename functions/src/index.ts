import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions/v1'

// Inicializa o Firebase Admin SDK para que a função possa interagir
// com outros serviços do Firebase, como o Firestore.
admin.initializeApp()

const db = admin.firestore()

/**
 * Uma função agendada que roda periodicamente para verificar mensagens
 * que estão agendadas e atualiza o status delas para "sent".
 */
export const processScheduledMessages = functions
  // É uma boa prática definir a região para ser a mesma do seu Firestore
  .region('southamerica-east1')
  .pubsub.schedule('every 5 minutes') // Roda a cada 5 minutos.
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()
    functions.logger.info('Verificando mensagens agendadas...', {
      timestamp: now.toDate().toISOString()
    })

    // 1. Busca no Firestore por todas as mensagens com status "scheduled"
    //    e cuja data de agendamento (scheduledAt) já passou.
    const query = db
      .collection('messages')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now)

    const snapshot = await query.get()

    if (snapshot.empty) {
      functions.logger.info('Nenhuma mensagem agendada para processar.')
      return null
    }

    // 2. Para cada mensagem encontrada, atualiza o status para "sent".
    //    Usamos um "batch" para fazer todas as atualizações de uma vez só.
    const batch = db.batch()
    snapshot.forEach((doc) => {
      functions.logger.info(`Processando mensagem com ID: ${doc.id}`)
      batch.update(doc.ref, { status: 'sent' })
    })

    // 3. Envia todas as atualizações para o banco de dados.
    await batch.commit()

    functions.logger.info(`Processamento concluído. ${snapshot.size} mensagens atualizadas.`)
    return null
  })
