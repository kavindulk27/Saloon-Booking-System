import { jsPDF } from 'jspdf';
import { formatPrice, formatDate } from './helpers';
import type { Appointment } from '../types';

export const generateReceipt = (appointment: Appointment) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5' // Compact receipt size
    });

    // Colors
    const gold = [212, 175, 55];
    const dark = [26, 26, 26];

    // Background for header
    doc.setFillColor(dark[0], dark[1], dark[2]);
    doc.rect(0, 0, 148, 40, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('serif', 'bold');
    doc.setFontSize(22);
    doc.text('GLAMOUR SALOON', 74, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text('OFFICIAL TREATMENT RECEIPT', 74, 28, { align: 'center' });

    // Divider
    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 128, 45);

    // Booking Details Section
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    let y = 55;
    const drawRow = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 60, y);
        y += 8;
    };

    drawRow('Booking ID:', appointment.id);
    drawRow('Date:', formatDate(appointment.date));
    drawRow('Time Slot:', appointment.timeSlot);
    drawRow('Customer:', appointment.customerName || 'Customer');
    drawRow('Artist:', appointment.staffName || 'Assistant');

    y += 4;
    doc.line(20, y, 128, y);
    y += 10;

    // Service & Price
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(appointment.serviceName, 20, y);
    doc.text(formatPrice(appointment.servicePrice), 128, y, { align: 'right' });

    y += 15;

    // Total Box
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y, 108, 15, 'F');
    doc.setFontSize(12);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.text('TOTAL AMOUNT PAID', 25, y + 10);
    doc.setFontSize(14);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(formatPrice(appointment.servicePrice), 123, y + 10, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Glamour Saloon.', 74, 180, { align: 'center' });
    doc.text('Colombo 03, Sri Lanka | +94 11 234 5678', 74, 185, { align: 'center' });
    doc.text('www.glamoursaloon.lk', 74, 190, { align: 'center' });

    // Save the PDF
    doc.save(`Receipt-${appointment.id}.pdf`);
};
