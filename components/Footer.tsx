import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h4>Apollo Care</h4>
          <p>Book trusted doctors online in minutes. Transparent fees, instant confirmation requests and a full appointment history.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/doctors">Find a doctor</Link>
          <Link href="/about">About us</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link href="/login">Log in</Link>
          <Link href="/register">Create account</Link>
          <Link href="/history">My appointments</Link>
          <Link href="/profile">Profile</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>support@apollocare.example</p>
          <p>Mon – Sat, 9:00 – 18:00</p>
          <Link href="/contact">Send a message</Link>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Apollo Care. For emergencies call your local emergency number.</div>
    </footer>
  )
}
