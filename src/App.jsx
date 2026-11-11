import { useEffect, useRef, useState } from 'react'
import { CARDS, GROUPS, HERO_CARDS, STEPS, FAQ, PO_END } from './data'

const money = (n) => 'Rp' + n.toLocaleString('id-ID')
const USERS_KEY = 'gc_users'
const SESSION_KEY = 'gc_session'
const GROUP_TONES = { NOVA7: 'aurora', 'LUNAR GIRLS': 'dusk', 'STELLA-9': 'mist' }
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

/* ---------- Ticker biru muda (berjalan terus) ---------- */
function Ticker() {
  const items = ['REALPICT', '100% OFFICIAL', 'OPEN PO BATCH 04', 'INCLUDE GARANSI']
  const row = [...items, ...items].map((t, i) => <span key={i}>✦ {t}</span>)
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">{row}{row}</div>
    </div>
  )
}

function CardArtwork({ card }) {
  return (
    <>
      <small className="card-no">GO CLOSERZ / {card.no}</small>
      <span className="card-star">✦</span>
      <b>{card.name}</b><small className="card-group">{card.group}</small>
    </>
  )
}

/* ---------- Kartu 3D yang bisa di-flip ---------- */
function FlipCard({ card, style }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button className={'flip tone-' + card.tone + (flipped ? ' is-flipped' : '')} style={style}
      onClick={() => setFlipped((f) => !f)} aria-label={`Balik kartu ${card.name}`}>
      <span className="flip-inner">
        <span className={`face front collector-card tone-${card.tone}`}>
          <CardArtwork card={card} />
        </span>
        <span className={`face back collector-card tone-${card.tone}`}>
          <CardArtwork card={card} />
        </span>
      </span>
    </button>
  )
}

/* ---------- Angka countdown flip clock ---------- */
function Digit({ value }) {
  const [state, setState] = useState({ value, next: value, flipping: false })

  useEffect(() => {
    setState((s) => {
      if (s.flipping || s.value === value) return s
      return { value: s.value, next: value, flipping: true }
    })
  }, [value])

  const text = (v) => String(v).padStart(2, '0')
  const finishFlip = (event) => {
    if (event.target !== event.currentTarget) return
    setState((s) => s.flipping ? { value: s.next, next: s.next, flipping: false } : s)
  }
  const top = state.flipping ? state.next : state.value

  return (
    <span className={'flip-digit' + (state.flipping ? ' is-flipping' : '')}>
      <span className="flip-half top static"><span>{text(top)}</span></span>
      <span className="flip-half bottom static"><span>{text(state.value)}</span></span>
      {state.flipping && (
        <>
          <span className="flip-half top outgoing"><span>{text(state.value)}</span></span>
          <span className="flip-half bottom incoming" onAnimationEnd={finishFlip}><span>{text(state.next)}</span></span>
        </>
      )}
    </span>
  )
}

function Countdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  let s = Math.max(0, Math.floor((PO_END - now) / 1000))
  const parts = [['hari', Math.floor(s / 86400)], ['jam', Math.floor((s % 86400) / 3600)], ['menit', Math.floor((s % 3600) / 60)], ['detik', s % 60]]
  return (
    <div className="countdown" role="timer" aria-label="Sisa waktu PO">
      {parts.map(([label, v]) => (
        <div className="unit" key={label}><Digit value={v} /><small>{label}</small></div>
      ))}
    </div>
  )
}

/* ---------- Kartu katalog dengan motion saat cursor mengarah ---------- */
function CatalogCard({ card, onAdd }) {
  const ref = useRef(null)
  const [qty, setQty] = useState(1)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    const el = ref.current.style
    el.setProperty('--ry', `${(px - 0.5) * 18}deg`)
    el.setProperty('--rx', `${(0.5 - py) * 18}deg`)
    el.setProperty('--mx', `${px * 100}%`)
    el.setProperty('--my', `${py * 100}%`)
  }
  const leave = () => { const el = ref.current.style; el.setProperty('--rx', '0deg'); el.setProperty('--ry', '0deg') }
  const soldOut = card.stock === 0
  return (
    <article className="pcard" ref={ref} onMouseMove={move} onMouseLeave={leave}>
      <div className={`art collector-card tone-${GROUP_TONES[card.group]}`}>
        <div className="shine" />
        <small className="card-no">GO CLOSERZ / {String(card.id).padStart(2, '0')}</small>
        <span className="card-star">✦</span>
        <b>{card.name}</b><small className="card-group">{card.group}</small>
      </div>
      <h3>{card.name} · {card.group}</h3>
      <p className="meta"><span>{card.type}</span><span className="stock">{soldOut ? 'Habis' : `Sisa ${card.stock} slot`}</span></p>
      <div className="row">
        <strong>{money(card.price)}</strong>
        <span className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={soldOut || qty <= 1} aria-label="Kurangi">−</button>
          {qty}
          <button onClick={() => setQty((q) => Math.min(card.stock || 1, q + 1))} disabled={soldOut || qty >= (card.stock || 1)} aria-label="Tambah">+</button>
        </span>
      </div>
      <button className="add" disabled={soldOut} onClick={() => onAdd(card, qty)}>
        {soldOut ? 'Slot habis' : 'Tambah ke keranjang'}
      </button>
    </article>
  )
}

/* ---------- Halaman ---------- */
const NAV = [['beranda', 'Beranda'], ['katalog', 'Katalog'], ['cara-order', 'Cara order'], ['faq', 'FAQ']]
const jump = (id) => id === 'beranda' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

function Home({ onAdd }) {
  const [open, setOpen] = useState(0)
  return (
    <>
      <section className="hero" id="beranda">
        <div className="hero-text">
          <h1>GO Closerz<br /><span>Photocard</span></h1>
          <p>PO batch 04 ditutup dalam:</p>
          <Countdown />
          <div className="cta">
            <button className="btn primary" onClick={() => jump('katalog')}>Pilih photocard</button>
            <a className="btn ghost" href="#cara-order">Cara order</a>
          </div>
        </div>
        <div className="hero-cards" aria-label="Klik kartu untuk membaliknya">
          {HERO_CARDS.map((c) => (
            <FlipCard key={c.name} card={c} style={{ '--rot': `${c.rot}deg`, '--x': `${c.x}px`, '--y': `${c.y}px`, zIndex: c.rot === 0 ? 2 : 1 }} />
          ))}
          <p className="hint">↻ Klik kartu untuk melihat sisi lainnya</p>
        </div>
      </section>

      <div className="stage">
      <Katalog onAdd={onAdd} />

      <section className="block" id="cara-order">
        <h2>Cara order</h2>
        <p className="sub">Empat langkah dari memilih kartu sampai paket tiba.</p>
        <div className="steps">
          {STEPS.map(([t, d], i) => (
            <div className="step" key={t}><span className="n">{i + 1}</span><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section className="block" id="faq">
        <h2>FAQ</h2>
        <p className="sub">Pertanyaan yang paling sering masuk.</p>
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <div className={'qa' + (open === i ? ' open' : '')} key={q}>
              <button onClick={() => setOpen(open === i ? -1 : i)}>{q}</button>
              {open === i && <p>{a}</p>}
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  )
}

function Katalog({ onAdd }) {
  const [group, setGroup] = useState('Semua')
  const list = group === 'Semua' ? CARDS : CARDS.filter((c) => c.group === group)
  return (
    <section className="block" id="katalog">
      <h2>Katalog PO</h2>
      <p className="sub">Arahkan cursor ke kartu, lalu pilih jumlahnya.</p>
      <div className="chips">
        {GROUPS.map((g) => (
          <button key={g} className={g === group ? 'on' : ''} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="grid">{list.map((c) => <CatalogCard key={c.id} card={c} onAdd={onAdd} />)}</div>
    </section>
  )
}

/* ---------- Login ---------- */
const Icon = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [notice, setNotice] = useState('')
  const isLogin = mode === 'login'
  const switchTo = (m) => { setMode(m); setErr(''); setNotice('') }
  const submit = (e) => {
    e.preventDefault()
    setErr('')
    setNotice('')
    const users = read(USERS_KEY, {})
    const em = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(em)) return setErr('Format email belum benar.')
    if (pass.length < 6) return setErr('Kata sandi minimal 6 karakter.')
    if (mode === 'signup') {
      if (users[em]) return setErr('Email ini sudah terdaftar. Silakan masuk.')
      users[em] = pass
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      setEmail(em)
      setPass('')
      setMode('login')
      setNotice('Akun berhasil dibuat. Silakan masuk dengan akunmu.')
      return
    } else if (users[em] !== pass) {
      return setErr('Email atau kata sandi salah.')
    }
    onLogin(em)
  }
  return (
    <main className="login">
      <div className="login-wrap">
          <section className="login-screen" aria-label="Masuk ke GO Closerz">
            <header className="login-bar"><b className="logo">G✦Closerz</b><span>Your collection starts here.</span></header>
            <div className="login-grid">
              <div className="login-card">
                <h2 className="card-title">{isLogin ? 'Welcome back, Closer.' : 'Join the Closerz.'}</h2>
                <p className="card-sub">{isLogin ? 'Masuk untuk menjelajahi dunia photocard-mu.' : 'Buat akun untuk mulai mengoleksi.'}</p>
                <form onSubmit={submit} noValidate>
                  <label>Email
                    <input type="email" value={email} placeholder="nama@email.com" onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </label>
                  <label>Kata sandi
                    <span className="pw">
                      <input type={show ? 'text' : 'password'} value={pass} placeholder="Masukkan kata sandi" onChange={(e) => setPass(e.target.value)} autoComplete={isLogin ? 'current-password' : 'new-password'} />
                      <button type="button" className="eye" onClick={() => setShow((v) => !v)} aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                        <Icon>{show
                          ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 004.2 4.2" /><path d="M6.3 6.3C3.9 8 2.5 12 2.5 12s3.5 7 9.5 7a9.7 9.7 0 004-.9M9.9 5.1A10 10 0 0112 5c6 0 9.5 7 9.5 7a16 16 0 01-2.2 3.2" /></>
                          : <><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>}</Icon>
                      </button>
                    </span>
                  </label>
                  {err && <p className="err" role="alert">{err}</p>}
                  {notice && <p className="success" role="status">{notice}</p>}
                  <button className="btn primary wide">{isLogin ? 'Masuk & mulai koleksi' : 'Daftar & mulai koleksi'}<Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon></button>
                </form>
                <p className="swap">{isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} <button className="link" onClick={() => switchTo(isLogin ? 'signup' : 'login')}>{isLogin ? 'Daftar di sini' : 'Masuk di sini'}</button></p>
                <p className="login-note"><Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></Icon>Akses beranda dan katalog menggunakan akunmu.</p>
              </div>
            </div>
            <a className="intro-scroll" href="#login-intro">Scroll untuk melihat pengenalan kartu <span>↓</span></a>
          </section>

          <section className="login-hero" id="login-intro" aria-label="Pengenalan koleksi photocard">
            <h1 className="login-title">A little closer.<span>A lot more you.</span></h1>
            <p className="login-lead">Satu tempat untuk bias dan kartu favoritmu. Masuk dulu, lalu temukan koleksi yang paling kamu.</p>
            <div className="login-cards" aria-label="Photocard pilihan">
              <i className="twinkle t1">✦</i><i className="twinkle t2">✦</i><i className="twinkle t3">✦</i>
              {HERO_CARDS.map((c, i) => (
                <div key={c.name} className={`lc lc${i} collector-card tone-${c.tone}`}>
                  <CardArtwork card={c} />
                </div>
              ))}
            </div>
          </section>
        </div>
    </main>
  )
}

/* ---------- App ---------- */
export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem(SESSION_KEY))
  const [active, setActive] = useState('beranda')
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)

  const login = (em) => { localStorage.setItem(SESSION_KEY, em); setUser(em) }
  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null); setCart({}) }
  const add = (card, qty) => setCart((c) => ({ ...c, [card.id]: Math.min(card.stock, (c[card.id] || 0) + qty) }))

  useEffect(() => {
    if (!user) return
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [user])

  if (!user) return <Login onLogin={login} />

  const items = CARDS.filter((c) => cart[c.id])
  const count = items.reduce((n, c) => n + cart[c.id], 0)
  const total = items.reduce((n, c) => n + cart[c.id] * c.price, 0)

  return (
    <>
      <header className="top">
        <Ticker />
        <nav className="nav">
          <b className="logo">G✦Closerz</b>
          <div className="links">
            {NAV.map(([id, label]) => (
              <button key={id} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined} onClick={() => jump(id)}>{label}</button>
            ))}
          </div>
          <div className="right">
            <button className="pill" onClick={() => setCartOpen((o) => !o)}>Keranjang · {count}</button>
            <button className="pill" onClick={logout} title={user}>Keluar</button>
          </div>
          {cartOpen && (
            <div className="cart">
              {items.length === 0 ? <p>Keranjang masih kosong. Pilih kartu di katalog.</p> : (
                <>
                  {items.map((c) => <p key={c.id}><span>{c.name} × {cart[c.id]}</span><span>{money(c.price * cart[c.id])}</span></p>)}
                  <p className="total"><span>Total</span><span>{money(total)}</span></p>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
      <main><Home onAdd={add} /></main>
      <footer><b className="logo">G✦Closerz</b><span>© 2026 GO Closerz · A little closer to your bias.</span></footer>
    </>
  )
}
