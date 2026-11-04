import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { assistidosApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { maskCpf, maskPhone } from '../utils.js'

const VAZIO = {
  nome_completo: '',
  data_nascimento: '',
  cpf: '',
  posicao_campo: '',
  nome_responsavel: '',
  telefone_responsavel: '',
}

// Marca visual dos campos do protótipo que ainda não existem no back-end
const Soon = () => <span className="soon">em breve</span>

// Cadastro (/alunos/novo) e edição (/alunos/:id/editar) usam a mesma tela.
export default function AlunoForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const notify = useToast()
  const [form, setForm] = useState(VAZIO)
  const [loading, setLoading] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editando) return
    assistidosApi
      .get(id)
      .then((a) =>
        setForm({
          nome_completo: a.nome_completo,
          data_nascimento: a.data_nascimento,
          cpf: a.cpf || '',
          posicao_campo: a.posicao_campo || '',
          nome_responsavel: a.nome_responsavel,
          telefone_responsavel: a.telefone_responsavel,
        }),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, editando])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nome_completo: form.nome_completo.trim(),
        data_nascimento: form.data_nascimento,
        nome_responsavel: form.nome_responsavel.trim(),
        telefone_responsavel: form.telefone_responsavel.trim(),
      }
      // opcionais: no cadastro omitimos se vazio; na edição mandamos null para limpar
      const cpf = form.cpf.trim()
      const pos = form.posicao_campo.trim()
      if (editando) {
        payload.cpf = cpf || null
        payload.posicao_campo = pos || null
        await assistidosApi.update(id, payload)
      } else {
        if (cpf) payload.cpf = cpf
        if (pos) payload.posicao_campo = pos
        await assistidosApi.create(payload)
      }
      notify(editando ? 'Cadastro atualizado.' : 'Aluno cadastrado com sucesso.')
      navigate('/alunos')
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const voltar = editando ? '/alunos' : '/'

  return (
    <>
      <header className="header">
        <h1>
          <i className="fa-solid fa-address-card" style={{ color: 'var(--verde)' }} />
          {editando ? `Edição de Cadastro${form.nome_completo ? ': ' + form.nome_completo : ''}` : 'Cadastro de Novo Assistido'}
        </h1>
        <Link to={voltar} className="btn-cancel">
          <i className="fa-solid fa-arrow-left" /> {editando ? 'Voltar para Alunos' : 'Voltar'}
        </Link>
      </header>

      {error && <div className="error-box">{error}</div>}
      {loading ? (
        <div className="empty">Carregando…</div>
      ) : (
        <section className="form-container">
          <div className="notice" style={{ marginBottom: 25 }}>
            <i className="fa-solid fa-circle-info" style={{ marginTop: 3 }} />
            <span>
              Os campos marcados com <b>em breve</b> fazem parte do protótipo, mas ainda não existem no
              back-end, por isso não são enviados nem salvos.
            </span>
          </div>

          <form onSubmit={submit}>
            <fieldset>
              <legend><i className="fa-solid fa-child" /> 1. Dados Pessoais do Assistido</legend>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nome_assistido">Nome Completo <span className="required">*</span></label>
                  <input id="nome_assistido" required minLength={3} maxLength={150} placeholder="Digite o nome da criança ou adolescente" value={form.nome_completo} onChange={set('nome_completo')} />
                </div>
                <div className="form-group">
                  <label htmlFor="data_nascimento">Data de Nascimento <span className="required">*</span></label>
                  <input id="data_nascimento" type="date" required value={form.data_nascimento} onChange={set('data_nascimento')} />
                </div>
                <div className="form-group">
                  <label htmlFor="posicao">Posição em Campo</label>
                  <input id="posicao" maxLength={50} placeholder="Ex: Atacante, Zagueiro" value={form.posicao_campo} onChange={set('posicao_campo')} />
                </div>
                <div className="form-group">
                  <label htmlFor="genero">Gênero <Soon /></label>
                  <select id="genero" disabled><option>Selecione...</option></select>
                </div>
                <div className="form-group">
                  <label htmlFor="rg_assistido">RG (se houver) <Soon /></label>
                  <input id="rg_assistido" disabled placeholder="00.000.000-0" />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf_assistido">CPF (se houver)</label>
                  <input id="cpf_assistido" maxLength={14} placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend><i className="fa-solid fa-user-tie" /> 2. Dados do Responsável Legal</legend>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nome_responsavel">Nome Completo do Responsável <span className="required">*</span></label>
                  <input id="nome_responsavel" required minLength={3} maxLength={150} placeholder="Digite o nome do pai, mãe ou tutor" value={form.nome_responsavel} onChange={set('nome_responsavel')} />
                </div>
                <div className="form-group">
                  <label htmlFor="parentesco">Grau de Parentesco <Soon /></label>
                  <select id="parentesco" disabled><option>Selecione...</option></select>
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Telefone de Contato (WhatsApp) <span className="required">*</span></label>
                  <input id="telefone" type="tel" required minLength={8} maxLength={20} placeholder="(16) 90000-0000" value={form.telefone_responsavel} onChange={(e) => setForm({ ...form, telefone_responsavel: maskPhone(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf_responsavel">CPF do Responsável <Soon /></label>
                  <input id="cpf_responsavel" disabled placeholder="000.000.000-00" />
                </div>
                <div className="form-group">
                  <label htmlFor="rg_responsavel">RG do Responsável <Soon /></label>
                  <input id="rg_responsavel" disabled placeholder="00.000.000-0" />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="endereco">Endereço Completo <Soon /></label>
                  <input id="endereco" disabled placeholder="Rua, Número, Bairro, CEP" />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend><i className="fa-solid fa-notes-medical" /> 3. Informações Médicas</legend>
              <div className="form-group full-width">
                <label htmlFor="info_medicas">Doenças, alergias crônicas ou observações importantes <Soon /></label>
                <textarea id="info_medicas" rows={3} disabled placeholder="Ex: Alergia a picada de abelha, asma..." />
              </div>
            </fieldset>

            <fieldset>
              <legend><i className="fa-solid fa-file-arrow-up" /> 4. Anexos e Documentações</legend>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="doc_assistido">Certidão de Nascimento / RG <Soon /></label>
                  <input id="doc_assistido" type="file" disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="doc_responsavel">RG/CPF do Responsável <Soon /></label>
                  <input id="doc_responsavel" type="file" disabled />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="termo">Termo de Responsabilidade Assinado <Soon /></label>
                  <input id="termo" type="file" disabled />
                </div>
              </div>
            </fieldset>

            <div className="form-actions">
              <Link to={voltar} className="btn-cancel"><i className="fa-solid fa-xmark" /> Cancelar</Link>
              <button type="submit" className="btn-submit" disabled={saving}>
                <i className={`fa-solid ${editando ? 'fa-floppy-disk' : 'fa-check'}`} />
                {saving ? 'Salvando…' : editando ? 'Salvar Alterações' : 'Finalizar Cadastro'}
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  )
}
