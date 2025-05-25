// mocks/handlers.ts
import { rest } from 'msw/node'
export const handlers = [
  rest.post('/api/login', (req: { body: { role: any } }, res: (arg0: any) => any, ctx: { json: (arg0: { token: string }) => any }) => {
    const { role } = req.body
    return res(
      ctx.json({ token: role === 'doctor' ? 'DOCTOR_TOKEN' : 'PATIENT_TOKEN' })
    )
  })
]
