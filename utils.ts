export const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // UK Mobile: 07xxx xxx xxx (11 digits)
    if (cleaned.startsWith('07') && cleaned.length <= 11) {
        return cleaned.replace(/(\d{5})(\d{3})(\d{3})/, '$1 $2 $3').trim();
    }

    // UK Landline (London): 020 xxxx xxxx (11 digits)
    if (cleaned.startsWith('02') && cleaned.length <= 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3').trim();
    }

    // Generic sizing for spacing as typing
    if (cleaned.length > 5) {
        return cleaned.replace(/(\d{5})(\d{3})?(\d{3})?/, (match, p1, p2, p3) => {
            return [p1, p2, p3].filter(Boolean).join(' ');
        });
    }

    return cleaned;
};
