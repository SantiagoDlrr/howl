import type { User } from "@prisma/client";

export const defaultUser: User = {
    id: "",
    name: "",
    email: "",
    emailVerified: null,
    image: null,
    microsoftId: null,
    hashedPassword: null
}