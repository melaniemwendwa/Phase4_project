import Footer from "../components/Footer"
import AboutUs from "./sections/AboutUs"
import Hero from "./sections/Hero"


export default function LandingPage() {
    return (
        <main className="relative">
            <section>
                <Hero />
            </section>
            <section>
                <AboutUs />
            </section>
            <Footer />
        </main>
    )
}