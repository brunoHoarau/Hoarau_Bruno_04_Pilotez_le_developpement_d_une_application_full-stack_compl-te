
export function formaterTaille(octets: number) {
    if (octets >= 1e9) return (octets / 1e9).toFixed(2) + ' Go';
    if (octets >= 1e6) return (octets / 1e6).toFixed(2) + ' Mo';
    return octets + ' octets';
}
