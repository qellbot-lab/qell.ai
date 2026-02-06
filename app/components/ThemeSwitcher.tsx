import { useState, memo, useEffect } from "react";
import { Flex } from "@/components/ui";
import { useTheme, type Theme } from "@/hooks/useTheme";
import { LocaleCode, LocaleEnum, defaultLanguages, useTranslation } from "@/components/i18n";
import { getRuntimeConfigArray } from "@/utils/runtime-config";
import { useSearchParams } from "react-router-dom";








// 切换语言 - 使用 history.replaceState 不刷新页面
// 注意：这个函数会被组件内的 changeLanguage 覆盖
const changeLanguageBase = (lang: LocaleCode) => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (lang === LocaleEnum.en) {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        // 使用 replaceState 而不是 location.href，避免刷新页面
        window.history.replaceState({}, '', url.toString());
    }
};

export const ThemeSwitcher = memo(function ThemeSwitcher() {
    const { theme, changeTheme } = useTheme();
    const { i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showMenu, setShowMenu] = useState(false);

    // 从 searchParams 获取当前语言，作为单一数据源
    const currentLang = (searchParams.get('lang') || 'en') as LocaleCode;

    return (
        <div className="oui-relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="oui-p-2 oui-text-base-foreground oui-text-sm oui-transition-all"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                }}
                title="设置"
            >
                {showMenu ? (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M512 466.944l233.472-233.472a31.744 31.744 0 0 1 45.056 45.056L557.056 512l233.472 233.472a31.744 31.744 0 0 1-45.056 45.056L512 557.056l-233.472 233.472a31.744 31.744 0 0 1-45.056-45.056L466.944 512 233.472 278.528a31.744 31.744 0 0 1 45.056-45.056z"
                            fill="#ffffff"
                        />
                    </svg>
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h682.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </button>
            
            {/* Settings Menu */}
            {showMenu && (
                <>
                    {/* 点击外部关闭菜单 */}
                    <div
                        className="oui-fixed oui-inset-0 oui-z-[999]"
                        onClick={() => setShowMenu(false)}
                    />
                    <div
                        className="oui-absolute oui-right-0 oui-mt-2"
                        style={{
                            backgroundColor: `rgb(var(--oui-color-fill))`,
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            minWidth: '240px',
                            zIndex: 1000,
                            padding: '8px',
                        }}
                    >
                        {/* Color Mode Section */}
                        <div style={{ padding: '12px 16px', borderBottom: `1px solid rgba(var(--oui-color-line), 0.2)` }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                            }}>
                                <span style={{ 
                                    fontSize: '14px', 
                                    color: `rgb(var(--oui-color-base-foreground))`,
                                    fontWeight: 500
                                }}>
                                    Color Mode
                                </span>
                                {/* 滑动切换按钮 - 缩小版 */}
                                <div
                                    onClick={() => {
                                        const nextTheme = theme === 'default' ? 'light' : 'default';
                                        changeTheme(nextTheme);
                                        if (typeof window !== "undefined") {
                                            window.location.reload();
                                        }
                                    }}
                                    style={{
                                        position: 'relative',
                                        width: '60px',
                                        height: '28px',
                                        backgroundColor: `rgb(var(--oui-color-base-4))`,
                                        borderRadius: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '2px',
                                    }}
                                >
                                    {/* 滑动滑块 */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            width: 'calc(50% - 2px)',
                                            height: '24px',
                                            backgroundColor: `rgb(var(--oui-color-primary))`,
                                            borderRadius: '12px',
                                            transition: 'transform 0.3s ease',
                                            transform: theme === 'light' ? 'translateX(0)' : 'translateX(100%)',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    
                                    {/* 左侧太阳图标 - Light */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: '10px',
                                            zIndex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Frame">
                                                <path id="Vector" d="M9.98633 5.40234C7.44531 5.40234 5.37891 7.46875 5.37891 10.0098C5.37891 12.5508 7.44531 14.6172 9.98633 14.6172C12.5273 14.6172 14.5938 12.5508 14.5938 10.0098C14.5938 7.46875 12.5273 5.40234 9.98633 5.40234ZM9.98633 13.5703C8.02344 13.5703 6.42578 11.9727 6.42578 10.0098C6.42578 8.04687 8.02344 6.44922 9.98633 6.44922C11.9492 6.44922 13.5469 8.04687 13.5469 10.0098C13.5469 11.9727 11.9512 13.5703 9.98633 13.5703ZM9.98633 4.23828C10.2754 4.23828 10.5098 4.00391 10.5098 3.71484V1.80078C10.5098 1.51172 10.2754 1.27734 9.98633 1.27734C9.69727 1.27734 9.46289 1.51172 9.46289 1.80078V3.71484C9.46484 4.00391 9.69727 4.23828 9.98633 4.23828ZM5.16602 5.92969C5.26758 6.03125 5.40234 6.08203 5.53516 6.08203C5.66992 6.08203 5.80273 6.03125 5.9043 5.92969C6.10937 5.72461 6.10937 5.39453 5.9043 5.18945L4.55078 3.83594C4.50226 3.78719 4.44458 3.74851 4.38107 3.72211C4.31755 3.69572 4.24945 3.68213 4.18066 3.68213C4.11188 3.68213 4.04378 3.69572 3.98026 3.72211C3.91675 3.74851 3.85907 3.78719 3.81055 3.83594C3.7618 3.88446 3.72312 3.94214 3.69672 4.00565C3.67033 4.06917 3.65674 4.13727 3.65674 4.20605C3.65674 4.27484 3.67033 4.34294 3.69672 4.40646C3.72312 4.46997 3.7618 4.52765 3.81055 4.57617L5.16602 5.92969ZM4.2168 10.0098C4.2168 9.7207 3.98242 9.48633 3.69336 9.48633H1.7793C1.49023 9.48633 1.25586 9.7207 1.25586 10.0098C1.25586 10.2988 1.49023 10.5332 1.7793 10.5332H3.69336C3.98242 10.5332 4.2168 10.2988 4.2168 10.0098ZM5.16602 14.0898L3.8125 15.4434C3.76375 15.4919 3.72507 15.5496 3.69868 15.6131C3.67228 15.6766 3.65869 15.7447 3.65869 15.8135C3.65869 15.8823 3.67228 15.9504 3.69868 16.0139C3.72507 16.0774 3.76375 16.1351 3.8125 16.1836C3.91406 16.2852 4.04883 16.3359 4.18164 16.3359C4.31641 16.3359 4.44922 16.2852 4.55078 16.1836L5.9043 14.8301C6.10937 14.625 6.10937 14.2949 5.9043 14.0898C5.70117 13.8867 5.37109 13.8867 5.16602 14.0898ZM9.98633 15.7812C9.69727 15.7812 9.46289 16.0156 9.46289 16.3047V18.2187C9.46289 18.5078 9.69727 18.7422 9.98633 18.7422C10.2754 18.7422 10.5098 18.5078 10.5098 18.2187V16.3047C10.5098 16.0156 10.2754 15.7812 9.98633 15.7812ZM14.8066 14.0898C14.7581 14.0411 14.7004 14.0024 14.6369 13.976C14.5734 13.9496 14.5053 13.936 14.4365 13.936C14.3677 13.936 14.2996 13.9496 14.2361 13.976C14.1726 14.0024 14.1149 14.0411 14.0664 14.0898C14.0177 14.1384 13.979 14.196 13.9526 14.2596C13.9262 14.3231 13.9126 14.3912 13.9126 14.46C13.9126 14.5287 13.9262 14.5968 13.9526 14.6604C13.979 14.7239 14.0177 14.7816 14.0664 14.8301L15.4199 16.1836C15.5215 16.2852 15.6563 16.3359 15.7891 16.3359C15.9238 16.3359 16.0566 16.2852 16.1582 16.1836C16.3633 15.9785 16.3633 15.6484 16.1582 15.4434L14.8066 14.0898ZM18.1953 9.48633H16.2812C15.9922 9.48633 15.7578 9.7207 15.7578 10.0098C15.7578 10.2988 15.9922 10.5332 16.2812 10.5332H18.1953C18.4844 10.5332 18.7188 10.2988 18.7188 10.0098C18.7188 9.7207 18.4844 9.48633 18.1953 9.48633ZM14.4375 6.08203C14.5723 6.08203 14.7051 6.03125 14.8066 5.92969L16.1602 4.57617C16.3652 4.37109 16.3652 4.04102 16.1602 3.83594C16.1116 3.78719 16.054 3.74851 15.9904 3.72211C15.9269 3.69572 15.8588 3.68213 15.79 3.68213C15.7213 3.68213 15.6532 3.69572 15.5896 3.72211C15.5261 3.74851 15.4684 3.78719 15.4199 3.83594L14.0664 5.18945C14.0177 5.23798 13.979 5.29565 13.9526 5.35917C13.9262 5.42268 13.9126 5.49079 13.9126 5.55957C13.9126 5.62835 13.9262 5.69646 13.9526 5.75997C13.979 5.82349 14.0177 5.88116 14.0664 5.92969C14.1699 6.03125 14.3027 6.08203 14.4375 6.08203Z" fill={`rgb(var(--oui-color-base-foreground))`} stroke={`rgb(var(--oui-color-base-foreground))`} strokeWidth="0.5"/>
                                            </g>
                                        </svg>
                                    </div>
                                    
                                    {/* 右侧月亮图标 - Default */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            zIndex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Frame">
                                                <path id="Vector" d="M10 2.5C10.3775 2.5 10.4426 3.06437 10.1263 3.27035C8.81891 4.12171 7.95456 5.59627 7.95456 7.27274C7.95456 9.90865 10.0913 12.0454 12.7273 12.0454C14.4037 12.0454 15.8783 11.1811 16.7296 9.87375C16.9356 9.55742 17.5 9.62252 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5Z" stroke={`rgb(var(--oui-color-base-foreground))`} strokeWidth="1.5" strokeLinejoin="round"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
});

// 导出获取主题颜色的函数，供其他组件使用
// 返回 CSS 变量，自动根据主题切换
export function getThemeColor(theme: Theme): string {
    return `rgb(var(--oui-color-primary))`;
}
