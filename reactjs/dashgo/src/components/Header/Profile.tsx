import { Flex, Text, Box, Avatar } from '@chakra-ui/react';

export function Profile() {
  return (
    <Flex align="center">
      <Box mr="4" textAlign="right">
        <Text>Ana Gomes</Text>
        <Text color="gray.300" fontSize="small">
          gomesanac@gmail.com
        </Text>
      </Box>

      <Avatar
        size="md"
        name="Ana Gomes"
        src="https://github.com/gomesanac.png"
      />
    </Flex>
  );
}
