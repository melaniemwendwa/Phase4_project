import AboutUs from "./sections/AboutUs"
import Footer from "../components/Footer"

export default function Info() {
  return (
    <main style={{background:'var(--bg)', minHeight:'100vh'}}>
      <section style={{padding:'2rem 0'}}>
        <AboutUs />
      </section>
      <Footer />
    </main>
  )
}
