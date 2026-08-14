const fs = require('fs');
const files = [
  'src/lib/auth.ts',
  'src/app/center/[id]/page.tsx',
  'src/app/api/user/route.ts',
  'src/app/api/provider/dashboard/route.ts',
  'src/app/api/centers/[id]/route.ts',
  'src/app/api/centers/route.ts',
  'src/app/api/bookings/route.ts',
  'src/app/api/admin/dashboard/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/bookings/[id]/route.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import \{ PrismaClient \} from "@prisma\/client"\r?\n/g, '');
    content = content.replace(/const prisma = new PrismaClient\(\)\r?\n/g, 'import prisma from "@/lib/prisma"\n');
    fs.writeFileSync(f, content);
  }
});
console.log('Replaced 2');
