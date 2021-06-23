/** @todo - this needs to consider the mode etc. See skulpt and cpython */
export function parseString(s: string) {
    const quote = s[0];
    if (quote === '"' || quote === "'") {
        return s.slice(1, -1);
    }
    return s;
}
