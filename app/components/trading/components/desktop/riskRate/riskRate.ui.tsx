import React, { FC } from "react";
import { useTranslation } from "@/components/i18n"
import { useAppContext } from "@orderly.network/react-app";
import {
  Flex,
  Text,
  Box,
  Tooltip,
  modal,
  gradientTextVariants,
  cn,
  EditIcon,
} from "@/components/ui";
import { LeverageWidgetWithDialogId } from "@orderly.network/ui-leverage";
import { TooltipContent } from "../assetView/assetView.ui";
import { RiskRateState } from "./riskRate.script";

export const RiskRate: FC<RiskRateState> = (props) => {
  const { riskRate, riskRateColor, currentLeverage, maxLeverage } = props;
  const { isHigh, isMedium, isLow } = riskRateColor;
  const { wrongNetwork } = useAppContext();
  const { t } = useTranslation();

  const parseRiskValue = (value: string | number | null | undefined) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }
    if (!value || value === "--") return null;
    const numeric = Number.parseFloat(value.toString().replace("%", ""));
    return Number.isFinite(numeric) ? numeric : null;
  };

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const riskValue = parseRiskValue(riskRate);
  const riskDisplay = riskValue === null ? "--" : Math.round(riskValue).toString();
  // When no value, place indicator at the lowest point of the green segment.
  const riskPercent = riskValue === null ? 100 : clamp(riskValue, 0, 100);

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (Math.PI / 180) * angle;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  return (
    <Box data-risk={""} className="oui-space-y-2">
      <Flex direction="column" itemAlign="center" className="oui-w-full">
        <Box className="oui-w-full oui-flex oui-justify-center">
          <Box className="oui-relative oui-w-[200px] oui-h-[100px]">
            <svg
              className="oui-w-full oui-h-auto"
              width="200"
              height="100"
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2001_2468)">
                <g>
                  <path
                    d="M71.063 9.61937C70.2041 6.93686 71.68 4.05255 74.4028 3.33153C90.6363 -0.967183 107.694 -1.10813 123.996 2.92173C126.731 3.59765 128.254 6.45718 127.44 9.15352C126.625 11.8499 123.782 13.3605 121.043 12.7004C106.725 9.24891 91.7758 9.37244 77.5168 13.0601C74.7898 13.7653 71.9218 12.3019 71.063 9.61937Z"
                    fill="#FAD145"
                  />
                  <path
                    d="M5.09801 100C2.28246 100 -0.0135555 97.7158 0.129899 94.9039C0.985585 78.1313 6.05296 61.8418 14.8628 47.5436C16.3398 45.1465 19.5264 44.5679 21.8451 46.165C24.1638 47.7622 24.7352 50.9296 23.2722 53.3352C15.6178 65.9205 11.1763 80.1981 10.3407 94.9046C10.1809 97.7157 7.91357 100 5.09801 100Z"
                    fill="#B6122A"
                  />
                  <path
                    d="M23.3042 44.1094C21.0278 42.4505 20.5173 39.251 22.2901 37.0622C32.8591 24.0122 46.5469 13.8326 62.0862 7.46594C64.6926 6.39807 67.6099 7.80768 68.5435 10.4651C69.4771 13.1225 68.073 16.02 65.4728 17.1029C51.8768 22.7656 39.8804 31.6872 30.5449 43.0787C28.7595 45.2572 25.5805 45.7682 23.3042 44.1094Z"
                    fill="#F34465"
                  />
                  <path
                    d="M130.687 10.1984C131.598 7.53307 134.503 6.09847 137.118 7.14393C152.712 13.377 166.486 23.4387 177.167 36.3975C178.958 38.571 178.475 41.7748 176.213 43.4531C173.951 45.1315 170.768 44.6478 168.964 42.4846C159.531 31.1738 147.459 22.3554 133.814 16.8097C131.205 15.7491 129.776 12.8637 130.687 10.1984Z"
                    fill="#2FE5A3"
                  />
                  <path
                    d="M194.9 100C197.717 100 200.014 97.7149 199.87 94.9019C199.014 78.1307 193.947 61.8425 185.138 47.5453C183.661 45.1473 180.473 44.5684 178.153 46.1662C175.834 47.764 175.262 50.9327 176.726 53.3392C184.379 65.9229 188.819 80.1983 189.655 94.9026C189.815 97.7148 192.083 100 194.9 100Z"
                    fill="#2AA06F"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_2001_2468">
                  <rect width="200" height="100" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <svg
              className="oui-absolute oui-inset-0 oui-w-full oui-h-full"
              viewBox="0 0 200 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {(() => {
                const angle = 180 - (180 * riskPercent) / 100;
                const point = polarToCartesian(100, 100, 78, angle);
                const dx = 100 - point.x;
                const dy = 100 - point.y;
                const len = Math.hypot(dx, dy) || 1;
                const inset = 0;
                const indicator = {
                  x: point.x + (dx / len) * inset + 16,
                  y: point.y + (dy / len) * inset - 6,
                };
                return (
                  <g>
                    <circle cx={indicator.x} cy={indicator.y} r={5} fill="#111217" />
                    <circle cx={indicator.x} cy={indicator.y} r={2} fill="#FFFFFF" />
                  </g>
                );
              })()}
            </svg>
            <div className="oui-absolute oui-inset-0 oui-flex oui-flex-col oui-items-center oui-justify-end oui-translate-y-1/2">
              <Text size="2xl" weight="bold">
                {riskDisplay}
              </Text>
              <Tooltip
                content={
                  <TooltipContent
                    description={t("trading.riskRate.tooltip")}
                    formula={t("trading.riskRate.formula")}
                  />
                }
              >
                <Text
                  size="4xs"
                  color="neutral"
                  weight="semibold"
                  className={cn(
                    "oui-cursor-pointer",
                    "oui-border-b oui-border-dashed oui-border-b-white/10",
                  )}
                >
                  {t("trading.riskRate")}
                </Text>
              </Tooltip>
            </div>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};