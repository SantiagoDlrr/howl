import { LayoutDashboard, Phone, FileText, Brain } from "lucide-react";

export const routes = [
    {
        id: 0,
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isSelected: false
    },
    {
        id: 1,
        label: "Llamadas",
        href: "/main",
        icon: Phone,
        isSelected: false
    },
    {
        id: 2,
        label: "Logs",
        href: "/logs",
        icon: FileText,
        isSelected: false
    },
    {
        id: 3,
        label: "AI Tools",
        href: "/SCD",
        icon: Brain,
        isSelected: false
    }
];