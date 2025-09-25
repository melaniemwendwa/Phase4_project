import Footer from "../components/Footer"
import AboutUs from "./sections/AboutUs"

export default function LearnMore() {
  return (
    <main style={{background:'var(--bg)', minHeight:'100vh'}}>
      {/* Hero header */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(123,155,140,0.18), rgba(168,197,182,0.12))',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{maxWidth: 1100, margin: '0 auto', padding: '5rem 1rem 3rem', textAlign: 'center'}}>
          <h1 style={{margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text)'}}>Learn More</h1>
          <p style={{margin: '10px auto 0', color:'#6B7280', maxWidth: 720}}>
            Discover what Open Circle offers, how it works, and hear from real community members.
          </p>
        </div>
      </header>

      {/* Main content */}
      <section style={{padding:'2.2rem 0'}}>
        <AboutUs />
      </section>
      <Footer />
    </main>
  )
}
