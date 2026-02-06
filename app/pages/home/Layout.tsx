import { Outlet } from "react-router-dom";
import { useOrderlyConfig } from "@/utils/config";
import { Scaffold } from "@/components/ui-scaffold";
import { useNav } from "@/hooks/useNav";

export default function HomeLayout() {
    const config = useOrderlyConfig();
    const { onRouteChange } = useNav();

    return (
        <Scaffold
            classNames={{
                topNavbar: "oui-hidden",
                footer: "oui-hidden",
            }}
            mainNavProps={{
                ...config.scaffold.mainNavProps,
                initialMenu: "/home",
            }}
            footerProps={config.scaffold.footerProps}
            routerAdapter={{
                onRouteChange,
            }}
            bottomNavProps={config.scaffold.bottomNavProps}
        >
            <Outlet />
        </Scaffold>
    );
}
