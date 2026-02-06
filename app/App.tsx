import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import OrderlyProvider from "@/components/orderlyProvider";
import { ModalProvider, registerSimpleDialog } from "@/components/ui";
import {
  DepositAndWithdraw,
  DepositAndWithdrawWithDialogId,
  TransferDialogId,
  TransferWidget,
} from "@orderly.network/ui-transfer";
import { HttpsRequiredWarning } from "@/components/HttpsRequiredWarning";
import { withBasePath } from "./utils/base-path";
import { getSEOConfig, getUserLanguage } from "./utils/seo";

let transferDialogsRegistered = false;
const ensureTransferDialogsRegistered = () => {
  if (transferDialogsRegistered) return;
  registerSimpleDialog(DepositAndWithdrawWithDialogId, DepositAndWithdraw, {
    size: "md",
    classNames: { content: "oui-border oui-border-line-6" },
  });
  registerSimpleDialog(TransferDialogId, TransferWidget, {
    size: "md",
    classNames: { content: "oui-border oui-border-line-6" },
  });
  transferDialogsRegistered = true;
};

export default function App() {
  const seoConfig = getSEOConfig();
  const defaultLanguage = getUserLanguage();
  ensureTransferDialogsRegistered();

  return (
    <>
      <Helmet>
        <html lang={seoConfig.language || defaultLanguage} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/webp" href={withBasePath("/favicon_white.webp")} />
      </Helmet>
      <HttpsRequiredWarning />
      <OrderlyProvider>
        <ModalProvider>
          <Outlet />
        </ModalProvider>
      </OrderlyProvider>
    </>
  );
}

