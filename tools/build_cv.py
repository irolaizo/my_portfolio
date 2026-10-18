"""Genera los 4 CV de la web (ES, EU, EN, SV) como PDF de una página."""
import html, json, subprocess, sys, pathlib

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
OUT.mkdir(parents=True, exist_ok=True)

CONTACT = ['650 040 315', 'iratxeolaizolavargas@gmail.com', 'iratxeolaizolavargas.com', 'linkedin.com/in/iratxe-olaizola']

CV = {
'es': dict(
  loc='Getxo, Bizkaia · Carné de conducir B',
  role='Comunicación · Community management · Contenido con IA',
  h=dict(profile='Perfil', exp='Experiencia', other='Otras experiencias', skills='Competencias', tools='Herramientas', ai='IA generativa', lang='Idiomas', edu='Formación', courses='Cursos'),
  profile='Periodista y publicista con experiencia en agencia, como freelance y en un ayuntamiento en Suecia. Creo estrategias y contenido para redes sociales (foto, vídeo, texto y diseño), gestiono comunidades y analizo métricas. Organicé desde cero un AI Game Jam para jóvenes y conseguí 10.800 SEK de financiación. Investigo la IA aplicada a la comunicación en mi doctorado y la uso a diario para crear contenido.',
  exp=[
    ('Recepcionista nocturna', 'jul. 2026 – sep. 2026', 'ICEHOTEL, Jukkasjärvi (Suecia)', [
      'Atención en inglés a huéspedes de todo el mundo: check-in, check-out e información sobre actividades.',
      'Gestión autónoma de incidencias en turnos de noche y coordinación con otros departamentos.']),
    ('Comunicación y redes sociales', 'sep. 2025 – jul. 2026', 'Centro juvenil FUZED, Ayuntamiento de Borås (Suecia) · Cuerpo Europeo de Solidaridad', [
      'Creé desde cero la estrategia, el calendario y la imagen del centro: 600 seguidores en Instagram sin inversión.',
      'Foto, vídeo para Reels y Stories (CapCut), carteles y señalética del local.',
      'Gestioné dos cuentas a la vez: la del centro y la de ung.boras (verano de 2026).',
      'Organicé un AI Game Jam de 12 horas para jóvenes de 13 a 19 años, con campaña completa y 10.800 SEK de patrocinadores.']),
    ('Community Manager', 'jun. 2024 – dic. 2024', 'Global Data Media Tech (agencia), Bilbao', [
      'Redes sociales de clientes como Metro Bilbao y Euskalduna Jauregia: planificación, contenido y programación.',
      'Gestión de comunidades, análisis de métricas e informes para clientes.']),
    ('Community Manager freelance', '2023 – 2024', 'Centro Estética Thais, Getxo', [
      'Lancé el Instagram de la marca: identidad visual, contenido en foto y vídeo, y programación.']),
    ('Prácticas de marketing', 'jun. 2023 – sep. 2023', 'Cadena SER (PRISA), Bilbao', [
      'Materiales promocionales, email marketing con Mailchimp, notas de prensa y apoyo en eventos.']),
  ],
  other=[('2021 – 2022', 'Irudigital', '(agencia) · redes sociales y SEO'), ('2020', 'Deia', '· redacción y edición'),
         ('2017 – 2020', 'ViniloFM', '· Geure Geurean: colaboradora y presentadora'), ('2017 – 2019', 'Bourne Leisure', '(Inglaterra) · hostelería, tres veranos')],
  skills=['Estrategia de redes sociales', 'Calendarios de contenido', 'Vídeo corto: Reels, TikTok y Stories', 'Copywriting y storytelling', 'Gestión de comunidades', 'Métricas e informes', 'Organización de eventos', 'Diseño gráfico'],
  tools='Canva, CapCut, Procreate, Meta Business Suite, Metricool, Hootsuite, Mailchimp, Adobe Photoshop, Illustrator e InDesign, Google Analytics, WordPress',
  ai='Guiones, copys, imagen y edición de vídeo. Doctorado UPV/EHU sobre IA y comunicación.',
  langs=[('Castellano', 'Nativo'), ('Euskera', 'Nativo · C1'), ('Inglés', 'B2 · C1 en dic.'), ('Sueco', 'A2')],
  edu=[('Doctorado en Comunicación', 'UPV/EHU · en curso · IA · tiempo parcial'), ('Máster en Comunicación Social', 'UPV/EHU · 2025'),
       ('Grado en Publicidad y RR. PP.', 'UPV/EHU · 2025 · Erasmus+ Noruega'), ('Grado en Periodismo', 'UPV/EHU · 2022')],
  courses=[('Microcredencial en IA para creación de contenidos y community managers', 'UPV/EHU · 2026'),
           ('Community Manager: herramientas, analítica e informes', 'Lanbide · 2025 · 100 h'),
           ('Bases de programación en C', '42 Urduliz · 2023 – 2025')],
),
'eu': dict(
  loc='Getxo, Bizkaia · B gidabaimena',
  role='Komunikazioa · Community management · Edukia IArekin',
  h=dict(profile='Profila', exp='Lan-esperientzia', other='Bestelako esperientzia', skills='Gaitasunak', tools='Tresnak', ai='IA sortzailea', lang='Hizkuntzak', edu='Prestakuntza', courses='Ikastaroak'),
  profile='Kazetaria eta publizista, agentzian, freelance gisa eta Suediako udal batean esperientzia duena. Sare sozialetarako estrategiak eta edukia sortzen ditut (argazkia, bideoa, testua eta diseinua), komunitateak kudeatzen ditut eta metrikak aztertzen. Gazteentzako AI Game Jam bat antolatu nuen hutsetik, eta 10.800 SEK lortu nituen. Doktoretzan IA komunikazioan ikertzen dut, eta egunero erabiltzen dut edukiak sortzeko.',
  exp=[
    ('Gaueko harreragilea', '2026/07 – 2026/09', 'ICEHOTEL, Jukkasjärvi (Suedia)', [
      'Mundu osoko bezeroen arreta ingelesez: check-in, check-out eta jarduerei buruzko informazioa.',
      'Gorabeheren kudeaketa autonomoa gaueko txandetan eta beste sailekin koordinazioa.']),
    ('Komunikazioa eta sare sozialak', '2025/09 – 2026/07', 'FUZED gazte-gunea, Boråseko Udala (Suedia) · Europako Elkartasun Gorputza', [
      'Zentroaren estrategia, egutegia eta irudia sortu nituen hutsetik: 600 jarraitzaile Instagramen, publizitaterik gabe.',
      'Argazkiak, Reels eta Storyetarako bideoak (CapCut), kartelak eta lokaleko seinaleak.',
      'Bi kontu kudeatu nituen batera: zentroarena eta ung.boras-ena (2026ko uda).',
      '12 orduko AI Game Jam bat antolatu nuen 13-19 urteko gazteentzat, kanpaina osoarekin; 10.800 SEK babesleengandik.']),
    ('Community managerra', '2024/06 – 2024/12', 'Global Data Media Tech (agentzia), Bilbo', [
      'Metro Bilbao eta Euskalduna Jauregia bezeroen sare sozialak: plangintza, edukia eta programazioa.',
      'Komunitateen kudeaketa, metriken analisia eta bezeroentzako txostenak.']),
    ('Community manager freelance', '2023 – 2024', 'Centro Estética Thais, Getxo', [
      'Markaren Instagram abiarazi nuen: identitate bisuala, argazki eta bideo edukia, eta programazioa.']),
    ('Marketin praktikak', '2023/06 – 2023/09', 'Cadena SER (PRISA), Bilbo', [
      'Promozio-materiala, email marketina Mailchimp-ekin, prentsa-oharrak eta ekitaldietan laguntza.']),
  ],
  other=[('2021 – 2022', 'Irudigital', '(agentzia) · sare sozialak eta SEO'), ('2020', 'Deia', '· idazketa eta edizioa'),
         ('2017 – 2020', 'ViniloFM', '· Geure Geurean: kolaboratzailea eta aurkezlea'), ('2017 – 2019', 'Bourne Leisure', '(Ingalaterra) · ostalaritza, hiru uda')],
  skills=['Sare sozialen estrategia', 'Eduki-egutegiak', 'Bideo laburra: Reels, TikTok, Storyak', 'Copywritinga eta storytellinga', 'Komunitateen kudeaketa', 'Metrikak eta txostenak', 'Ekitaldien antolaketa', 'Diseinu grafikoa'],
  tools='Canva, CapCut, Procreate, Meta Business Suite, Metricool, Hootsuite, Mailchimp, Adobe Photoshop, Illustrator eta InDesign, Google Analytics, WordPress',
  ai='Gidoiak, copyak, irudia eta bideo-edizioa. Doktoretza UPV/EHUn IA eta komunikazioari buruz.',
  langs=[('Euskara', 'Ama-hizkuntza · C1'), ('Gaztelania', 'Ama-hizkuntza'), ('Ingelesa', 'B2 · C1 abenduan'), ('Suediera', 'A2')],
  edu=[('Komunikazioko doktoretza', 'UPV/EHU · abian · IA · lanaldi partziala'), ('Gizarte Komunikazioko Masterra', 'UPV/EHU · 2025'),
       ('Publizitatea eta HHPP gradua', 'UPV/EHU · 2025 · Erasmus+ Norvegia'), ('Kazetaritza gradua', 'UPV/EHU · 2022')],
  courses=[('Unibertsitateko mikrokredentziala: IA edukiak sortzeko eta community managerrentzat', 'UPV/EHU · 2026'),
           ('Community manager: tresnak, analitika eta txostenak', 'Lanbide · 2025 · 100 ordu'),
           ('C programazioaren oinarriak', '42 Urduliz · 2023 – 2025')],
),
'en': dict(
  loc='Getxo, Basque Country · Driving licence B',
  role='Communication · Community management · AI-powered content',
  h=dict(profile='Profile', exp='Experience', other='Earlier experience', skills='Skills', tools='Tools', ai='Generative AI', lang='Languages', edu='Education', courses='Courses'),
  profile='Journalist and advertising graduate with experience at an agency, as a freelancer and at a city council in Sweden. I create social media strategies and content (photo, video, copy and design), manage communities and analyse metrics. I organised an AI Game Jam for teenagers from scratch and secured SEK 10,800 in funding. My PhD research is on AI in communication, and I use AI every day to create content.',
  exp=[
    ('Night Receptionist', 'Jul 2026 – Sep 2026', 'ICEHOTEL, Jukkasjärvi (Sweden)', [
      'Welcomed guests from all over the world in English: check-in, check-out and advice on activities.',
      'Handled requests and incidents independently on night shifts, coordinating with other departments.']),
    ('Communications & Social Media', 'Sep 2025 – Jul 2026', 'FUZED youth centre, Borås City Council (Sweden) · European Solidarity Corps', [
      'Built the centre’s strategy, content calendar and visual identity from scratch: 600 Instagram followers with zero ad spend.',
      'Photo, short video for Reels and Stories (CapCut), posters and signage for the venue.',
      'Ran two accounts at once: the centre’s and ung.boras (summer 2026).',
      'Organised a 12-hour AI Game Jam for 13 to 19-year-olds, with a full campaign and SEK 10,800 from sponsors.']),
    ('Community Manager', 'Jun 2024 – Dec 2024', 'Global Data Media Tech (agency), Bilbao', [
      'Social media for clients such as Metro Bilbao and Euskalduna Conference Centre: planning, content and scheduling.',
      'Community management, metrics analysis and client reporting.']),
    ('Freelance Community Manager', '2023 – 2024', 'Centro Estética Thais, Getxo', [
      'Launched the brand’s Instagram: visual identity, photo and video content, and scheduling.']),
    ('Marketing Intern', 'Jun 2023 – Sep 2023', 'Cadena SER (PRISA), Bilbao', [
      'Promotional materials, email marketing with Mailchimp, press releases and event support.']),
  ],
  other=[('2021 – 2022', 'Irudigital', '(agency) · social media and SEO'), ('2020', 'Deia', '· newspaper reporting and editing'),
         ('2017 – 2020', 'ViniloFM', '· Geure Geurean: contributor and presenter'), ('2017 – 2019', 'Bourne Leisure', '(England) · hospitality, three summers')],
  skills=['Social media strategy', 'Content calendars', 'Short video: Reels, TikTok, Stories', 'Copywriting and storytelling', 'Community management', 'Metrics and reporting', 'Event organisation', 'Graphic design'],
  tools='Canva, CapCut, Procreate, Meta Business Suite, Metricool, Hootsuite, Mailchimp, Adobe Photoshop, Illustrator and InDesign, Google Analytics, WordPress',
  ai='Scripts, copy, images and video editing. PhD at UPV/EHU on AI and communication.',
  langs=[('Spanish', 'Native'), ('Basque', 'Native · C1'), ('English', 'B2 · C1 exam Dec'), ('Swedish', 'A2')],
  edu=[('PhD candidate, Communication', 'UPV/EHU · in progress · AI · part-time'), ('MA Social Communication', 'UPV/EHU · 2025'),
       ('BA Advertising & PR', 'UPV/EHU · 2025 · Erasmus+ Norway'), ('BA Journalism', 'UPV/EHU · 2022')],
  courses=[('University micro-credential: AI for content creation and community managers', 'UPV/EHU · 2026'),
           ('Community manager: tools, analytics and reporting', 'Lanbide · 2025 · 100 h'),
           ('Basics of C programming', '42 Urduliz · 2023 – 2025')],
),
'sv': dict(
  loc='Getxo, Baskien · Körkort B',
  role='Kommunikation · Community management · Innehåll med AI',
  h=dict(profile='Profil', exp='Erfarenhet', other='Tidigare erfarenhet', skills='Kompetenser', tools='Verktyg', ai='Generativ AI', lang='Språk', edu='Utbildning', courses='Kurser'),
  profile='Journalist och reklamare med erfarenhet från byrå, som frilans och från en kommun i Sverige. Jag skapar strategier och innehåll för sociala medier (foto, video, text och design), sköter communities och analyserar statistik. Jag organiserade ett AI Game Jam för ungdomar från grunden och säkrade 10 800 kr i finansiering. I min doktorandforskning studerar jag AI inom kommunikation, och jag använder AI varje dag för att skapa innehåll.',
  exp=[
    ('Nattreceptionist', 'jul. 2026 – sep. 2026', 'ICEHOTEL, Jukkasjärvi', [
      'Tog emot gäster från hela världen på engelska: in- och utcheckning och tips om aktiviteter.',
      'Löste ärenden och incidenter självständigt på nattpass, i samarbete med andra avdelningar.']),
    ('Kommunikation och sociala medier', 'sep. 2025 – jul. 2026', 'Fritidsgården FUZED, Borås Stad · Europeiska solidaritetskåren', [
      'Byggde upp centrets strategi, innehållskalender och visuella identitet från grunden: 600 följare på Instagram utan annonsbudget.',
      'Foto, kort video för Reels och Stories (CapCut), affischer och skyltar till lokalen.',
      'Skötte två konton samtidigt: centrets och ung.boras (sommaren 2026).',
      'Organiserade ett 12-timmars AI Game Jam för ungdomar 13–19 år, med hel kampanj och 10 800 kr från sponsorer.']),
    ('Community manager', 'jun. 2024 – dec. 2024', 'Global Data Media Tech (byrå), Bilbao', [
      'Sociala medier för kunder som Metro Bilbao och Euskalduna kongresscenter: planering, innehåll och schemaläggning.',
      'Community management, analys av statistik och rapporter till kunder.']),
    ('Community manager, frilans', '2023 – 2024', 'Centro Estética Thais, Getxo', [
      'Startade varumärkets Instagram: visuell identitet, foto- och videoinnehåll och schemaläggning.']),
    ('Marknadsföringspraktik', 'jun. 2023 – sep. 2023', 'Cadena SER (PRISA), Bilbao', [
      'Marknadsföringsmaterial, e-postmarknadsföring med Mailchimp, pressmeddelanden och stöd vid evenemang.']),
  ],
  other=[('2021 – 2022', 'Irudigital', '(byrå) · sociala medier och SEO'), ('2020', 'Deia', '· nyhetsskrivande och redigering'),
         ('2017 – 2020', 'ViniloFM', '· Geure Geurean: medarbetare och programledare'), ('2017 – 2019', 'Bourne Leisure', '(England) · hotell och restaurang, tre somrar')],
  skills=['Strategi för sociala medier', 'Innehållskalendrar', 'Kort video: Reels, TikTok, Stories', 'Copywriting och storytelling', 'Community management', 'Statistik och rapporter', 'Evenemangsplanering', 'Grafisk design'],
  tools='Canva, CapCut, Procreate, Meta Business Suite, Metricool, Hootsuite, Mailchimp, Adobe Photoshop, Illustrator och InDesign, Google Analytics, WordPress',
  ai='Manus, texter, bild och videoredigering. Doktorand vid UPV/EHU inom AI och kommunikation.',
  langs=[('Spanska', 'Modersmål'), ('Baskiska', 'Modersmål · C1'), ('Engelska', 'B2 · C1-prov i dec.'), ('Svenska', 'A2 · SFI kurs C')],
  edu=[('Doktorand i kommunikation', 'UPV/EHU · pågående · AI · deltid'), ('Master i social kommunikation', 'UPV/EHU · 2025'),
       ('Kandidat i reklam och PR', 'UPV/EHU · 2025 · Erasmus+ Norge'), ('Kandidat i journalistik', 'UPV/EHU · 2022')],
  courses=[('Mikromeritering: AI för innehållsskapande och community managers', 'UPV/EHU · 2026'),
           ('Community manager: verktyg, analys och rapporter', 'Lanbide · 2025 · 100 timmar'),
           ('Grunderna i C-programmering', '42 Urduliz · 2023 – 2025')],
),
}

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, sans-serif; color: #2B1520; font-size: 8.9pt; line-height: 1.38; }
.page { width: 210mm; height: 297mm; padding: 13mm 14mm 10mm; display: flex; flex-direction: column; }
header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 5mm; border-bottom: 2.2pt solid #8E2453; }
h1 { font-family: 'Inter Display', Inter, sans-serif; font-weight: 800; font-size: 27pt; letter-spacing: -.02em; margin: 0; line-height: 1; }
.role { color: #B8296A; font-weight: 600; font-size: 10.2pt; margin-top: 2.2mm; }
.contact { text-align: right; font-size: 8.3pt; line-height: 1.6; }
main { display: grid; grid-template-columns: 1fr 58mm; gap: 7mm; padding-top: 5mm; flex: 1; }
aside { border-left: .6pt solid #E7C6D4; padding-left: 6mm; }
h2 { color: #B8296A; font-size: 7.8pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin: 0 0 1.8mm; }
section { margin-bottom: 4.2mm; }
p { margin: 0; }
.job { margin-bottom: 2.8mm; }
.jt { display: flex; justify-content: space-between; gap: 4mm; font-weight: 700; font-size: 9.6pt; }
.jt span { font-weight: 400; color: #7A5566; font-size: 8.1pt; white-space: nowrap; padding-top: .6pt; }
.org { color: #7A5566; font-size: 8.2pt; margin: .3mm 0 1mm; }
ul { margin: 0; padding-left: 4mm; }
li { margin-bottom: .7mm; }
li::marker { color: #B8296A; }
.other { display: grid; grid-template-columns: 21mm 1fr; row-gap: .9mm; font-size: 8.4pt; }
.other .y { color: #7A5566; }
.list { margin: 0; padding: 0; list-style: none; }
.list li { margin-bottom: 1mm; }
.lang { display: grid; grid-template-columns: 1fr auto; row-gap: .9mm; }
.lang b { font-weight: 600; }
.ed { margin-bottom: 1.9mm; }
.ed b { display: block; font-weight: 600; line-height: 1.25; }
.ed span { color: #7A5566; font-size: 8pt; }
"""

e = html.escape
def render(l, d):
    exp = ''.join(f'<div class="job"><div class="jt">{e(t)}<span>{e(dt)}</span></div><div class="org">{e(org)}</div><ul>' + ''.join(f'<li>{e(b)}</li>' for b in bs) + '</ul></div>' for t, dt, org, bs in d['exp'])
    other = ''.join(f'<span class="y">{e(y)}</span><span><b>{e(n)}</b> {e(r)}</span>' for y, n, r in d['other'])
    h = d['h']
    return f"""<!doctype html><html lang="{l}"><head><meta charset="utf-8"><title>Iratxe Olaizola · CV</title><style>{CSS}</style></head><body><div class="page">
<header><div><h1>Iratxe Olaizola</h1><div class="role">{e(d['role'])}</div></div>
<div class="contact">{e(d['loc'])}<br>{'<br>'.join(e(c) for c in CONTACT)}</div></header>
<main><div>
<section><h2>{h['profile']}</h2><p>{e(d['profile'])}</p></section>
<section><h2>{h['exp']}</h2>{exp}</section>
<section><h2>{h['other']}</h2><div class="other">{other}</div></section>
</div><aside>
<section><h2>{h['skills']}</h2><ul class="list">{''.join(f'<li>{e(s)}</li>' for s in d['skills'])}</ul></section>
<section><h2>{h['tools']}</h2><p>{e(d['tools'])}</p></section>
<section><h2>{h['ai']}</h2><p>{e(d['ai'])}</p></section>
<section><h2>{h['lang']}</h2><div class="lang">{''.join(f'<b>{e(a)}</b><span>{e(b)}</span>' for a, b in d['langs'])}</div></section>
<section><h2>{h['edu']}</h2>{''.join(f'<div class="ed"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['edu'])}</section>
<section><h2>{h['courses']}</h2>{''.join(f'<div class="ed"><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['courses'])}</section>
</aside></main></div></body></html>"""

for l, d in CV.items():
    (OUT / f'cv-{l}.html').write_text(render(l, d), encoding='utf-8')
print('ok')
