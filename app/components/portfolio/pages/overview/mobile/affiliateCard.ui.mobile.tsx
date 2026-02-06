import { FC } from "react";
import { RefferalAPI as API } from "@orderly.network/hooks";
import { useTranslation } from "@/components/i18n"
import type { RouterAdapter } from "@orderly.network/types";
import {
  Flex,
  Text,
  AffiliateIcon,
  ChevronRightIcon,
  cn,
} from "@/components/ui";
import { commifyOptional } from "@orderly.network/utils";

const isNumber = (val: unknown): val is number => {
  return typeof val === "number" && !Number.isNaN(val);
};

type AffiliateCardMobileProps = {
  referralInfo?: API.ReferralInfo;
  routerAdapter?: RouterAdapter;
};

export const AffiliateCardMobile: FC<AffiliateCardMobileProps> = (props) => {
  const { t } = useTranslation();
  const { referralInfo, routerAdapter } = props;
  const rebate = referralInfo?.referrer_info?.["30d_referrer_rebate"];
  return (
    <Flex
      className="
   
        oui-via-21.6% 
        oui-via-83.23% 
        oui-relative 
        oui-h-[112px] 
        oui-w-full 
        oui-flex-col 
        oui-items-start 
        oui-border-b
        oui-border-solid
        oui-border-line-12
        oui-p-3
      "
    >
      <Flex className="oui-w-full oui-flex-row oui-justify-between oui-items-start">
        <Flex className="oui-flex-row oui-items-start oui-gap-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Frame 2147223401" clip-path="url(#clip0_2002_5670)">
        <circle id="Ellipse 14397" cx="9.16667" cy="4.99998" r="3.33333" stroke="white" stroke-width="1.66667"/>
        <path id="Rectangle 34628577" d="M6.66602 10.833H11.666C14.4273 10.833 16.6658 13.0717 16.666 15.833V17.5C16.666 17.9602 16.2932 18.333 15.833 18.333H3.33301C2.41264 18.333 1.66619 17.5873 1.66602 16.667V15.833C1.66619 13.0718 3.90485 10.8332 6.66602 10.833Z" stroke="white" stroke-width="1.66667"/>
        <g id="Group 2007673496">
        <rect id="Rectangle 34628578" x="14.167" y="6.66675" width="5" height="1.66667" rx="0.833333" fill="white"/>
        <rect id="Rectangle 34628579" x="17.5" y="5" width="5" height="1.66667" rx="0.833333" transform="rotate(90 17.5 5)" fill="white"/>
        </g>
        </g>
        <defs>
        <clipPath id="clip0_2002_5670">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
        </svg>

          <Flex className="oui-flex-col oui-items-start">
            <Text className="oui-text-base-contrast oui-text-base oui-font-semibold">
              {t("affiliate.asAffiliate.affilates")}
            </Text>
            <Text className="oui-text-2xs oui-font-normal oui-text-base-contrast-54">
              {t("affiliate.commission")}
            </Text>
          </Flex>
        </Flex>
        <Flex className="oui-flex-row oui-items-center oui-gap-1">
          <img
            src="https://oss.orderly.network/static/symbol_logo/USDC.png"
            alt="USDC"
            className="oui-size-4"
          />
          <Text
            className={cn(
              "oui-text-xs oui-font-semibold",
              isNumber(rebate) && rebate !== 0
                ? "oui-text-base-contrast"
                : "oui-text-base-contrast-36",
            )}
          >
            {commifyOptional(rebate, { fix: 2, fallback: "--" })}
          </Text>
          <Text className="oui-text-xs oui-font-semibold oui-text-base-contrast-36">
            (30D)
          </Text>
          <ChevronRightIcon
            size={18}
            color="white"
            className="oui-ml-1"
            onClick={() => {
              routerAdapter?.onRouteChange({
                href: "/rewards/affiliate?tab=affiliate",
                name: t("tradingRewards.rewards"),
              });
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
