"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebarShortcuts } from "@/hooks/ui/use-sidebar-shortcuts";
import { cn } from "@/lib/utils";

import {
    Boxes, ChevronLeft, FileText, FolderSync, Home, MapPin, Settings, Truck, User, Warehouse
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

// --------------------
// Types
// --------------------
type MenuItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    tooltip: string;
    shortcut: string;
    children?: MenuItem[];
};

type MenuButtonTooltipProps = {
    item: MenuItem,
    pathname: string,
    open: boolean,
}

// --------------------
// Constants
// --------------------
const menuItems: MenuItem[] = [
    {
        title: "Home",
        url: "/",
        icon: Home,
        tooltip: "Home",
        shortcut: "None",
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: Warehouse,
        tooltip: "Inventory Dashboard",
        shortcut: "None",
        children: [
            { title: "Items", url: "/inventory/items", icon: Boxes, tooltip: "Inventory Items", shortcut: "None" },
            { title: "Locations", url: "/inventory/locations", icon: MapPin, tooltip: "Inventory Locations", shortcut: "None" },
            { title: "Purchase Orders", url: "/inventory/purchase-orders", icon: FileText, tooltip: "Purchase Orders", shortcut: "None" },
            { title: "Movements", url: "/inventory/movements", icon: FolderSync, tooltip: "Inventory Movements", shortcut: "None" },
            { title: "Suppliers", url: "/inventory/suppliers", icon: Truck, tooltip: "Suppliers", shortcut: "None" },
        ]
    },
    { title: "Profile", url: "#", icon: User, tooltip: "Profile", shortcut: "None" },
    { title: "Settings", url: "#", icon: Settings, tooltip: "Settings", shortcut: "None" },
];


// --------------------
// Components
// --------------------
function SidebarHeaderContent() {
    const { state, isMobile } = useSidebar();

    return (
        <div className="text-orange-400 px-2 py-3 font-bold text-xl justify-center">
            {isMobile || state !== "collapsed" ? "BEEHIVE" : <Home className="w-6 h-6" />}
        </div>
    );
}

function SidebarCollapseButton() {
    const { open, toggleSidebar } = useSidebar();

    const button = (
        <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
                "flex items-center rounded-md py-2 hover:bg-muted transition-all",
                open ? "justify-start gap-2 w-full px-2" : "justify-center"
            )}
        >
            <ChevronLeft className={cn("h-6 w-6 transition-transform", !open && "rotate-180")} />
            {open && <span>Collapse</span>}
        </button>
    );

    if (!open) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">
                    Expand sidebar <span className="ml-2 text-xs opacity-60">Ctrl+B</span>
                </TooltipContent>
            </Tooltip>
        );
    }

    return button;
}

function MenuButton({ item, pathname, open }: MenuButtonTooltipProps) {
    const content = (
        <SidebarMenuButton
            asChild
            data-active={pathname === item.url}
            className="data-[active=true]:bg-orange-300 data-[active=true]:font-medium data-[active=true]:shadow-md hover:bg-orange-200"
        >
            <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
            </Link>
        </SidebarMenuButton>
    );

    if (!open) {
        return (
            <Tooltip>
                <TooltipTrigger>{content}</TooltipTrigger>
                <TooltipContent side="right">
                    {item.tooltip} <span className="ml-2 text-xs opacity-60">{item.shortcut}</span>
                </TooltipContent>
            </Tooltip>
        );
    }

    return content;
}

// --------------------
// Main Sidebar
// --------------------
export function AppSidebar() {
    const { state, open } = useSidebar();
    const pathname = usePathname();

    useSidebarShortcuts();

    const childClassName = cn("mt-1 w-auto", state !== "collapsed" && "ml-4");

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex items-center justify-center h-12">
                <SidebarHeaderContent />
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <MenuButton item={item} pathname={pathname} open={open} />
                                    {item.children && (
                                        <SidebarMenu className={childClassName}>
                                            {item.children.map((child) => (
                                                <SidebarMenuItem key={child.title}>
                                                    <MenuButton item={child} pathname={pathname} open={open} />
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarCollapseButton />
            </SidebarFooter>
        </Sidebar>
    );
}