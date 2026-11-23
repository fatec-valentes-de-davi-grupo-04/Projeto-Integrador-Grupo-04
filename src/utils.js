// ---------- Tema (modo escuro) ----------
export function getStoredTheme() {
  try {
    return localStorage.getItem('theme') === 'dark'
  } catch {
    return false
  }
}

export function applyTheme(dark) {
  document.body.classList.toggle('dark-theme', dark)
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* sem armazenamento: ignora */
  }
}

// ---------- Formatação ----------
export const matricula = (id) => `#VD-${String(1000 + id)}`

export function idade(dataNasc) {
  const n = new Date(dataNasc + 'T00:00:00')
  const hoje = new Date()
  let a = hoje.getFullYear() - n.getFullYear()
  if (hoje < new Date(hoje.getFullYear(), n.getMonth(), n.getDate())) a--
  return a
}

export const fmtData = (iso) => new Date(iso).toLocaleDateString('pt-BR')
export const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export const initials = (nome = '') =>
  nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

export function maskCpf(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskPhone(v = '') {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export const whatsappLink = (tel = '') => `https://wa.me/55${tel.replace(/\D/g, '')}`

// ---------- Presença ----------
// O back-end só guarda "presente" (true/false) e uma observação.
// A "Justificada" do protótipo é guardada como falta + observação começando com [JUSTIFICADA].
const TAG = '[JUSTIFICADA]'

export function statusOf(registro) {
  if (registro.presente) return 'presente'
  return (registro.observacao || '').startsWith(TAG) ? 'justificada' : 'falta'
}

export const obsText = (registro) => (registro.observacao || '').replace(TAG, '').trim()

export function encodePresenca(status, obs) {
  const texto = (obs || '').trim()
  return {
    presente: status === 'presente',
    observacao: status === 'justificada' ? `${TAG} ${texto}`.trim() : texto || null,
  }
}

// ---------- Regras do painel ----------
// Alunos com N ou mais faltas consecutivas (justificadas não contam como falta).
export function computeRisk(assistidos, aulas, chamadas, min = 2) {
  const comChamada = aulas
    .filter((a) => chamadas[a.id]?.length)
    .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))

  const out = []
  for (const aluno of assistidos) {
    let faltas = 0
    for (const aula of comChamada) {
      const reg = chamadas[aula.id].find((r) => r.assistido_id === aluno.id)
      if (!reg) continue
      if (statusOf(reg) === 'falta') faltas++
      else break
    }
    if (faltas >= min) out.push({ aluno, faltas })
  }
  return out.sort((a, b) => b.faltas - a.faltas)
}

export function daysToBirthday(iso) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const n = new Date(iso + 'T00:00:00')
  const next = new Date(hoje.getFullYear(), n.getMonth(), n.getDate())
  if (next < hoje) next.setFullYear(hoje.getFullYear() + 1)
  return { dias: Math.round((next - hoje) / 86400000), completa: next.getFullYear() - n.getFullYear() }
}
