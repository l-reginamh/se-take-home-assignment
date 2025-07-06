type Customer = {
    id: number;
    customerType: 'Regular' | 'VIP';
    status: string;
}

export const regularQueue: Customer[] = [];
export const vipQueue: Customer[] = [];

type Bots = {
    id: number;
    customer: Customer | null;
    timer: number;
}

export const workingBots: Bots[] = [];