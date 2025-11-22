// Utility for generating professional PDF itineraries with company branding
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateItineraryPDF = async (itinerary, companyName = 'Triponic') => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace = 20) => {
        if (yPos + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

    // Header with company branding
    doc.setFillColor(99, 102, 241); // Indigo color
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, margin, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Travel Partner', margin, 32);

    yPos = 50;

    // Itinerary Title
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const title = itinerary.title || itinerary.destination || 'Travel Itinerary';
    doc.text(title, margin, yPos);
    yPos += 15;

    // Itinerary Details Box
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 30, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // Slate-600

    const details = [
        `📍 Destination: ${itinerary.destination || 'N/A'}`,
        `📅 Duration: ${itinerary.duration || 'N/A'} Days`,
        `👥 Travelers: ${itinerary.travelers || 1}`,
        `💰 Budget: ${itinerary.budget || 'N/A'}`
    ];

    details.forEach((detail, index) => {
        doc.text(detail, margin + 10, yPos + 10 + (index * 6));
    });

    yPos += 40;

    // Summary Section
    const aiData = itinerary.ai_generated_json || {};
    if (aiData.summary) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Trip Overview', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const summaryLines = doc.splitTextToSize(aiData.summary, pageWidth - 2 * margin);
        doc.text(summaryLines, margin, yPos);
        yPos += summaryLines.length * 5 + 10;
    }

    // Day-by-Day Itinerary
    const days = aiData.daily || [];

    if (days.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Day-by-Day Plan', margin, yPos);
        yPos += 10;

        days.forEach((day, index) => {
            checkPageBreak(40);

            // Day Header
            doc.setFillColor(139, 92, 246); // Purple-500
            doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 12, 2, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Day ${day.day}: ${day.title || 'Activities'}`, margin + 5, yPos + 8);
            yPos += 18;

            // Day Content
            doc.setTextColor(71, 85, 105);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const sections = [
                { label: '🌅 Morning', content: day.morning },
                { label: '☀️ Afternoon', content: day.afternoon },
                { label: '🌙 Evening', content: day.evening }
            ];

            sections.forEach(section => {
                if (section.content) {
                    checkPageBreak(15);
                    doc.setFont('helvetica', 'bold');
                    doc.text(section.label, margin + 5, yPos);
                    yPos += 5;

                    doc.setFont('helvetica', 'normal');
                    const contentLines = doc.splitTextToSize(section.content, pageWidth - 2 * margin - 10);
                    doc.text(contentLines, margin + 5, yPos);
                    yPos += contentLines.length * 5 + 3;
                }
            });

            // Activities badges
            if (day.activities && day.activities.length > 0) {
                checkPageBreak(10);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.text('Activities: ' + day.activities.join(', '), margin + 5, yPos);
                yPos += 8;
            }

            yPos += 5; // Space between days
        });
    } else if (itinerary.ai_generated_content) {
        // Fallback to plain text content
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Itinerary Details', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const contentLines = doc.splitTextToSize(itinerary.ai_generated_content, pageWidth - 2 * margin);
        contentLines.forEach(line => {
            checkPageBreak(6);
            doc.text(line, margin, yPos);
            yPos += 5;
        });
    }

    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.setFont('helvetica', 'italic');
        doc.text(
            `Generated by ${companyName} | Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    return doc;
};

export const downloadItineraryPDF = async (itinerary, companyName) => {
    const doc = await generateItineraryPDF(itinerary, companyName);
    const fileName = `${itinerary.destination || 'Itinerary'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
