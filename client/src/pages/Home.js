import Footer from "../components/Footer"
import AboutUs from "./sections/AboutUs"
import Hero from "./sections/Hero"
import FeaturedGroups from "../components/FeaturedGroups"
import NewsletterSignup from "../components/NewsletterSignup"


export default function LandingPage() {
    return (
        <main style={{background:'var(--bg)', minHeight:'100vh'}}>
            <section>
                <Hero />
            </section>
            <section style={{padding:'2rem 0'}}>
                <FeaturedGroups />
            </section>
            <section style={{padding:'2rem 0'}}>
                <AboutUs />
            </section>
            <section style={{padding:'2rem 0'}}>
                <NewsletterSignup />
            </section>
            <Footer />
        </main>
    )
}