import { useNavigation } from "@react-navigation/native";
import {
  HStack,
  IconButton,
  useTheme,
  StyledProps,
  Heading,
} from "native-base";
import { CaretLeft } from "phosphor-react-native";

type Props = StyledProps & {
  title: string;
};

export function Header({ title, ...rest }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }
  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={6}
      pt={12}
    >
      <IconButton
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
        onPress={handleGoBack}
      />
      <Heading
        color="gray.100"
        fontSize="lg"
        textAlign="center"
        flex={1}
        pl={-6}
      >
        {title}
      </Heading>
    </HStack>
  );
}
