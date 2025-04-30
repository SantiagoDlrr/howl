export interface CompanyInput {
    name: string;
    address: {
        country: string;
        state: string;
        city: string;
        street: string;
    };
    client_since: Date;
}

export const defaultCompany: CompanyInput = {
    name: "",
    address: {
        country: "",
        state: "",
        city: "",
        street: "",
    },
    client_since: new Date(),
}