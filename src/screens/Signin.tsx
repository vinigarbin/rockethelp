import React, { useState } from "react";
import auth from "@react-native-firebase/auth";
import { Heading, Icon, VStack, useTheme } from "native-base";
import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import { Button } from "../components/Button";
import { Alert } from "react-native";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  function handleSignin() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe o e-mail e a senha");
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail invalido");
        }

        if (error.code === "auth/wrong-password") {
          return Alert.alert("Entrar", "E-mail ou senha é  invalido");
        }

        if (error.code === "auth/user-not-found") {
          return Alert.alert("Entrar", "Usuário nao cadastrado");
        }
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        mb={8}
        onChangeText={setPassword}
      />

      <Button
        title={"Entrar"}
        w="full"
        onPress={handleSignin}
        isLoading={isLoading}
      />
    </VStack>
  );
}

export default Signin;
