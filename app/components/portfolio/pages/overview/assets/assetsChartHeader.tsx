import { CardTitle, Flex } from "@/components/ui";
import { useTranslation } from "@/components/i18n"

export const AssetsChartHeader = () => {
  const { t } = useTranslation();

  return (
    <Flex justify={"between"}>
      <CardTitle>{t("common.assets")}</CardTitle>
    </Flex>
  );
};
