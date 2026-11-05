"""Exporta la investigación de Persona 1 a Word y PDF desde su fuente Markdown.

Instalación: python -m pip install -r tools/requirements-docs.txt
Ejecución desde la raíz: python tools/export_research.py
El formato admite títulos, párrafos y listas simples usados en este documento.
"""

from html import escape
from pathlib import Path
import os
import re

from docx import Document
from docx.shared import Cm, Pt, RGBColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/investigacion/Investigacion_Persona1_Fundamentos.md'


def blocks(text):
    pending = []
    for line in [*text.splitlines(), '']:
        if not line.strip() or line.startswith(('#', '- ')):
            if pending:
                yield 'paragraph', ' '.join(pending)
                pending = []
            if line.startswith('#'):
                level = len(line) - len(line.lstrip('#'))
                yield f'h{level}', line[level:].strip()
            elif line.startswith('- '):
                yield 'bullet', line[2:].strip()
        else:
            pending.append(line.strip())


def pdf_text(text):
    text = escape(text.replace('`', ''))
    return re.sub(r'https://[^\s]+', lambda m: f'<link href="{m[0]}" color="#2563EB">{m[0]}</link>', text)


def export():
    content = list(blocks(SOURCE.read_text(encoding='utf-8')))
    doc = Document()
    section = doc.sections[0]
    section.top_margin = section.bottom_margin = Cm(2)
    section.left_margin = section.right_margin = Cm(2.2)
    normal = doc.styles['Normal']
    normal.font.name = 'Arial'
    normal.font.size = Pt(11)
    normal.paragraph_format.line_spacing = 1.15
    normal.paragraph_format.space_after = Pt(8)
    for name in ['Title', 'Heading 1', 'Heading 2']:
        doc.styles[name].font.name = 'Arial'
        doc.styles[name].font.color.rgb = RGBColor.from_string('183153')
    section.footer.paragraphs[0].text = 'Persona 1 · Fundamentos de React Native'

    # Arial incluye los acentos y signos utilizados. Se incrusta también en el PDF.
    font_dir = Path(os.environ.get('WINDIR', 'C:/Windows')) / 'Fonts'
    regular, bold = font_dir / 'arial.ttf', font_dir / 'arialbd.ttf'
    if not regular.exists() or not bold.exists():
        raise FileNotFoundError('Se requieren Arial (arial.ttf y arialbd.ttf) en la carpeta Fonts de Windows.')
    pdfmetrics.registerFont(TTFont('Research', str(regular)))
    pdfmetrics.registerFont(TTFont('ResearchBold', str(bold)))
    body = ParagraphStyle('ResearchBody', fontName='Research', fontSize=10.5, leading=15, spaceAfter=8, alignment=TA_LEFT, splitLongWords=True)
    headings = {
        'h1': ParagraphStyle('ResearchTitle', parent=body, fontName='ResearchBold', fontSize=19, leading=24, spaceAfter=16, keepWithNext=True, textColor=colors.HexColor('#183153')),
        'h2': ParagraphStyle('ResearchHeading', parent=body, fontName='ResearchBold', fontSize=14, leading=18, spaceBefore=13, spaceAfter=9, keepWithNext=True, textColor=colors.HexColor('#183153')),
        'h3': ParagraphStyle('ResearchSubheading', parent=body, fontName='ResearchBold', fontSize=11.5, leading=16, spaceBefore=8, keepWithNext=True),
    }
    bullet = ParagraphStyle('ResearchBullet', parent=body, leftIndent=12, firstLineIndent=-8)
    story = []
    for kind, text in content:
        clean = text.replace('`', '')
        if kind == 'h2' and text.startswith('1.6.'):
            doc.add_page_break()
            story.append(PageBreak())
        if kind in headings:
            doc.add_heading(clean, level={'h1': 0, 'h2': 1, 'h3': 2}[kind])
            story.append(Paragraph(pdf_text(text), headings[kind]))
        elif kind == 'bullet':
            doc.add_paragraph(clean, style='List Bullet')
            story.append(Paragraph('• ' + pdf_text(text), bullet))
        else:
            doc.add_paragraph(clean)
            story.append(Paragraph(pdf_text(text), body))
    doc.core_properties.title = 'Fundamentos de React Native — Persona 1'
    doc.core_properties.author = 'JoseMoralesC'
    doc.save(SOURCE.with_suffix('.docx'))

    def footer(canvas, document):
        canvas.setFont('Research', 8)
        canvas.setFillColor(colors.HexColor('#64748B'))
        canvas.drawString(48, 28, 'Persona 1 · Fundamentos de React Native')
        canvas.drawRightString(A4[0] - 48, 28, f'Página {document.page}')

    pdf = SimpleDocTemplate(str(SOURCE.with_suffix('.pdf')), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=45, bottomMargin=45, title=doc.core_properties.title, author='JoseMoralesC')
    pdf.build(story, onFirstPage=footer, onLaterPages=footer)
    for suffix in ['.docx', '.pdf']:
        print(SOURCE.with_suffix(suffix).relative_to(ROOT))


if __name__ == '__main__':
    export()
