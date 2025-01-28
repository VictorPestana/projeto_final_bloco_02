export class NumericTransformer {
    to(data: number): number | null {
        if (data === undefined || data === null) {
            return null;
        }
        return data;
    }

    from(data: string | null): number | null {
        if (data === null || data === undefined) {
            return null;
        }
        const parsed = parseFloat(data);
        return isNaN(parsed) ? null : parsed;
    }
}
