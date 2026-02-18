
export type PlanOption = 'A' | 'B' | 'C';

interface FinancingConfig {
    maxInstallments: number;
    minDownPaymentPercent: number;
    // User mentioned "interes que se le aplica a la unidad". 
    // Usually this means a price increase list price vs financed price, or a proper interest.
    // We will start with a configurable multiplier.
}

export function getFinancingRules(
    typologyName: string,
    disposition: string,
    downPaymentPercent: number
): { maxInstallments: number, plan: PlanOption, annualInterest: number } {

    const name = typologyName?.toLowerCase() || '';
    const isMonoambiente = name.includes('mono') || name.includes('studio') || name.includes('1 amb') || name.includes('un ambiente');
    const isInternal = disposition === 'lateral' || disposition === 'back'; // internal/lateral
    const isFront = disposition === 'front';

    // Annual Interest Rates (Placeholder - Configurable)
    const INTEREST_PLAN_A = 0.00; // 0%
    const INTEREST_PLAN_B = 0.00; // 5% example (0.05)
    // const INTEREST_PLAN_C = 0.00; 

    // OPTION A: Down Payment >= 25%
    if (downPaymentPercent >= 25) {
        let max = 60;
        // Exception: Monoambientes max 48
        if (isMonoambiente) {
            max = 48;
        }

        return {
            plan: 'A',
            maxInstallments: max,
            annualInterest: INTEREST_PLAN_A
        };
    }

    // OPTION B: Down Payment < 25% (and >= 10 usually)
    if (downPaymentPercent >= 10 && downPaymentPercent < 25) {
        let max = 84;

        if (isMonoambiente) {
            if (isInternal) max = 60;
            if (isFront) max = 72;
        }

        return {
            plan: 'B',
            maxInstallments: max,
            annualInterest: INTEREST_PLAN_B
        };
    }

    // Fallback or Option C (0% / Low down payment)
    let max = 84;

    // OPCION C: Monoambientes max 72
    if (isMonoambiente) {
        max = 72;
    }

    return {
        plan: 'C',
        maxInstallments: max,
        annualInterest: 0.10 // Example: 10% annual interest for 0% down (Placeholder)
    };
}

export function calculateInstallment(
    price: number,
    downPaymentPercent: number,
    installments: number,
    annualInterest: number
): number {
    const downPayment = price * (downPaymentPercent / 100);
    const financedCapital = price - downPayment;

    if (installments === 0) return 0;

    // Interest Calculation
    // Method: Simple Annual Interest on Financed Capital
    // Total Interest = Capital * AnnualRate * (Months / 12)
    const years = installments / 12;
    const totalInterest = financedCapital * annualInterest * years;

    const totalToPay = financedCapital + totalInterest;

    return totalToPay / installments;
}
