import type { TrustUser, PaymentLogo } from '../types';

interface Props {
  trustUsers: TrustUser[];
  paymentLogos: PaymentLogo[];
}

export default function Footer({ trustUsers, paymentLogos }: Props) {
  return (
    <div className="bottom-grid">
      <div className="card footer-card">
        <div className="footer-left">
          <p className="footer-label">We accept</p>
          <div className="payment-logos">
            {paymentLogos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt} height={25} width={40} />
            ))}
          </div>
        </div>
        <div className="footer-right">
          <p className="footer-label">Trusted by thousands in Tarkwa</p>
          <div className="trust-row">
            <div className="trust-avatars">
              {trustUsers.map((u) => (
                <div key={u.initials} className="t-av" style={{ background: u.bg, color: u.color }}>
                  {u.initials}
                </div>
              ))}
              <div className="t-av t-av--count">+2.5K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}