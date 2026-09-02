// src/common/utils/time.utils.ts

export function getTimeRemaining(expiresAt: Date | string | null): string {
    if (!expiresAt) {
        return 'Aucune expiration';
    }

    const remainingMs =
        new Date(expiresAt).getTime() - Date.now();

    if (remainingMs <= 0) {
        return "Expiré";
    }

    const minutes = Math.floor(remainingMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `Expire dans ${days} jour${days > 1 ? "s" : ""}`;
    }

    if (hours > 0) {
        return `Expire dans ${hours} heure${hours > 1 ? "s" : ""}`;
    }

    return `Expire dans ${minutes} minute${minutes > 1 ? "s" : ""}`;
}