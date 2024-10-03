import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Impressum = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '20px' }}>
        <h1>Impressum</h1>
        <p><strong>Angaben gemäß § 5 TMG:</strong></p>
        <p>Dennis Uhlig<br />
          Grünauer Str. 5<br />
          40789 Monheim am Rhein<br />
          Deutschland</p>

        <p><strong>Kontakt:</strong></p>
        <p>E-Mail: dennis.uhlig@icloud.com</p>

        <p><strong>Haftungsausschluss (Disclaimer):</strong></p>
        <p><strong>Haftung für Inhalte</strong><br />
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch keine Gewähr übernehmen. Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>

        <p><strong>Urheberrecht</strong><br />
          Die durch mich erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht von mir erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitte ich um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werde ich derartige Inhalte umgehend entfernen.</p>

        <p><strong>Verwendung von Logos</strong><br />
          Die auf dieser Website verwendeten Logos der Teams und des Ligaorganisators/Verbandes werden mit Genehmigung der jeweiligen Rechteinhaber genutzt. Einige Genehmigungen für die Verwendung dieser Logos stehen derzeit noch aus. Ich habe entsprechende Anfragen an die betreffenden Rechteinhaber gestellt und erwarte deren Zustimmung. Sollte es zu Unklarheiten oder rechtlichen Bedenken kommen, bitte ich um eine Kontaktaufnahme per E-Mail. Bei Bekanntwerden etwaiger Rechtsverletzungen werde ich die entsprechenden Logos unverzüglich entfernen.</p>

        <p><strong>Online-Streitbeilegung</strong><br />
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a><br />
          Meine E-Mail-Adresse finden Sie oben im Impressum.</p>
      </main>

      <Footer />
    </div>
  );
};

export default Impressum;