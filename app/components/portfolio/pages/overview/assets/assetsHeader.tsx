import { FC } from "react";
import { useTranslation } from "@/components/i18n"
import {
  ArrowDownSquareFillIcon,
  ArrowLeftRightIcon,
  ArrowUpSquareFillIcon,
  Button,
  CardTitle,
  Flex,
} from "@/components/ui";

type Props = {
  disabled: boolean;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onTransfer?: () => void;
  isMainAccount?: boolean;
  hasSubAccount?: boolean;
};

export const AssetsHeader: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex justify={"between"}>
      <CardTitle>{t("common.overview")}</CardTitle>
      <Flex gap={3}>
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            variant="gradient"
            onClick={() => props.onDeposit?.()}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 11">
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 19">
              <rect id="&#231;&#159;&#169;&#229;&#189;&#162;" opacity="0.01" width="20" height="20" fill="white"/>
              <g id="Group 2147214318">
              <path id="Ellipse 14989" d="M3.66728 4.58357C2.42018 6.04026 1.66693 7.93229 1.66693 10.0002C1.66693 14.6026 5.39789 18.3336 10.0003 18.3336C14.6026 18.3336 18.3336 14.6026 18.3336 10.0002C18.3336 7.93229 17.5803 6.04026 16.3333 4.58357" stroke="white" stroke-width="1.42857" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="Group 2147214317">
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 2" d="M10.0004 1.66658V11.6666" stroke="white" stroke-width="1.42857" stroke-linecap="round"/>
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 6" d="M6.66876 9.20595L10.0021 12.4817L13.3354 9.20595" stroke="white" stroke-width="1.42857" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              </g>
              </g>
              </g>
              </svg>
            }
            data-testid="oui-testid-portfolio-assets-deposit-btn"
          >
            {t("common.deposit")}
          </Button>
        )}
        {props.hasSubAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            color="secondary"
            onClick={() => props.onTransfer?.()}
            icon={<ArrowLeftRightIcon className="oui-text-base-contrast" />}
          >
            {t("common.transfer")}
          </Button>
        )}
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            color="secondary"
            onClick={() => props.onWithdraw?.()}
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 12">
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 19">
              <rect id="&#231;&#159;&#169;&#229;&#189;&#162;" opacity="0.01" width="20" height="20" transform="matrix(1 1.74846e-07 1.74846e-07 -1 0 20)" fill="#D8D8D8"/>
              <g id="Group 2147214318">
              <path id="Ellipse 14989" d="M3.58974 5.13362C2.32706 6.58085 1.56439 8.46059 1.56439 10.5151C1.56439 15.0876 5.34199 18.7943 10.0019 18.7943C14.6618 18.7943 18.4394 15.0876 18.4394 10.5151C18.4394 8.46059 17.6767 6.58085 16.414 5.13362" stroke="white" stroke-width="1.42857" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="Group 2147214317">
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 2" d="M10.0009 12.3061L10.0009 2.30608" stroke="white" stroke-width="1.42857" stroke-linecap="round"/>
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 6" d="M6.66925 4.76671L10.0026 1.49095L13.3359 4.76671" stroke="white" stroke-width="1.42857" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              </g>
              </g>
              </g>
              </svg>

            }
            data-testid="oui-testid-portfolio-assets-withdraw-btn"
          >
            {t("common.withdraw")}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
