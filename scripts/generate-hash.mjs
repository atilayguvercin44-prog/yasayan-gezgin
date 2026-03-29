/**
 * Admin şifresi için bcrypt hash üretir.
 * Kullanım: node scripts/generate-hash.mjs "YzG!2026#Atlas^V3rcel_Admin"
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.error('Hata: Şifre argümanı eksik.')
  console.error('Kullanım: node scripts/generate-hash.mjs "şifreniz"')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)

console.log('\n✅ Hash başarıyla üretildi!\n')
console.log('.env dosyanıza şunu ekleyin:')
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
console.log('\n⚠️  Bu hash\'i güvenli bir yerde saklayın.')
