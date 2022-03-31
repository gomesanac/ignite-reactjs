import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Graphic } from '../components/Graphic';

import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';



export default function Dashboard() {
  const [chartState, setChartState] = useState(false);

  useEffect(() => {
    setChartState(true);
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" maxW={1480} my="6" mx="auto" px="6">
        <Sidebar />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Inscritos da semana
            </Text>
            {chartState && <Graphic />}
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Taxa de abertura
            </Text>
            {chartState && <Graphic />}
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
