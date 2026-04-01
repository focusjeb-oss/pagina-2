import Stripe from 'stripe'
import type { Handler, HandlerEvent } from '@netlify/functions'

// Línea 4: secret key solo en servidor — nunca en el frontend
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const handler: Handler = async (event: HandlerEvent) => {
  // Línea 10: solo aceptamos POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    // Línea 15: parseamos el body enviado desde el frontend
    const { amount, orderDetails } = JSON.parse(event.body || '{}')

    // Línea 18: validación básica — amount en céntimos, mínimo 50€
    if (!amount || typeof amount !== 'number' || amount < 5000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Importe inválido' }),
      }
    }

    // Línea 26: creamos el PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,                    // en céntimos: 285000 = 2850€
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        // Línea 32: guardamos los detalles del encargo en Stripe
        // para tenerlos en el dashboard aunque el email falle
        formato: orderDetails.formato || '',
        obras: orderDetails.obras || '',
        cliente_email: orderDetails.email || '',
        cliente_nombre: orderDetails.nombre || '',
      },
    })

    // Línea 41: devolvemos solo el client_secret — nunca el payment_intent completo
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    }
  } catch (error) {
    console.error('Stripe error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear el pago' }),
    }
  }
}