import { useRef, useState, type FormEvent } from 'react';

interface CareerPageProps {
  onNavigateHome: () => void;
}

interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
}

export function CareerPage(_props: CareerPageProps) {
  const formRef = useRef<HTMLElement>(null);
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState<ApplicationData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus(`Thank you, ${formData.name}. Your application for "${formData.position}" has been received.`);
  }

  return (
    <div className="career-page">
      <section className="cp-apply-section" id="cp-apply" aria-labelledby="cp-apply-title" ref={formRef}>
        <div className="container">
          <div className="cp-apply-inner">
            <div className="cp-apply-copy" data-reveal>
              <p className="eyebrow">Careers at EmpireGroup</p>
              <h2 className="section-heading" id="cp-apply-title">Why choose <em>our company?</em></h2>
              <p className="section-copy">
                Build a meaningful career with a team that values professional growth, technical excellence,
                workplace safety, and responsible project delivery.
              </p>

              <div className="career-benefit-list">
                <article className="career-benefit">
                  <span>01</span>
                  <div>
                    <h3>Professional Growth</h3>
                    <p>Develop practical expertise across landmark construction projects.</p>
                  </div>
                </article>
                <article className="career-benefit">
                  <span>02</span>
                  <div>
                    <h3>Quality &amp; Safety</h3>
                    <p>Work in a culture that prioritizes engineering standards and safe practices.</p>
                  </div>
                </article>
                <article className="career-benefit">
                  <span>03</span>
                  <div>
                    <h3>Collaborative Team</h3>
                    <p>Collaborate with experienced engineers, managers, and site professionals.</p>
                  </div>
                </article>
                <article className="career-benefit">
                  <span>04</span>
                  <div>
                    <h3>Long-Term Opportunity</h3>
                    <p>Grow through consistent performance and challenging responsibilities.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="cp-apply-form-card" data-reveal>
              {formStatus ? (
                <div className="cp-form-success">
                  <h3>Application Received</h3>
                  <p>{formStatus}</p>
                  <button type="button" className="button" onClick={() => setFormStatus('')}>Apply for Another Role</button>
                </div>
              ) : (
                <form className="cp-apply-form" onSubmit={handleFormSubmit}>
                  <div className="cp-form-header">
                    <h3 className="cp-form-title">Submit Your Application</h3>
                  </div>

                  <div className="cp-form-grid">
                    <div className="cp-form-field">
                      <label htmlFor="cp-name">Full Name *</label>
                      <input id="cp-name" name="name" placeholder="Rahul Deshmukh" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="cp-form-field">
                      <label htmlFor="cp-email">Email Address *</label>
                      <input id="cp-email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="cp-form-field">
                      <label htmlFor="cp-phone">Mobile Number *</label>
                      <input id="cp-phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="cp-form-field">
                      <label htmlFor="cp-exp">Years of Experience *</label>
                      <select id="cp-exp" name="experience" value={formData.experience} onChange={handleChange} required>
                        <option value="">Select experience</option>
                        <option value="0-2 years">0–2 Years</option>
                        <option value="3-5 years">3–5 Years</option>
                        <option value="6-9 years">6–9 Years</option>
                        <option value="10+ years">10+ Years</option>
                      </select>
                    </div>
                    <div className="cp-form-field cp-form-field--full">
                      <label htmlFor="cp-position">Position Applied For *</label>
                      <input id="cp-position" name="position" placeholder="Enter position" value={formData.position} onChange={handleChange} required />
                    </div>
                    <div className="cp-form-field cp-form-field--full">
                      <label htmlFor="cp-message">Additional Information</label>
                      <textarea id="cp-message" name="message" rows={4} placeholder="Tell us briefly about your experience..." value={formData.message} onChange={handleChange} />
                    </div>
                  </div>

                  <button type="submit" className="button cp-form-submit">Submit Application →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
