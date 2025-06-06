import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
  ],
});

// To see raw SQL queries (very useful for debugging!), uncomment this block
/*
const prisma = global.prisma || new PrismaClient({
  log: [ 'query', 'info', 'warn', 'error' ],
});
*/

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
