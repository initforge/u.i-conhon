/**
 * Fixed Draw Times - Giờ xổ cố định theo SPECS
 * Các giá trị này KHÔNG thể thay đổi từ admin UI
 * Admin chỉ có thể thay đổi giờ đóng tịch (endTime), phải < drawTime
 */

export const DRAW_TIMES: Record<string, string[]> = {
    'thai-an-nhon': ['11:00', '17:00', '21:00'],     // Sáng, Chiều, Tối (Tết)
    'thai-nhon-phong': ['11:00', '17:00'],           // Sáng, Chiều
    'thai-hoai-nhon': ['13:00', '19:00'],            // Trưa, Chiều
};

export const KHUNG_LABELS: Record<string, string[]> = {
    'thai-an-nhon': ['Sáng', 'Chiều', 'Tối'],
    'thai-nhon-phong': ['Sáng', 'Chiều'],
    'thai-hoai-nhon': ['Trưa', 'Chiều'],
};

/**
 * Get draw time for a specific Thai and slot index
 */
export function getDrawTimeForSlot(thaiId: string, slotIndex: number): string {
    const times = DRAW_TIMES[thaiId] || DRAW_TIMES['thai-an-nhon'];
    return times[slotIndex] || '00:00';
}

/**
 * Get khung label for a specific Thai and slot index
 */
export function getKhungLabel(thaiId: string, slotIndex: number): string {
    const labels = KHUNG_LABELS[thaiId] || KHUNG_LABELS['thai-an-nhon'];
    return labels[slotIndex] || `Khung ${slotIndex + 1}`;
}

/**
 * Validate that endTime is before drawTime
 * @returns true if valid, false if invalid
 */
export function validateEndTime(thaiId: string, slotIndex: number, endTime: string): boolean {
    const drawTime = getDrawTimeForSlot(thaiId, slotIndex);
    return endTime < drawTime;
}

/**
 * Get validation error message if endTime is invalid
 */
export function getEndTimeValidationError(thaiId: string, slotIndex: number, endTime: string): string | null {
    const drawTime = getDrawTimeForSlot(thaiId, slotIndex);
    if (endTime >= drawTime) {
        return `Giờ kết thúc phải trước ${drawTime} (giờ xổ)`;
    }
    return null;
}

/**
 * Determine current session status for a Thai
 * Returns: { isOpen, currentKhungIndex, nextOpenTime, closeTime }
 * 
 * IMPORTANT: Only uses first 2 khungs by default.
 * Khung 3 (Tết/evening) is only included when isTetMode = true
 */
export function getSessionStatus(thaiId: string, timeSlots: { startTime: string; endTime: string }[], isTetMode: boolean = false, tetTimeSlot?: { startTime: string; endTime: string }) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Build effective slots: first 2 + optional Tet slot
    const effectiveSlots = timeSlots.slice(0, 2);
    if (isTetMode && tetTimeSlot) {
        effectiveSlots.push(tetTimeSlot);
    }

    // Check each time slot (supports cross-day slots where startTime > endTime)
    for (let i = 0; i < effectiveSlots.length; i++) {
        const slot = effectiveSlots[i];
        const isCrossDay = slot.startTime > slot.endTime;
        const isInSlot = isCrossDay
            ? (currentTime >= slot.startTime || currentTime < slot.endTime)
            : (currentTime >= slot.startTime && currentTime < slot.endTime);
        if (isInSlot) {
            return {
                isOpen: true,
                currentKhungIndex: i,
                khungLabel: getKhungLabel(thaiId, i),
                drawTime: getDrawTimeForSlot(thaiId, i),
                closeTime: slot.endTime,
                nextOpenTime: null,
            };
        }
    }

    // Not in any session - find next open time
    // Sort slots by startTime to handle cross-day slots (e.g. morning starts at 17:30)
    const sortedSlots = effectiveSlots
        .map((slot, i) => ({ ...slot, originalIndex: i }))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    let nextOpenTime: string | null = null;
    let nextKhungIndex = -1;

    for (const slot of sortedSlots) {
        if (currentTime < slot.startTime) {
            nextOpenTime = slot.startTime;
            nextKhungIndex = slot.originalIndex;
            break;
        }
    }

    // If no more sessions today, next is tomorrow's earliest session
    if (!nextOpenTime && sortedSlots.length > 0) {
        nextOpenTime = sortedSlots[0].startTime;
        nextKhungIndex = sortedSlots[0].originalIndex;
    }

    return {
        isOpen: false,
        currentKhungIndex: -1,
        khungLabel: null,
        drawTime: null,
        closeTime: null,
        nextOpenTime,
        nextKhungIndex,
        nextKhungLabel: nextKhungIndex >= 0 ? getKhungLabel(thaiId, nextKhungIndex) : null,
    };
}
