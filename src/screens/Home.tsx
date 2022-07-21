import {
  HStack,
  IconButton,
  useTheme,
  VStack,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import Logo from "../assets/logo_secondary.svg";
import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Order, OrderProps } from "../components/Order";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { dateFormat } from "../utils/firestoreDateFormat";
import Loading from "../components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate("details", { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        Alert.alert("Sair", " Nao foi possível sair.");
      });
  }

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });

        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          mt={8}
          mb={4}
        >
          <Heading color="gray.100">Meus Chamados</Heading>
          <Text color={"gray.200"}>{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title={"em andamento"}
            type="open"
            onPress={() => {
              setStatusSelected("open");
            }}
            isActive={statusSelected === "open"}
          />
          <Filter
            title={"finalizados"}
            type="closed"
            onPress={() => {
              setStatusSelected("closed");
            }}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Voce ainda nao possui {"\n"}
                  solicitações{" "}
                  {statusSelected === "open" ? "em aberto" : "finalizados"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
