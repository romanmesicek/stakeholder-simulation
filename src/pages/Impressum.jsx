export default function Impressum() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Impressum</h1>

      <div className="space-y-6 text-slate-700">
        <section>
          <h2 className="font-semibold text-slate-800 mb-2">Medieninhaber und Herausgeber</h2>
          <p>
            SUSTAINABILITY SKILLS e.U.
            <br />
            Geschäftsführung: Roman Mesicek
            <br />
            Haidhofstraße 87/1
            <br />
            2500 Baden bei Wien, Österreich
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">Kontakt</h2>
          <p>
            E-Mail:{' '}
            <a href="mailto:office@sustainability-skills.at" className="text-blue-600 hover:underline">
              office@sustainability-skills.at
            </a>
            <br />
            Telefon: +43 664 88584153
            <br />
            Web:{' '}
            <a
              href="https://www.sustainability-skills.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              www.sustainability-skills.at
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">Unternehmensdaten</h2>
          <p>
            Firmenbuchnummer: FN 617506y
            <br />
            Firmenbuchgericht: Landesgericht Niederösterreich
            <br />
            Behörde gemäß ECG: Landesgericht Wiener Neustadt
            <br />
            Mitglied der Wirtschaftskammer Österreich und Niederösterreich, Fachgruppe UBIT
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Vollständiges Impressum:{' '}
            <a
              href="https://mesicek.com/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              mesicek.com/impressum
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-800 mb-2">Über diese Anwendung</h2>
          <p>
            Plattform für Multi-Stakeholder-Planspiele in der Hochschullehre. Alle Szenarien,
            Orte, Unternehmen und Personen der Fallstudien sind fiktiv und dienen ausschließlich
            Lehrzwecken.
          </p>
          <p className="mt-2">
            Konzept und Umsetzung: Roman Mesicek. Der Quellcode ist offen verfügbar auf{' '}
            <a
              href="https://github.com/romanmesicek/stakeholder-simulation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
