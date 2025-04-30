export interface ClientInput {
    firstname: string;
    lastname: string;
    email: string;
    company_id: number;
}

export const defaultClient: ClientInput = {
    firstname: "",
    lastname: "",
    email: "",
    company_id: -1,
}