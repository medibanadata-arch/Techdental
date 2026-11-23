/**
 * Real-time Branch Operating Hours & Open Status Utility
 * Accurately determines if a branch is currently "Open Now", "Open Soon", or "Closed"
 * based on real-time clock and branch schedules.
 */

export interface BranchTimeInfo {
    id?: string | number;
    name?: string;
    shortName?: string;
    slug?: string;
    time?: string;
    hours_text?: string;
    hoursText?: string;
}

export interface BranchStatusResult {
    isOpenNow: boolean;
    isOpenSoon: boolean;
    isClosed: boolean;
    isFriday: boolean;
    statusText: string;
    subText: string;
    badgeColor: 'green' | 'amber' | 'gray';
    displayHours: string;
}

export interface BranchShift {
    openMinutes: number;
    closeMinutes: number;
    displayStart: string;
    displayEnd: string;
}

/**
 * Parses time tokens like "10 AM", "10.00 AM", "03.00 PM", "3 PM", "9:00 PM" into minutes from midnight (0-1439).
 */
export function parseTimeToMinutes(token: string): number | null {
    if (!token) return null;
    const match = token.trim().match(/(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM)?/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const meridian = match[3] ? match[3].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) {
        hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes;
}

/**
 * Parses all shifts/operating windows from hours string.
 * Supports split shifts such as:
 * "Morning: 10:00 AM – 2:00 PM | Evening: 4:00 PM – 9:00 PM"
 */
export function parseAllBranchShifts(hoursString?: string, branchIdentifier?: string): {
    shifts: BranchShift[];
    displayHours: string;
} {
    const isMirpur = String(branchIdentifier || '').toLowerCase().includes('mirpur');

    const formatTime = (mins: number) => {
        const h24 = Math.floor(mins / 60);
        const m = mins % 60;
        const meridian = h24 >= 12 ? 'PM' : 'AM';
        let h12 = h24 % 12;
        if (h12 === 0) h12 = 12;
        const mStr = m === 0 ? '' : `:${m < 10 ? '0' + m : m}`;
        return `${h12}${mStr} ${meridian}`;
    };

    if (!hoursString || typeof hoursString !== 'string') {
        const defaultShifts: BranchShift[] = isMirpur
            ? [
                { openMinutes: 600, closeMinutes: 840, displayStart: '10 AM', displayEnd: '2 PM' },
                { openMinutes: 960, closeMinutes: 1260, displayStart: '4 PM', displayEnd: '9 PM' }
              ]
            : [
                { openMinutes: 900, closeMinutes: 1260, displayStart: '3 PM', displayEnd: '9 PM' }
              ];
        const defaultDisplay = isMirpur ? '10 AM – 2 PM | 4 PM – 9 PM' : '3 PM – 9 PM';
        return { shifts: defaultShifts, displayHours: defaultDisplay };
    }

    const rangeRegex = /(\d{1,2}(?:[:.]\d{2})?\s*(?:AM|PM)?)\s*[-–—to]+\s*(\d{1,2}(?:[:.]\d{2})?\s*(?:AM|PM)?)/gi;
    const matches = Array.from(hoursString.matchAll(rangeRegex));
    const shifts: BranchShift[] = [];

    for (const match of matches) {
        let startMins = parseTimeToMinutes(match[1]);
        let endMins = parseTimeToMinutes(match[2]);

        if (startMins !== null && endMins !== null) {
            // Contextually deduce AM/PM if missing on start:
            if (!match[1].match(/AM|PM/i) && match[2].match(/PM/i)) {
                if (startMins < 12 * 60 && startMins >= 8 * 60) {
                    // Morning e.g. 10 AM
                } else if (startMins < 8 * 60) {
                    // Afternoon e.g. 3 PM, 4 PM
                    startMins += 12 * 60;
                }
            }

            shifts.push({
                openMinutes: startMins,
                closeMinutes: endMins,
                displayStart: formatTime(startMins),
                displayEnd: formatTime(endMins),
            });
        }
    }

    if (shifts.length === 0) {
        const defaultShifts: BranchShift[] = isMirpur
            ? [
                { openMinutes: 600, closeMinutes: 840, displayStart: '10:00 AM', displayEnd: '2:00 PM' },
                { openMinutes: 960, closeMinutes: 1260, displayStart: '4:00 PM', displayEnd: '9:00 PM' }
              ]
            : [
                { openMinutes: 900, closeMinutes: 1260, displayStart: '3:00 PM', displayEnd: '9:00 PM' }
              ];
        const defaultDisplay = isMirpur ? '10:00 AM – 2:00 PM | 4:00 PM – 9:00 PM' : '3:00 PM – 9:00 PM';
        return { shifts: defaultShifts, displayHours: defaultDisplay };
    }

    // Sort shifts chronologically by openMinutes
    shifts.sort((a, b) => a.openMinutes - b.openMinutes);

    const displayHours = shifts.map(s => `${s.displayStart} – ${s.displayEnd}`).join(' | ');
    return { shifts, displayHours };
}

/**
 * Extracts openMinutes and closeMinutes from a schedule string.
 */
export function parseBranchHours(hoursString?: string, branchIdentifier?: string): {
    openMinutes: number;
    closeMinutes: number;
    displayHours: string;
} {
    const { shifts, displayHours } = parseAllBranchShifts(hoursString, branchIdentifier);
    const first = shifts[0] || { openMinutes: 600, closeMinutes: 1260 };
    const last = shifts[shifts.length - 1] || first;
    return {
        openMinutes: first.openMinutes,
        closeMinutes: last.closeMinutes,
        displayHours,
    };
}

/**
 * Calculates whether a branch is open in real-time.
 */
export function getBranchStatus(branch: BranchTimeInfo, customDate?: Date): BranchStatusResult {
    const now = customDate || new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const hoursRaw = branch.time || branch.hours_text || branch.hoursText || '';
    const branchName = branch.shortName || branch.name || branch.slug || '';
    const { shifts, displayHours } = parseAllBranchShifts(hoursRaw, branchName);

    // Bangladesh weekly holiday is Friday (all branches closed except pre-scheduled emergencies)
    if (day === 5) {
        return {
            isOpenNow: false,
            isOpenSoon: false,
            isClosed: true,
            isFriday: true,
            statusText: 'Closed Today',
            subText: 'Closed on Fridays (Emergency Only)',
            badgeColor: 'gray',
            displayHours,
        };
    }

    // Saturday through Thursday operating days:
    // 1. Check if currently inside any active shift
    const activeShift = shifts.find(s => currentMinutes >= s.openMinutes && currentMinutes < s.closeMinutes);
    if (activeShift) {
        return {
            isOpenNow: true,
            isOpenSoon: false,
            isClosed: false,
            isFriday: false,
            statusText: 'Open Now',
            subText: `Closes at ${activeShift.displayEnd}`,
            badgeColor: 'green',
            displayHours,
        };
    }

    // 2. Check if there is an upcoming shift later today
    const upcomingShift = shifts.find(s => currentMinutes < s.openMinutes);
    if (upcomingShift) {
        return {
            isOpenNow: false,
            isOpenSoon: true,
            isClosed: false,
            isFriday: false,
            statusText: 'Open Soon',
            subText: `Opens at ${upcomingShift.displayStart}`,
            badgeColor: 'amber',
            displayHours,
        };
    }

    // 3. All shifts for today have finished (after evening shift close time)
    return {
        isOpenNow: false,
        isOpenSoon: false,
        isClosed: true,
        isFriday: false,
        statusText: 'Closed',
        subText: 'Closed for today',
        badgeColor: 'gray',
        displayHours,
    };
}
