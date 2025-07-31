import { jsPDF } from 'jspdf'

interface AgreementData {
  startupName: string
  startupRegistration: string
  investorName: string
  investorRegistration: string
  offerAmount: number
  equityPercentage: number
  effectiveDate: string
}

export function generateAgreementPDF(data: AgreementData): Blob {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const lineHeight = 7
  let y = margin

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('SHARE PURCHASE AGREEMENT', pageWidth / 2, y, { align: 'center' })
  y += lineHeight * 2

  // Parties
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Between', pageWidth / 2, y, { align: 'center' })
  y += lineHeight

  doc.setFont('helvetica', 'bold')
  doc.text(data.startupName, pageWidth / 2, y, { align: 'center' })
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  doc.text('(the "Company")', pageWidth / 2, y, { align: 'center' })
  y += lineHeight * 2

  doc.text('And', pageWidth / 2, y, { align: 'center' })
  y += lineHeight

  doc.setFont('helvetica', 'bold')
  doc.text(data.investorName, pageWidth / 2, y, { align: 'center' })
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  doc.text('(the "Investor")', pageWidth / 2, y, { align: 'center' })
  y += lineHeight * 2

  // Introduction
  doc.setFontSize(11)
  const introText = `This Share Purchase Agreement (the "Agreement") is entered into on ${data.effectiveDate} (the "Effective Date") between ${data.startupName}, a company registered in South Africa with registration number ${data.startupRegistration} (the "Company"), and ${data.investorName}, a venture capital firm registered in South Africa with registration number ${data.investorRegistration} (the "Investor").`
  const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin)
  doc.text(introLines, margin, y)
  y += lineHeight * introLines.length + lineHeight

  // Recitals
  doc.setFont('helvetica', 'bold')
  doc.text('RECITALS', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const recitals = [
    'A. The Company is a private company duly incorporated and existing under the laws of South Africa.',
    'B. The Investor is a venture capital firm duly registered and existing under the laws of South Africa.',
    'C. The Company desires to issue and sell to the Investor, and the Investor desires to purchase from the Company, certain shares of the Company\'s ordinary shares.',
    'D. The parties wish to set forth the terms and conditions upon which the Investor will purchase the Shares from the Company.'
  ]

  recitals.forEach(recital => {
    const lines = doc.splitTextToSize(recital, pageWidth - 2 * margin)
    doc.text(lines, margin, y)
    y += lineHeight * lines.length
  })
  y += lineHeight

  // Share Purchase
  doc.setFont('helvetica', 'bold')
  doc.text('1. SHARE PURCHASE', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const purchaseText = `Subject to the terms and conditions of this Agreement, the Company agrees to issue and sell to the Investor, and the Investor agrees to purchase from the Company, ${data.equityPercentage}% of the Company's ordinary shares (the "Shares") for a total purchase price of R${data.offerAmount.toLocaleString()} (the "Purchase Price").`
  const purchaseLines = doc.splitTextToSize(purchaseText, pageWidth - 2 * margin)
  doc.text(purchaseLines, margin, y)
  y += lineHeight * purchaseLines.length + lineHeight

  // Closing
  doc.setFont('helvetica', 'bold')
  doc.text('2. CLOSING', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const closingText = 'The purchase and sale of the Shares shall take place at a closing (the "Closing") to be held remotely via electronic exchange of documents and signatures on a date to be determined by the parties, but no later than 30 days after the Effective Date.'
  const closingLines = doc.splitTextToSize(closingText, pageWidth - 2 * margin)
  doc.text(closingLines, margin, y)
  y += lineHeight * closingLines.length + lineHeight

  // Representations and Warranties
  doc.setFont('helvetica', 'bold')
  doc.text('3. REPRESENTATIONS AND WARRANTIES', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const representations = [
    '3.1 Company Representations. The Company represents and warrants to the Investor that:',
    '(a) The Company is duly organized, validly existing, and in good standing under the laws of South Africa.',
    '(b) The Company has all requisite power and authority to carry on its business as presently conducted.',
    '(c) The execution and delivery of this Agreement has been duly authorized by all necessary corporate action.',
    '(d) The Shares, when issued, will be validly issued, fully paid, and non-assessable.',
    '',
    '3.2 Investor Representations. The Investor represents and warrants to the Company that:',
    '(a) The Investor is duly organized, validly existing, and in good standing under the laws of South Africa.',
    '(b) The Investor has all requisite power and authority to execute and deliver this Agreement.',
    '(c) The execution and delivery of this Agreement has been duly authorized by all necessary corporate action.',
    '(d) The Investor has sufficient funds available to pay the Purchase Price.'
  ]

  representations.forEach(rep => {
    const lines = doc.splitTextToSize(rep, pageWidth - 2 * margin)
    doc.text(lines, margin, y)
    y += lineHeight * lines.length
  })
  y += lineHeight

  // Conditions to Closing
  doc.setFont('helvetica', 'bold')
  doc.text('4. CONDITIONS TO CLOSING', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const conditions = [
    '4.1 Investor Conditions. The obligations of the Investor to purchase the Shares at the Closing are subject to the fulfillment on or before the Closing of each of the following conditions, unless waived by the Investor:',
    '(a) The representations and warranties of the Company shall be true and correct in all material respects.',
    '(b) The Company shall have performed all obligations and conditions required to be performed by it under this Agreement.',
    '(c) No legal proceeding shall be pending or threatened against the Company that would materially affect the Company.',
    '',
    '4.2 Company Conditions. The obligations of the Company to sell the Shares at the Closing are subject to the fulfillment on or before the Closing of each of the following conditions, unless waived by the Company:',
    '(a) The representations and warranties of the Investor shall be true and correct in all material respects.',
    '(b) The Investor shall have performed all obligations and conditions required to be performed by it under this Agreement.',
    '(c) The Investor shall have delivered the Purchase Price to the Company.'
  ]

  conditions.forEach(condition => {
    const lines = doc.splitTextToSize(condition, pageWidth - 2 * margin)
    doc.text(lines, margin, y)
    y += lineHeight * lines.length
  })
  y += lineHeight

  // Covenants
  doc.setFont('helvetica', 'bold')
  doc.text('5. COVENANTS', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const covenants = [
    '5.1 Information Rights. The Company shall provide the Investor with:',
    '(a) Annual audited financial statements within 90 days of the end of each fiscal year.',
    '(b) Quarterly unaudited financial statements within 45 days of the end of each fiscal quarter.',
    '(c) Monthly management accounts within 30 days of the end of each month.',
    '',
    '5.2 Board Rights. The Investor shall have the right to appoint one director to the Company\'s board of directors.',
    '',
    '5.3 Confidentiality. Each party shall maintain the confidentiality of all confidential information received from the other party.'
  ]

  covenants.forEach(covenant => {
    const lines = doc.splitTextToSize(covenant, pageWidth - 2 * margin)
    doc.text(lines, margin, y)
    y += lineHeight * lines.length
  })
  y += lineHeight

  // Miscellaneous
  doc.setFont('helvetica', 'bold')
  doc.text('6. MISCELLANEOUS', margin, y)
  y += lineHeight

  doc.setFont('helvetica', 'normal')
  const miscellaneous = [
    '6.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of South Africa.',
    '',
    '6.2 Entire Agreement. This Agreement constitutes the full and entire understanding and agreement between the parties with respect to the subject matter hereof.',
    '',
    '6.3 Notices. All notices and other communications required or permitted under this Agreement shall be in writing and shall be deemed given when delivered personally or sent by registered or certified mail.',
    '',
    '6.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.',
    '',
    '6.5 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.'
  ]

  miscellaneous.forEach(misc => {
    const lines = doc.splitTextToSize(misc, pageWidth - 2 * margin)
    doc.text(lines, margin, y)
    y += lineHeight * lines.length
  })
  y += lineHeight * 2

  // Signatures
  y += lineHeight * 2
  doc.setFont('helvetica', 'bold')
  doc.text('IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.', margin, y)
  y += lineHeight * 3

  doc.text('For the Company:', margin, y)
  y += lineHeight * 2

  doc.setFont('helvetica', 'normal')
  doc.text('________________________', margin, y)
  y += lineHeight
  doc.text('Authorized Signature', margin, y)
  y += lineHeight
  doc.text(data.startupName, margin, y)
  y += lineHeight * 2

  doc.setFont('helvetica', 'bold')
  doc.text('For the Investor:', margin, y)
  y += lineHeight * 2

  doc.setFont('helvetica', 'normal')
  doc.text('________________________', margin, y)
  y += lineHeight
  doc.text('Authorized Signature', margin, y)
  y += lineHeight
  doc.text(data.investorName, margin, y)

  return doc.output('blob')
} 