# scripts/generate_sample_pdf.py
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'ContractTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0D0F11"),
        alignment=0,
    )

    subtitle_style = ParagraphStyle(
        'ContractSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#52525B"),
    )

    section_header = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#18181B"),
        spaceBefore=12,
        spaceAfter=4,
    )

    body_style = ParagraphStyle(
        'ContractBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#27272A"),
    )

    highlight_style = ParagraphStyle(
        'HighlightBody',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#702AE0"),
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("COMMERCIAL CREATOR & BRAND PARTNERSHIP AGREEMENT", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Standard Independent Creator Content & Commercial Rights Contract · Reference #SCP-2026-1042", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#E4E4E7"), spaceAfter=12))

    # Parties Summary Table
    parties_data = [
        [
            Paragraph("<b>BRAND / CLIENT</b><br/>Nescafe Coffee Nigeria Ltd.<br/>Victoria Island, Lagos<br/>Contact: Campaign Management Team", body_style),
            Paragraph("<b>CREATOR / TALENT</b><br/>Amaka Moyinlola<br/>Social Handle: @amaka_creates<br/>Email: amaka@scopepartners.app", body_style),
            Paragraph("<b>KEY METRICS</b><br/>Effective Date: Sept 1, 2026<br/>Total Value: <b>₦300,000 NGN</b><br/>Term: 30 Days Organic", body_style),
        ]
    ]

    parties_table = Table(parties_data, colWidths=[180, 180, 160])
    parties_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FBF9F5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#E4E4E7")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(parties_table)
    story.append(Spacer(1, 14))

    # Section 1
    story.append(Paragraph("SECTION 1: SCOPE OF WORK", section_header))
    story.append(Paragraph(
        "1.1 The Creator agrees to conceptualize, shoot, edit, and publish high-production digital creator content showcasing the Brand's seasonal ready-to-drink cold brew coffee line.<br/>"
        "1.2 Content tone shall authentically match the Creator's signature aesthetic and editorial lifestyle voice.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("SECTION 2: DELIVERABLES & FORMAT SPECIFICATIONS", section_header))
    story.append(Paragraph(
        "<b>2.1 Deliverables:</b> Exactly <b>3 TikTok videos</b> (60 to 90 seconds in duration, vertical 9:16 format, 1080x1920 HD resolution).<br/>"
        "<b>2.2 Delivery Milestones:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Deliverable #01:</b> Delivery on or before September 15, 2026.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Deliverable #02:</b> Delivery on or before September 25, 2026.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Deliverable #03:</b> Delivery on or before October 5, 2026.<br/>"
        "<b>2.3 Distribution Channels:</b> Primary publication on TikTok with secondary cross-posting authorized to Instagram Reels.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 3
    story.append(Paragraph("SECTION 3: COMPENSATION & MILESTONE DISBURSEMENTS", section_header))
    story.append(Paragraph(
        "<b>3.1 Total Compensation:</b> The Brand agrees to pay the Creator a fixed project compensation of <b>₦300,000 NGN</b> (Three Hundred Thousand Nigerian Naira).<br/>"
        "<b>3.2 Payment Milestones:</b><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Milestone 1 (50%):</b> ₦150,000 NGN upfront commitment deposit upon mutual execution.<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Milestone 2 (50%):</b> ₦150,000 NGN payable upon final delivery and client approval of all 3 video deliverables.<br/>"
        "<b>3.3 Payment Terms:</b> Net-7 business days following milestone sign-off via verified electronic bank transfer.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 4
    story.append(Paragraph("SECTION 4: REVISIONS & CHANGE REQUEST GOVERNANCE", section_header))
    story.append(Paragraph(
        "<b>4.1 Included Revisions:</b> Exactly <b>1 complimentary round of revisions</b> is included per deliverable, provided feedback is submitted within 48 hours of draft receipt.<br/>"
        "<b>4.2 Additional Revisions:</b> Subsequent creative revision rounds requested by Brand shall be billed at <b>₦35,000 NGN</b> per round via an approved Change Request.<br/>"
        "<b>4.3 Out-of-Scope Requests:</b> Any additional deliverables or format variations (including YouTube Shorts cutdowns, horizontal cutdowns, raw footage dumps, or podcast interviews) not listed in Section 2.1 constitute scope changes requiring mutual agreement and additional fee settlement.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 5
    story.append(Paragraph("SECTION 5: COMMERCIAL LICENSING & USAGE RIGHTS", section_header))
    story.append(Paragraph(
        "<b>5.1 Organic Usage:</b> Creator grants Brand a non-exclusive, worldwide organic license to feature the content across TikTok and Instagram for <b>30 days</b> from first posting.<br/>"
        "<b>5.2 Paid Advertising Restrictions:</b> Paid promotional usage (including Meta Dark Posts, TikTok Spark Ads, or paid programmatic ads) is strictly barred under baseline terms.<br/>"
        "<b>5.3 Commercial License Extensions:</b> Paid advertising rights can be acquired via commercial renewal extension at <b>₦120,000 NGN</b> per additional 30-day window.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 6
    story.append(Paragraph("SECTION 6: EXCLUSIVITY & RESTRICTIONS", section_header))
    story.append(Paragraph(
        "<b>6.1 Exclusivity:</b> Category exclusivity for ready-to-drink coffee and beverage brands for the 30-day active campaign window.<br/>"
        "<b>6.2 Territory:</b> Worldwide rights across designated social platforms.",
        body_style
    ))
    story.append(Spacer(1, 14))

    # Signatures
    sig_data = [
        [
            Paragraph("<b>FOR BRAND:</b><br/><br/>___________________________<br/>Nescafe Coffee Nigeria Ltd.<br/>Date: September 1, 2026", body_style),
            Paragraph("<b>FOR CREATOR:</b><br/><br/>___________________________<br/>Amaka Moyinlola<br/>Date: September 1, 2026", body_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[260, 260])
    sig_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor("#D4D4D8")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(sig_table)

    doc.build(story)
    print(f"Successfully generated PDF: {output_path}")

if __name__ == "__main__":
    generate_pdf("sample_agreement.pdf")
    os.makedirs("frontend/public", exist_ok=True)
    generate_pdf("frontend/public/sample_agreement.pdf")
