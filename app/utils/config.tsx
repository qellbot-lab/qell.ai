import { useMemo } from "react";
import { useTranslation } from "@/components/i18n";
import { TradingPageProps } from "@/components/trading";
import { BottomNavProps, FooterProps, MainNavWidgetProps } from "@/components/ui-scaffold";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import { withBasePath } from "./base-path";
import { PortfolioActiveIcon, PortfolioInactiveIcon, TradingActiveIcon, TradingInactiveIcon, LeaderboardActiveIcon, LeaderboardInactiveIcon, MarketsActiveIcon, MarketsInactiveIcon, useScreen, Flex, cn } from "@/components/ui";
import { getRuntimeConfig, getRuntimeConfigBoolean, getRuntimeConfigNumber } from "./runtime-config";
import { Link } from "react-router-dom";
import CustomLeftNav from "@/components/CustomLeftNav";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTheme } from "@/hooks/useTheme";

interface MainNavItem {
  name: string;
  href: string;
  target?: string;
}

interface ColorConfigInterface {
  upColor?: string;
  downColor?: string;
  pnlUpColor?: string;
  pnlDownColor?: string;
  chartBG?: string;
}

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
    bottomNavProps: BottomNavProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

const ALL_MENU_ITEMS = [
  { name: "Home", href: "/", translationKey: "common.trading" },
  { name: "Trading", href: "/", translationKey: "common.trading" },
  { name: "Portfolio", href: "/portfolio", translationKey: "common.portfolio" },
  { name: "Markets", href: "/markets", translationKey: "common.markets" },
  // { name: "Rewards", href: "/rewards", translationKey: "tradingRewards.rewards" },
  { name: "Leaderboard", href: "/leaderboard", translationKey: "tradingLeaderboard.leaderboard" },
  // { name: "Vaults", href: "/vaults", translationKey: "common.vaults" },
  { name: "Swap", href: "/swap", translationKey: "Swap" },
];

const DEFAULT_ENABLED_MENUS = [
  { name: "Home", href: "/", translationKey: "common.trading" },
  { name: "Trading", href: "/", translationKey: "common.trading" },
  { name: "Portfolio", href: "/portfolio", translationKey: "common.portfolio" },
  { name: "Markets", href: "/markets", translationKey: "common.markets" },
  { name: "Leaderboard", href: "/leaderboard", translationKey: "tradingLeaderboard.leaderboard" },
  { name: "Swap", href: "/swap", translationKey: "Swap" },
];

const getCustomMenuItems = (): MainNavItem[] => {
  const customMenusEnv = getRuntimeConfig('VITE_CUSTOM_MENUS');

  if (!customMenusEnv || typeof customMenusEnv !== 'string' || customMenusEnv.trim() === '') {
    return [];
  }

  try {
    // Parse delimiter-separated menu items
    // Expected format: "Documentation,https://docs.example.com;Blog,https://blog.example.com;Support,https://support.example.com"
    const menuPairs = customMenusEnv.split(';').map(pair => pair.trim()).filter(pair => pair.length > 0);

    const validCustomMenus: MainNavItem[] = [];

    for (const pair of menuPairs) {
      const [name, href] = pair.split(',').map(item => item.trim());

      if (!name || !href) {
        console.warn("Invalid custom menu item format. Expected 'name,url':", pair);
        continue;
      }

      validCustomMenus.push({
        name,
        href,
        target: "_blank",
      });
    }

    return validCustomMenus;
  } catch (e) {
    console.warn("Error parsing VITE_CUSTOM_MENUS:", e);
    return [];
  }
};

const getEnabledMenus = () => {
  const enabledMenusEnv = getRuntimeConfig('VITE_ENABLED_MENUS');

  if (!enabledMenusEnv || typeof enabledMenusEnv !== 'string' || enabledMenusEnv.trim() === '') {
    return DEFAULT_ENABLED_MENUS;
  }

  try {
    const enabledMenuNames = enabledMenusEnv.split(',').map(name => name.trim());

    const enabledMenus = [];
    for (const menuName of enabledMenuNames) {
      const menuItem = ALL_MENU_ITEMS.find(item => item.name === menuName);
      if (menuItem) {
        enabledMenus.push(menuItem);
      }
    }

    return enabledMenus.length > 0 ? enabledMenus : DEFAULT_ENABLED_MENUS;
  } catch (e) {
    console.warn("Error parsing VITE_ENABLED_MENUS:", e);
    return DEFAULT_ENABLED_MENUS;
  }
};

const getPnLBackgroundImages = (): string[] => {
  const useCustomPnL = getRuntimeConfigBoolean('VITE_USE_CUSTOM_PNL_POSTERS');

  if (useCustomPnL) {
    const customPnLCount = getRuntimeConfigNumber('VITE_CUSTOM_PNL_POSTER_COUNT');

    if (isNaN(customPnLCount) || customPnLCount < 1) {
      return [
        withBasePath("/pnl/poster_bg_1.png"),
        withBasePath("/pnl/poster_bg_2.png"),
        withBasePath("/pnl/poster_bg_3.png"),
        withBasePath("/pnl/poster_bg_4.png"),
      ];
    }

    const customPosters: string[] = [];
    for (let i = 1; i <= customPnLCount; i++) {
      customPosters.push(withBasePath(`/pnl/poster_bg_${i}.webp`));
    }

    return customPosters;
  }

  return [
    withBasePath("/pnl/poster_bg_1.png"),
    withBasePath("/pnl/poster_bg_2.png"),
    withBasePath("/pnl/poster_bg_3.png"),
    withBasePath("/pnl/poster_bg_4.png"),
  ];
};

const getBottomNavIcon = (menuName: string) => {
  switch (menuName) {
    case "Trading":
      return { activeIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7002 13C15.8836 13 16.0506 13.0642 16.1855 13.168C16.1999 13.179 16.2138 13.191 16.2275 13.2031C16.2512 13.2241 16.2739 13.2459 16.2949 13.2695C16.3111 13.2876 16.3266 13.3061 16.3408 13.3252C16.4395 13.4582 16.5 13.6215 16.5 13.7998C16.5 13.8474 16.4953 13.8941 16.4873 13.9395C16.4602 14.0964 16.3868 14.2469 16.2656 14.3682L14.5684 16.0654C14.256 16.3777 13.7499 16.3777 13.4375 16.0654C13.1252 15.753 13.1252 15.247 13.4375 14.9346L13.7725 14.5996H8.7998C8.35807 14.5995 8.00001 14.2416 8 13.7998C8.00012 13.3581 8.35814 13.0001 8.7998 13H15.7002ZM9.93164 8.23438C10.244 7.92209 10.7501 7.92208 11.0625 8.23438C11.3749 8.54676 11.3748 9.05281 11.0625 9.36523L10.7275 9.7002H15.7002C16.1419 9.7003 16.5 10.0582 16.5 10.5C16.5 10.9418 16.1419 11.2997 15.7002 11.2998H8.7998C8.6164 11.2998 8.44937 11.2357 8.31445 11.1318C8.30004 11.1208 8.28627 11.1089 8.27246 11.0967C8.24873 11.0757 8.22617 11.0539 8.20508 11.0303C8.18884 11.0122 8.17348 10.9937 8.15918 10.9746C8.06049 10.8416 8 10.6784 8 10.5C8 10.4523 8.0047 10.4057 8.0127 10.3604C8.03982 10.2033 8.11318 10.0529 8.23438 9.93164L9.93164 8.23438Z" fill="#ffffff"/>
          <circle cx="12" cy="12" r="9.5" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
        , inactiveIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7002 13C15.8836 13 16.0506 13.0642 16.1855 13.168C16.1999 13.179 16.2138 13.191 16.2275 13.2031C16.2512 13.2241 16.2739 13.2459 16.2949 13.2695C16.3111 13.2876 16.3266 13.3061 16.3408 13.3252C16.4395 13.4582 16.5 13.6215 16.5 13.7998C16.5 13.8474 16.4953 13.8941 16.4873 13.9395C16.4602 14.0964 16.3868 14.2469 16.2656 14.3682L14.5684 16.0654C14.256 16.3777 13.7499 16.3777 13.4375 16.0654C13.1252 15.753 13.1252 15.247 13.4375 14.9346L13.7725 14.5996H8.7998C8.35807 14.5995 8.00001 14.2416 8 13.7998C8.00012 13.3581 8.35814 13.0001 8.7998 13H15.7002ZM9.93164 8.23438C10.244 7.92209 10.7501 7.92208 11.0625 8.23438C11.3749 8.54676 11.3748 9.05281 11.0625 9.36523L10.7275 9.7002H15.7002C16.1419 9.7003 16.5 10.0582 16.5 10.5C16.5 10.9418 16.1419 11.2997 15.7002 11.2998H8.7998C8.6164 11.2998 8.44937 11.2357 8.31445 11.1318C8.30004 11.1208 8.28627 11.1089 8.27246 11.0967C8.24873 11.0757 8.22617 11.0539 8.20508 11.0303C8.18884 11.0122 8.17348 10.9937 8.15918 10.9746C8.06049 10.8416 8 10.6784 8 10.5C8 10.4523 8.0047 10.4057 8.0127 10.3604C8.03982 10.2033 8.11318 10.0529 8.23438 9.93164L9.93164 8.23438Z" fill="#94969C"/>
          <circle cx="12" cy="12" r="9.5" stroke="#94969C" stroke-width="2"/>
        </svg> 
        };
    case "Portfolio":
      return { activeIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7906 14.4464C15.0255 13.6812 14.1343 13.0805 13.1419 12.6607C13.0404 12.6177 12.938 12.5775 12.8353 12.5388C14.1632 11.5832 15.028 10.0245 15.028 8.26362C15.028 5.35659 12.6714 3 9.76443 3C6.8574 3 4.50081 5.35659 4.50081 8.26362C4.50081 10.0662 5.40714 11.6569 6.78876 12.6056C6.74371 12.6237 6.69862 12.6418 6.6538 12.6607C5.66134 13.0805 4.77018 13.6813 4.00506 14.4464C3.23994 15.2115 2.63917 16.1026 2.2194 17.0951C1.78464 18.123 1.56421 19.2145 1.56421 20.3392C1.56421 20.7428 1.8914 21.07 2.29501 21.07C2.69863 21.07 3.02582 20.7428 3.02582 20.3392C3.02582 16.7766 5.75083 13.8389 9.22588 13.5C9.62284 13.5403 10.0231 13.5359 10.419 13.4867C13.9657 13.7539 16.7699 16.7252 16.7699 20.3391C16.7699 20.7428 17.0971 21.0699 17.5007 21.0699C17.9043 21.0699 18.2316 20.7428 18.2316 20.3391C18.2316 19.2144 18.0111 18.123 17.5763 17.0951C17.1565 16.1026 16.5557 15.2115 15.7906 14.4464ZM6.00109 8.26359C6.00109 6.18516 7.68599 4.50026 9.76443 4.50026C11.8429 4.50026 13.5277 6.18518 13.5277 8.26359C13.5277 10.2177 12.0383 11.8238 10.1328 12.009C10.0545 12.0067 9.97617 12.0056 9.89783 12.0055C9.75632 12.0055 9.61534 12.009 9.47495 12.016C7.53177 11.8682 6.00109 10.2446 6.00109 8.26359Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.5"/>
          <path d="M19.7894 12.5149C20.536 11.8294 21.0049 10.8459 21.0049 9.75475C21.0049 7.6884 19.3238 6.00732 17.2575 6.00732C16.8447 6.00732 16.5101 6.34194 16.5101 6.75475C16.5101 7.16755 16.8447 7.50217 17.2575 7.50217C18.4996 7.50217 19.51 8.51268 19.51 9.75475C19.51 10.9968 18.4996 12.0073 17.2575 12.0073C16.8447 12.0073 16.5101 12.3419 16.5101 12.7547C16.5101 13.1676 16.8447 13.5022 17.2575 13.5022C17.3429 13.5022 17.4275 13.499 17.5115 13.4934C17.5489 13.4991 17.5872 13.5022 17.6263 13.5022C19.4879 13.5022 21.0025 15.0167 21.0025 16.8784C21.0025 17.2912 21.3371 17.6258 21.7499 17.6258C22.1627 17.6258 22.4973 17.2912 22.4973 16.8784C22.4973 14.969 21.3929 13.313 19.7894 12.5149Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.5"/>
        </svg> 
      , inactiveIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7906 14.4464C15.0255 13.6812 14.1343 13.0805 13.1419 12.6607C13.0404 12.6177 12.938 12.5775 12.8353 12.5388C14.1632 11.5832 15.028 10.0245 15.028 8.26362C15.028 5.35659 12.6714 3 9.76443 3C6.8574 3 4.50081 5.35659 4.50081 8.26362C4.50081 10.0662 5.40714 11.6569 6.78876 12.6056C6.74371 12.6237 6.69862 12.6418 6.6538 12.6607C5.66134 13.0805 4.77018 13.6813 4.00506 14.4464C3.23994 15.2115 2.63917 16.1026 2.2194 17.0951C1.78464 18.123 1.56421 19.2145 1.56421 20.3392C1.56421 20.7428 1.8914 21.07 2.29501 21.07C2.69863 21.07 3.02582 20.7428 3.02582 20.3392C3.02582 16.7766 5.75083 13.8389 9.22588 13.5C9.62284 13.5403 10.0231 13.5359 10.419 13.4867C13.9657 13.7539 16.7699 16.7252 16.7699 20.3391C16.7699 20.7428 17.0971 21.0699 17.5007 21.0699C17.9043 21.0699 18.2316 20.7428 18.2316 20.3391C18.2316 19.2144 18.0111 18.123 17.5763 17.0951C17.1565 16.1026 16.5557 15.2115 15.7906 14.4464ZM6.00109 8.26359C6.00109 6.18516 7.68599 4.50026 9.76443 4.50026C11.8429 4.50026 13.5277 6.18518 13.5277 8.26359C13.5277 10.2177 12.0383 11.8238 10.1328 12.009C10.0545 12.0067 9.97617 12.0056 9.89783 12.0055C9.75632 12.0055 9.61534 12.009 9.47495 12.016C7.53177 11.8682 6.00109 10.2446 6.00109 8.26359Z" fill="#94969C" stroke="#94969C" stroke-width="0.5"/>
          <path d="M19.7894 12.5149C20.536 11.8294 21.0049 10.8459 21.0049 9.75475C21.0049 7.6884 19.3238 6.00732 17.2575 6.00732C16.8447 6.00732 16.5101 6.34194 16.5101 6.75475C16.5101 7.16755 16.8447 7.50217 17.2575 7.50217C18.4996 7.50217 19.51 8.51268 19.51 9.75475C19.51 10.9968 18.4996 12.0073 17.2575 12.0073C16.8447 12.0073 16.5101 12.3419 16.5101 12.7547C16.5101 13.1676 16.8447 13.5022 17.2575 13.5022C17.3429 13.5022 17.4275 13.499 17.5115 13.4934C17.5489 13.4991 17.5872 13.5022 17.6263 13.5022C19.4879 13.5022 21.0025 15.0167 21.0025 16.8784C21.0025 17.2912 21.3371 17.6258 21.7499 17.6258C22.1627 17.6258 22.4973 17.2912 22.4973 16.8784C22.4973 14.969 21.3929 13.313 19.7894 12.5149Z" fill="#94969C" stroke="#94969C" stroke-width="0.5"/>
        </svg> 
        };
    case "Leaderboard":
      return { activeIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.264 3.4099C17.7402 3.45891 18.1812 3.68276 18.5019 4.03815C18.8226 4.39354 19 4.85523 19 5.3339V6.3999H20.302C21.24 6.3999 22 7.1599 22 8.0999V9.6499C21.9999 10.5923 21.6669 11.5044 21.0598 12.2253C20.4528 12.9461 19.6106 13.4294 18.682 13.5899C18.2869 14.8496 17.5438 15.972 16.5386 16.8278C15.5333 17.6836 14.3066 18.2379 13 18.4269V20.6499H16.5L16.602 20.6549C16.8487 20.6797 17.0774 20.7952 17.2437 20.979C17.41 21.1629 17.5021 21.402 17.5021 21.6499C17.5021 21.8978 17.41 22.1369 17.2437 22.3208C17.0774 22.5046 16.8487 22.6201 16.602 22.6449L16.5 22.6499H7.5C7.23481 22.6499 6.98049 22.5445 6.79299 22.357C6.60549 22.1694 6.50015 21.9151 6.50015 21.6499C6.50015 21.3847 6.60549 21.1304 6.79299 20.9428C6.98049 20.7553 7.23481 20.6499 7.5 20.6499H11V18.4269C9.69324 18.238 8.46644 17.6837 7.46098 16.8279C6.45552 15.9721 5.71231 14.8497 5.317 13.5899C4.38862 13.429 3.54683 12.9456 2.94001 12.2248C2.33319 11.504 2.0003 10.5921 2 9.6499V8.0999C2 7.1599 2.76 6.3999 3.698 6.3999H5V5.3339C5 4.2659 5.866 3.4009 6.934 3.3999H17.066L17.264 3.4099ZM7 11.4999C7 12.826 7.52678 14.0978 8.46447 15.0354C9.40215 15.9731 10.6739 16.4999 12 16.4999C13.3261 16.4999 14.5979 15.9731 15.5355 15.0354C16.4732 14.0978 17 12.826 17 11.4999V5.3999H7V11.4999ZM4 9.6499C4 10.3899 4.403 11.0339 5 11.3799V8.3999H4V9.6499ZM19 11.3799C19.597 11.0339 20 10.3899 20 9.6499V8.3999H19V11.3799Z" fill="#FFFFFF"/>
        </svg>

        , inactiveIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.264 3.4099C17.7402 3.45891 18.1812 3.68276 18.5019 4.03815C18.8226 4.39354 19 4.85523 19 5.3339V6.3999H20.302C21.24 6.3999 22 7.1599 22 8.0999V9.6499C21.9999 10.5923 21.6669 11.5044 21.0598 12.2253C20.4528 12.9461 19.6106 13.4294 18.682 13.5899C18.2869 14.8496 17.5438 15.972 16.5386 16.8278C15.5333 17.6836 14.3066 18.2379 13 18.4269V20.6499H16.5L16.602 20.6549C16.8487 20.6797 17.0774 20.7952 17.2437 20.979C17.41 21.1629 17.5021 21.402 17.5021 21.6499C17.5021 21.8978 17.41 22.1369 17.2437 22.3208C17.0774 22.5046 16.8487 22.6201 16.602 22.6449L16.5 22.6499H7.5C7.23481 22.6499 6.98049 22.5445 6.79299 22.357C6.60549 22.1694 6.50015 21.9151 6.50015 21.6499C6.50015 21.3847 6.60549 21.1304 6.79299 20.9428C6.98049 20.7553 7.23481 20.6499 7.5 20.6499H11V18.4269C9.69324 18.238 8.46644 17.6837 7.46098 16.8279C6.45552 15.9721 5.71231 14.8497 5.317 13.5899C4.38862 13.429 3.54683 12.9456 2.94001 12.2248C2.33319 11.504 2.0003 10.5921 2 9.6499V8.0999C2 7.1599 2.76 6.3999 3.698 6.3999H5V5.3339C5 4.2659 5.866 3.4009 6.934 3.3999H17.066L17.264 3.4099ZM7 11.4999C7 12.826 7.52678 14.0978 8.46447 15.0354C9.40215 15.9731 10.6739 16.4999 12 16.4999C13.3261 16.4999 14.5979 15.9731 15.5355 15.0354C16.4732 14.0978 17 12.826 17 11.4999V5.3999H7V11.4999ZM4 9.6499C4 10.3899 4.403 11.0339 5 11.3799V8.3999H4V9.6499ZM19 11.3799C19.597 11.0339 20 10.3899 20 9.6499V8.3999H19V11.3799Z" fill="#94969C"/>
        </svg>

      };
    case "Markets":
      return { activeIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.01" width="24" height="24" fill="#FFFFFF"/>
        <path d="M7.5 10C8.60457 10 9.5 10.8954 9.5 12V19C9.5 20.1046 8.60457 21 7.5 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10H7.5Z" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M19 5C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H16.5C15.3954 21 14.5 20.1046 14.5 19V7C14.5 5.89543 15.3954 5 16.5 5H19Z" stroke="#FFFFFF" stroke-width="2"/>
        </svg>
        , inactiveIcon: 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.01" width="24" height="24" fill="#94969C"/>
        <path d="M7.5 10C8.60457 10 9.5 10.8954 9.5 12V19C9.5 20.1046 8.60457 21 7.5 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10H7.5Z" stroke="#94969C" stroke-width="2"/>
        <path d="M19 5C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H16.5C15.3954 21 14.5 20.1046 14.5 19V7C14.5 5.89543 15.3954 5 16.5 5H19Z" stroke="#94969C" stroke-width="2"/>
        </svg>
      };
    default:
      throw new Error(`Unsupported menu name: ${menuName}`);
  }
};

const getColorConfig = (): ColorConfigInterface | undefined => {
  const customColorConfigEnv = getRuntimeConfig('VITE_TRADING_VIEW_COLOR_CONFIG');

  if (!customColorConfigEnv || typeof customColorConfigEnv !== 'string' || customColorConfigEnv.trim() === '') {
    return undefined;
  }

  try {
    const customColorConfig = JSON.parse(customColorConfigEnv);
    return customColorConfig;
  } catch (e) {
    console.warn("Error parsing VITE_TRADING_VIEW_COLOR_CONFIG:", e);
    return undefined;
  }
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const { theme } = useTheme();

  return useMemo<OrderlyConfig>(() => {
    const enabledMenus = getEnabledMenus();
    const customMenus = getCustomMenuItems();

    const translatedEnabledMenus = enabledMenus.map(menu => ({
      name: t(menu.translationKey),
      href: menu.href,
    }));

    const allMenuItems = [...translatedEnabledMenus, ...customMenus];

    const supportedBottomNavMenus = ["Trading", "Portfolio", "Markets", "Leaderboard"];
    const bottomNavMenus = enabledMenus
      .filter(menu => supportedBottomNavMenus.includes(menu.name))
      .map(menu => {
        const icons = getBottomNavIcon(menu.name);
        return {
          name: t(menu.translationKey),
          href: menu.href,
          ...icons
        };
      })
      .filter(menu => menu.activeIcon && menu.inactiveIcon);

    const mainNavProps: MainNavWidgetProps = {
      initialMenu: "/",
      mainMenus: allMenuItems,
    };

    if (getRuntimeConfigBoolean('VITE_ENABLE_CAMPAIGNS')) {
      mainNavProps.campaigns = {
        name: "$ORDER",
        href: "/rewards",
        children: [
          {
            name: t("extend.staking"),
            href: "https://app.orderly.network/staking",
            description: t("extend.staking.description"),
            icon: <OrderlyIcon size={14} />,
            activeIcon: <OrderlyActiveIcon size={14} />,
            target: "_blank",
          },
        ],
      };
    }

    mainNavProps.customRender = (components) => {
      return (
        <Flex key={`main-nav-${theme}`} justify="between" className="oui-w-full">
          <Flex
            itemAlign={"center"}
            className={cn(
              "oui-gap-3",
              "oui-overflow-hidden",
            )}
          >
            {/* {isMobile &&
              <CustomLeftNav
                menus={translatedEnabledMenus}
                externalLinks={customMenus}
              />
            } */}
            <Link to="/perp">
              {isMobile && getRuntimeConfigBoolean('VITE_HAS_SECONDARY_LOGO')
                ? (
                  <img
                    key={`nav-logo-${theme}`}
                    src={withBasePath(theme === "light" ? "/lightLogo.png" : "/darkLogo.png")}
                    alt="logo"
                    style={{ height: "32px" }}
                  />
                )
                : getRuntimeConfigBoolean('VITE_HAS_PRIMARY_LOGO')
                  ? (
                    <img
                      key={`nav-logo-${theme}`}
                      src={withBasePath(theme === "light" ? "/lightLogo.png" : "/darkLogo.png")}
                      alt="logo"
                      style={{ height: "32px" }}
                    />
                  )
                  : components.title}
            </Link>
            {components.mainNav}
          </Flex>

          <Flex itemAlign={"center"} className="oui-gap-2">
            {components.accountSummary}
            {components.linkDevice}
            {components.scanQRCode}
          
            {components.languageSwitcher}
            {components.subAccount}
            {components.chainMenu}
            {components.walletConnect}
            {/* <ThemeSwitcher /> */}
          </Flex>
        </Flex>
      )
    };

    return {
      scaffold: {
        mainNavProps,
        bottomNavProps: {
          mainMenus: bottomNavMenus,
        },
        footerProps: {
          telegramUrl: getRuntimeConfig('VITE_TELEGRAM_URL') || undefined,
          discordUrl: getRuntimeConfig('VITE_DISCORD_URL') || undefined,
          twitterUrl: getRuntimeConfig('VITE_TWITTER_URL') || undefined,
          trailing: <span className="oui-text-2xs oui-text-base-contrast-54">Charts powered by <a href="https://tradingview.com" target="_blank" rel="noopener noreferrer">TradingView</a></span>
        },
      },
      orderlyAppProvider: {
        appIcons: {
          main:
            getRuntimeConfigBoolean('VITE_HAS_PRIMARY_LOGO')
              ? {
                component: (
                  <img
                    key={`app-logo-${theme}`}
                    src={withBasePath(theme === "light" ? "/lightLogo.png" : "/darkLogo.png")}
                    alt="logo"
                    style={{ height: "42px" }}
                  />
                ),
              }
              : { img: withBasePath("/orderly-logo.svg") },
          secondary: {
            img: getRuntimeConfigBoolean('VITE_HAS_SECONDARY_LOGO')
              ? withBasePath(theme === "light" ? "/lightLogo.png" : "/logo-secondary1.webp")
              : withBasePath("/orderly-logo-secondary.svg"),
          },
        },
      },
      tradingPage: {
        tradingViewConfig: {
          scriptSRC: withBasePath("/tradingview/charting_library/charting_library.js"),
          library_path: withBasePath("/tradingview/charting_library/"),
          // customCssUrl: withBasePath("/tradingview/chart.css"),
          colorConfig: getColorConfig(),
          // TradingView 官方推荐：使用 overrides 来设置主题相关的颜色
          overrides: {
            // 面板背景色
            "paneProperties.background": theme === 'light' ? '#ffffff' : '#24202F',
            "paneProperties.backgroundType": 'solid',
            "paneProperties.backgroundGradientStartColor": theme === 'light' ? '#ffffff' : '#24202F',
            "paneProperties.backgroundGradientEndColor": theme === 'light' ? '#ffffff' : '#24202F',
            // 文本颜色
            "scalesProperties.textColor": theme === 'light' ? '#131722' : '#ffffff',
            // 网格线颜色
            "paneProperties.vertGridProperties.color": theme === 'light' ? 'rgba(42, 46, 57, 0.06)' : 'rgba(255, 255, 255, 0.06)',
            "paneProperties.horzGridProperties.color": theme === 'light' ? 'rgba(42, 46, 57, 0.06)' : 'rgba(255, 255, 255, 0.06)',
            // 分隔线颜色
            "paneProperties.separatorColor": theme === 'light' ? '#E0E3EB' : 'rgba(255, 255, 255, 0.1)',
            // 十字线颜色
            "crossHairProperties.color": theme === 'light' ? '#9598A1' : '#9598A1',
          },
        },
        sharePnLConfig: {
          backgroundImages: getPnLBackgroundImages(),
          color: "rgba(255, 255, 255, 0.98)",
          profitColor: "rgba(41, 223, 169, 1)",
          lossColor: "rgba(245, 97, 139, 1)",
          brandColor: "rgba(255, 255, 255, 0.98)",
          // ref
          refLink: typeof window !== 'undefined' ? window.location.origin : undefined,
          refSlogan: getRuntimeConfig('VITE_ORDERLY_BROKER_NAME') || "Orderly Network",
        },
      },
    };
  }, [t, isMobile, theme]);
};
