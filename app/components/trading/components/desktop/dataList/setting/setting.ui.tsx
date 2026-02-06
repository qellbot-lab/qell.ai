import { FC, useMemo, useState } from "react";
import { useTranslation } from "@/components/i18n"
import {
  Button,
  Checkbox,
  Divider,
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  ExclamationFillIcon,
  Flex,
  SettingFillIcon,
  Switch,
  Text,
  Tooltip,
  useScreen,
  Sheet,
  SheetContent,
  SheetTrigger,
  modal,
} from "@/components/ui";
import { SettingState } from "./setting.script";

export const Setting: FC<SettingState> = (props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  const SettingsContent = useMemo(() => {
    return () => (
      <>
        <div className="oui-flex oui-flex-col oui-text-sm">
          <Flex
            itemAlign="center"
            justify={isMobile ? "center" : "start"}
            className="oui-w-full"
          >
            <Text className="oui-text-base oui-pb-3">
              {t("trading.portfolioSettings")}
            </Text>
          </Flex>
          <Divider />
          <Text className="oui-pb-3 oui-text-base-contrast-54 oui-mt-2">
            {t("trading.portfolioSettings.decimalPrecision")}
          </Text>
          <DecimalPrecisionCheckbox
            value={props.pnlNotionalDecimalPrecision}
            onValueChange={(e) => {
              props.setPnlNotionalDecimalPrecision(e);
              setOpen(false);
            }}
          />
          <Divider className="oui-my-3" />
          <Text className="oui-pb-3 oui-text-base-contrast-54 oui-mt-2">
            {t("trading.portfolioSettings.unrealPnlPriceBasis")}
          </Text>
          <UnPnlPriceBasisCheckBox
            value={props.unPnlPriceBasis}
            onValueChange={(e) => {
              props.setUnPnlPriceBasic(e);
              setOpen(false);
            }}
          />
        </div>
        <Divider className="oui-my-3" />
        <Flex itemAlign="center" gap={1} justify="between">
          <Flex gap={1} itemAlign="center">
            <Text size="sm" intensity={54}>
              {t("trading.portfolioSettings.reversePosition")}
            </Text>
            {isMobile ? (
              <ExclamationFillIcon
                size={14}
                className="oui-text-base-contrast-54 hover:oui-text-base-contrast-80 oui-cursor-pointer"
                onClick={() => {
                  modal.alert({
                    title: t("common.tips"),
                    message: t(
                      "trading.portfolioSettings.reversePosition.tooltip",
                    ),
                  });
                }}
              />
            ) : (
              <Tooltip
                content={t("trading.portfolioSettings.reversePosition.tooltip")}
                className="oui-max-w-[300px]"
              >
                <ExclamationFillIcon
                  size={14}
                  className="oui-text-base-contrast-54 hover:oui-text-base-contrast-80 oui-cursor-pointer"
                />
              </Tooltip>
            )}
          </Flex>
          <Switch
            checked={props.reversePosition}
            onCheckedChange={(checked: boolean) => {
              props.setReversePosition(checked);
            }}
          />
        </Flex>
      </>
    );
  }, [
    t,
    isMobile,
    props.pnlNotionalDecimalPrecision,
    props.unPnlPriceBasis,
    props.reversePosition,
  ]);

  const triggerButton = (
    <Button
      size="xs"
      type="button"
      variant="contained"
      className="oui-bg-transparent hover:oui-bg-transparent"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame 1533210958">
          <g id="Group 1533210956">
            <g id="Union">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.9167 13.1666C15.5955 13.1666 14.4794 12.2881 14.1209 11.0833H6.50008C6.03984 11.0833 5.66675 10.7102 5.66675 10.25C5.66675 9.78974 6.03984 9.41665 6.50008 9.41665H14.1209C14.4794 8.21186 15.5955 7.33331 16.9167 7.33331C18.238 7.33331 19.3541 8.21186 19.7126 9.41665H21.5001C21.9603 9.41665 22.3334 9.78974 22.3334 10.25C22.3334 10.7102 21.9603 11.0833 21.5001 11.0833H19.7126C19.3541 12.2881 18.238 13.1666 16.9167 13.1666ZM16.9167 11.5C17.6071 11.5 18.1667 10.9403 18.1667 10.25C18.1667 9.55962 17.6071 8.99998 16.9167 8.99998C16.2264 8.99998 15.6667 9.55962 15.6667 10.25C15.6667 10.9403 16.2264 11.5 16.9167 11.5Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0834 20.25C12.4047 20.25 13.5207 19.3714 13.8793 18.1666H21.5001C21.9603 18.1666 22.3334 17.7936 22.3334 17.3333C22.3334 16.8731 21.9603 16.5 21.5001 16.5H13.8793C13.5207 15.2952 12.4047 14.4166 11.0834 14.4166C9.76216 14.4166 8.64609 15.2952 8.28753 16.5H6.50008C6.03984 16.5 5.66675 16.8731 5.66675 17.3333C5.66675 17.7936 6.03984 18.1666 6.50008 18.1666H8.28753C8.64609 19.3714 9.76216 20.25 11.0834 20.25ZM11.0834 18.5833C10.3931 18.5833 9.83341 18.0237 9.83341 17.3333C9.83341 16.643 10.3931 16.0833 11.0834 16.0833C11.7738 16.0833 12.3334 16.643 12.3334 17.3333C12.3334 18.0237 11.7738 18.5833 11.0834 18.5833Z"
                fill="white"
              />
            </g>
          </g>
        </g>
      </svg>
    </Button>
  );

  return (
    <Flex gap={0}>
      <Flex gap={1}>
        <Checkbox
          id="oui-checkbox-hideOtherSymbols"
          color="white"
          checked={props.hideOtherSymbols}
          onCheckedChange={(checked: boolean) => {
            props.setHideOtherSymbols(checked);
          }}
        />
        <label
          className="oui-text-xs oui-text-base-contrast-54 oui-cursor-pointer"
          htmlFor="oui-checkbox-hideOtherSymbols"
        >
          {t("trading.hideOtherSymbols")}
        </label>
      </Flex>

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>{triggerButton}</SheetTrigger>
          <SheetContent side="bottom" className="oui-px-5 oui-pt-3">
            <div
              style={{
                paddingBottom: `max(32px, calc(12px + env(safe-area-inset-bottom)))`,
              }}
            >
              <SettingsContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <DropdownMenuRoot open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          <DropdownMenuContent
            className="oui-px-5 oui-py-3 oui-w-[360px]"
            alignOffset={2}
            align="end"
          >
            <SettingsContent />
          </DropdownMenuContent>
        </DropdownMenuRoot>
      )}
    </Flex>
  );
};

const UnPnlPriceBasisCheckBox = (props: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const { value, onValueChange } = props;
  const { t } = useTranslation();

  // "markPrice" | "lastPrice"
  return (
    <Flex gap={2}>
      <RadioButton
        sel={value === "markPrice"}
        label={t("common.markPrice")}
        value={"markPrice"}
        onCheckChange={onValueChange}
      />
      <RadioButton
        sel={value === "lastPrice"}
        label={t("common.lastPrice")}
        value={"lastPrice"}
        onCheckChange={onValueChange}
      />
    </Flex>
  );
};

const DecimalPrecisionCheckbox = (props: {
  value: number;
  onValueChange: (value: number) => void;
}) => {
  const { value, onValueChange } = props;
  return (
    <Flex gap={2}>
      <RadioButton
        sel={value === 0}
        label={1}
        value={0}
        onCheckChange={onValueChange}
      />
      <RadioButton
        sel={value === 1}
        label={0.1}
        value={1}
        onCheckChange={onValueChange}
      />
      <RadioButton
        sel={value === 2}
        label={0.01}
        value={2}
        onCheckChange={onValueChange}
      />
    </Flex>
  );
};

// const InnerCheckbox = (props: {
//   sel: boolean;
//   label: any;
//   value: any;
//   onCheckChange: (value: any) => void;
// }) => {
//   const { sel, label, value, onCheckChange } = props;
//   return (
//     <Flex
//       onClick={(e) => {
//         onCheckChange(value);
//         e.stopPropagation();
//       }}
//       gap={1}
//     >
//       <Checkbox color="white" checked={sel} />
//       <Text size="xs" intensity={sel ? 98 : 54}>
//         {`${label}`}
//       </Text>
//     </Flex>
//   );
// };

const RadioButton = (props: {
  sel: boolean;
  label: any;
  value: any;
  onCheckChange: (value: any) => void;
}) => {
  const { sel, label, value, onCheckChange } = props;
  return (
    <Flex
      onClick={(e) => {
        onCheckChange(value);
        e.stopPropagation();
      }}
      gap={1}
      className="oui-cursor-pointer"
    >
      {sel ? <SelIcon /> : <UnselIcon />}
      <Text size="2xs" intensity={sel ? 98 : 54}>
        {label}
      </Text>
    </Flex>
  );
};

const SelIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="oui-fill-white"
    >
      <path
        d="M8.01 1.333a6.667 6.667 0 1 0 0 13.333 6.667 6.667 0 0 0 0-13.333m0 1.333a5.334 5.334 0 1 1-.001 10.667 5.334 5.334 0 0 1 0-10.667"
        fill="#fff"
        fillOpacity=".36"
      />
      <circle cx="8" cy="8" r="3.333" />
    </svg>
  );
};

const UnselIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.01 1.333a6.667 6.667 0 1 0 0 13.333 6.667 6.667 0 0 0 0-13.333m0 1.333a5.334 5.334 0 1 1-.001 10.667 5.334 5.334 0 0 1 0-10.667"
        fill="#fff"
        fillOpacity=".54"
      />
    </svg>
  );
};
