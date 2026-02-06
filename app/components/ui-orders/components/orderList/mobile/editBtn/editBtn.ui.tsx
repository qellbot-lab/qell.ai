import { FC } from "react";
import { useTranslation } from "@/components/i18n"
import { Button } from "@/components/ui";
import { EditBtnState } from "./editBtn.script";

export const EditBtn: FC<EditBtnState> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        color="secondary"
        size="sm"
        className="oui-border-base-contrast-36"
        onClick={() => {
          props.onShowEditSheet();
        }}
      >
        {t("common.edit")}
      </Button>
    </>
  );
};
