import { useTranslation } from "@/components/i18n";
import { Box, Flex, GradientText, Text } from "@/components/ui";

export const RwaTab = () => {
  const { t } = useTranslation();
  return (
    <Flex gap={1}>
      <Text>{t("common.rwa")}</Text>
      <Box
        r="base"
        px={2}
        className="oui-bg-gradient-to-r oui-text-primary"
      >
        {t("common.new")}
      </Box>
    </Flex>
  );
};
