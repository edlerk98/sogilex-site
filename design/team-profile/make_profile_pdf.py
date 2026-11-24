"""Sogilex 'Meet the team' profile: a fillable PDF (AcroForm) for team members to fill in for the About page."""
import sys
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.utils import ImageReader

OUT, LOGO = sys.argv[1], sys.argv[2]
W, H = letter
M = 54  # margin
NIGHT, PLUM_TXT, INK, MUTE, LINE, AMBER = HexColor('#120A18'), HexColor('#F7EFF3'), HexColor('#1C1424'), HexColor('#5E5368'), HexColor('#D9D2DE'), HexColor('#E8782F')
FIELD_BG, FIELD_BORDER = HexColor('#FBF8FC'), HexColor('#B9AEC2')

c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle('Sogilex: Meet the team profile')
c.setAuthor('Sogilex')
c.setSubject('Your profile for the About page on sogilex.com')
form = c.acroForm


def header(page_title, sub):
    c.setFillColor(NIGHT); c.rect(0, H - 96, W, 96, stroke=0, fill=1)
    logo = ImageReader(LOGO)
    lw = 190; lh = lw * 308 / 1038  # transparent logo for dark backgrounds: no box edge on the dark band
    c.drawImage(logo, M - 14, H - 48 - lh / 2, width=lw, height=lh, mask='auto')
    c.setFillColor(PLUM_TXT); c.setFont('Helvetica-Bold', 17)
    c.drawRightString(W - M, H - 44, page_title)
    c.setFont('Helvetica', 10); c.setFillColor(HexColor('#BBA9C2'))
    c.drawRightString(W - M, H - 62, sub)
    # sunset rule
    steps = 60
    for i in range(steps):
        t = i / (steps - 1)
        r = int(0xD9 + (0xFF - 0xD9) * t); g = int(0x1E + (0x9A - 0x1E) * t); b = int(0x8C + (0x4D - 0x8C) * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        c.rect(i * W / steps, H - 99, W / steps + 1, 3, stroke=0, fill=1)


def wrap(text, font, size, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if c.stringWidth(t, font, size) <= width: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines


def para(y, text, size=10, color=MUTE, font='Helvetica', width=W - 2 * M, lead=1.4):
    c.setFont(font, size); c.setFillColor(color)
    for ln in wrap(text, font, size, width):
        c.drawString(M, y, ln); y -= size * lead
    return y


def field(y, name, label, hint='', height=22, multiline=False, maxlen=None, value=''):
    c.setFont('Helvetica-Bold', 10.5); c.setFillColor(INK); c.drawString(M, y, label)
    y -= 4
    if hint:
        y -= 11
        c.setFont('Helvetica', 8.5); c.setFillColor(MUTE)
        for ln in wrap(hint, 'Helvetica', 8.5, W - 2 * M):
            c.drawString(M, y, ln); y -= 11
        y += 11
    y -= 4 + height
    kw = dict(name=name, tooltip=label, x=M, y=y, width=W - 2 * M, height=height, fontName='Helvetica', fontSize=10,
              borderColor=FIELD_BORDER, fillColor=FIELD_BG, textColor=INK, borderWidth=1, borderStyle='solid', value=value,
              forceBorder=True)
    if multiline: kw['fieldFlags'] = 'multiline'
    kw['maxlen'] = maxlen or (1000 if multiline else 200)  # reportlab's default caps every box at 100 characters
    form.textfield(**kw)
    return y - 16


def check(y, name, label):
    form.checkbox(name=name, tooltip=label, x=M, y=y - 3, size=14, buttonStyle='check', borderColor=FIELD_BORDER,
                  fillColor=FIELD_BG, textColor=INK, forceBorder=True)
    c.setFont('Helvetica', 10); c.setFillColor(INK)
    lines = wrap(label, 'Helvetica', 10, W - 2 * M - 24)
    for i, ln in enumerate(lines): c.drawString(M + 22, y - i * 13, ln)
    return y - 13 * len(lines) - 10


def footer(n):
    c.setFont('Helvetica', 8); c.setFillColor(MUTE)
    c.drawString(M, 30, 'Sogilex · sogilex.com')
    c.drawRightString(W - M, 30, f'Page {n} of 2')


# ---------------- page 1 ----------------
header('Meet the team', 'Your profile for the About page on sogilex.com')
y = H - 132
y = para(y, 'Your answers become your profile on the new About page at sogilex.com, so customers can see the people behind Sogilex. Everything is optional: skip anything you\'d rather not share. Short and natural beats long and polished; a sentence or two each is perfect.', 10.5, INK)
y -= 10
y = field(y, 'name', 'Your name, as it should appear', 'For example "Blake Pille" or just "Blake".')
y = field(y, 'title', 'Your title', 'Suggested in the business plan: Co-founder & Head of Sales. Change it if you prefer something else.', value='Co-founder & Head of Sales')
y = field(y, 'area', 'Where you\'re from or where you live', 'A city or area only, for example "St. Louis area". Please no street address.')
y = field(y, 'role', 'What you do at Sogilex, in one sentence', 'For example: "I help local businesses get their menus and websites set up, and I make sure the tech works."', height=40, multiline=True)
y = field(y, 'why', 'Why you got into this', 'What made you want to help local businesses, or what you like about this work.', height=52, multiline=True)
y = field(y, 'good_at', 'Something you\'re great at', 'Work or not: fixing tech, talking to people, spotting a good deal...', height=40, multiline=True)
footer(1)
c.showPage()

# ---------------- page 2 ----------------
header('Meet the team', 'The fun part')
y = H - 132
y = field(y, 'fun', 'What you do for fun', 'Hobbies, sports, games, music, outdoors... whatever you\'d spend a free Saturday on.', height=52, multiline=True)
y = field(y, 'local_spot', 'Your favorite local spot', 'A restaurant, coffee shop, park or bar you love. Local businesses are who we work for, so a shout-out fits.', height=22)
y = field(y, 'go_to_order', 'Your go-to order there (or anywhere)', '', height=22)
y = field(y, 'surprise', 'Something people are surprised to learn about you', '', height=40, multiline=True)
y = field(y, 'three_words', 'Three words your friends would use to describe you', '', height=22)

c.setFont('Helvetica-Bold', 10.5); c.setFillColor(INK); c.drawString(M, y, 'Your photo'); y -= 15
y = para(y, 'Please email a photo to hello@sogilex.com: a clear, friendly shot of your face, in good light, with nobody else in it. A phone photo is fine.', 9.5, MUTE)
y -= 10

c.setFont('Helvetica-Bold', 10.5); c.setFillColor(INK); c.drawString(M, y, 'Your OK'); y -= 18
y = check(y, 'ok_name', 'You can show my name and title.')
y = check(y, 'ok_photo', 'You can show the photo I send.')
y = check(y, 'ok_publish', 'I approve these answers being shown on sogilex.com, lightly edited for length. I\'ll see the page before it goes live.')
y -= 2
y = field(y, 'signed_date', 'Date', '', height=22, maxlen=20)
footer(2)
c.save()
print('wrote', OUT)
