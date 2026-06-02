CREATE TABLE public.legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.legal_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.legal_pages TO authenticated;
GRANT ALL ON public.legal_pages TO service_role;

ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view legal pages"
ON public.legal_pages FOR SELECT
USING (true);

CREATE POLICY "Admins manage legal pages"
ON public.legal_pages FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_legal_pages_updated
BEFORE UPDATE ON public.legal_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.legal_pages (slug, title, content) VALUES
('privacy', 'Informativa sulla Privacy', '<h2>Informativa sulla Privacy ai sensi del Regolamento UE 2016/679 (GDPR)</h2>
<p><strong>Titolare del trattamento:</strong> Parco Bosco Anima Mundi.</p>

<h3>1. Dati raccolti</h3>
<p>Raccogliamo: nome e cognome, indirizzo email, numero di telefono, eventuale adesione al programma volontari, dati di geolocalizzazione (solo durante l''uso attivo della funzione mappa), e contenuti generati dall''utente.</p>

<h3>2. Finalità del trattamento</h3>
<ul>
<li>Gestione dell''account e autenticazione</li>
<li>Erogazione dei servizi dell''app (mappa alberi, eventi, comunicazioni)</li>
<li>Invio di comunicazioni relative alle attività del parco (anche via WhatsApp per i volontari)</li>
<li>Adempimenti di legge</li>
</ul>

<h3>3. Base giuridica</h3>
<p>Il trattamento si basa sul consenso esplicito dell''interessato (art. 6, par. 1, lett. a GDPR) e sull''esecuzione di servizi richiesti (art. 6, par. 1, lett. b GDPR).</p>

<h3>4. Conservazione dei dati</h3>
<p>I dati sono conservati per il tempo necessario alle finalità indicate e fino alla richiesta di cancellazione da parte dell''utente.</p>

<h3>5. Diritti dell''interessato</h3>
<p>Hai diritto di: accedere ai tuoi dati, rettificarli, cancellarli, limitarne il trattamento, opporti al trattamento, ricevere i dati in formato portabile, revocare il consenso in qualsiasi momento, proporre reclamo al Garante per la protezione dei dati personali.</p>

<h3>6. Condivisione dei dati</h3>
<p>I dati sono trattati da personale autorizzato e non vengono ceduti a terzi se non per obblighi di legge o per i fornitori tecnici (hosting, database) vincolati da accordi di trattamento dati.</p>

<h3>7. Sicurezza</h3>
<p>Adottiamo misure tecniche e organizzative adeguate per proteggere i dati, ma nessun sistema è completamente sicuro.</p>

<h3>8. Contatti</h3>
<p>Per esercitare i tuoi diritti contatta il Titolare attraverso i canali ufficiali del Parco Bosco Anima Mundi.</p>'),
('liability', 'Esonero di Responsabilità', '<h2>Esonero di Responsabilità</h2>
<p>Installando ed utilizzando l''app del Parco Bosco Anima Mundi, l''utente prende atto e accetta espressamente che:</p>
<ul>
<li>Il Parco Bosco Anima Mundi non assume alcuna responsabilità per danni diretti o indiretti derivanti dall''installazione, dall''uso o dal malfunzionamento dell''app.</li>
<li>Il Parco non è responsabile per eventuali perdite, furti o accessi non autorizzati ai dati personali dovuti a vulnerabilità tecniche, attacchi informatici o cause di forza maggiore.</li>
<li>Il Parco non è responsabile per danni al dispositivo dell''utente, perdita di dati, interruzioni del servizio o qualsiasi altro inconveniente tecnico.</li>
<li>L''uso dell''app, inclusa la funzione di geolocalizzazione e navigazione all''interno del parco, avviene a rischio esclusivo dell''utente.</li>
</ul>
<p>L''accettazione di tali condizioni è requisito necessario per la registrazione e l''utilizzo dell''applicazione.</p>');