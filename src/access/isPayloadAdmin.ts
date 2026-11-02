import type { Access } from 'payload'

export const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'
