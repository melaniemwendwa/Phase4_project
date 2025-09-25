import Footer from "../components/Footer"
import AboutUs from "./sections/AboutUs"

export default function LearnMore() {
  return (
    <main style={{background:'var(--bg)', minHeight:'100vh'}}>
      <section style={{padding:'2rem 0'}}>
        <AboutUs />
      </section>
      <Footer />
    </main>
  )
}
