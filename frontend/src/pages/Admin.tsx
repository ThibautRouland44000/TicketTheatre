import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Heading, SimpleGrid, Text, Stack } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <Box w="full" maxW="800px" mx="auto" py={8} px={4}>
        <Card.Root bg="red.800">
          <Card.Body>
            <Heading size="xl" mb={4}>Accès refusé</Heading>
            <Text>Vous n'avez pas les permissions nécessaires.</Text>
            <Button mt={4} onClick={() => navigate("/")}>Retour à l'accueil</Button>
          </Card.Body>
        </Card.Root>
      </Box>
    );
  }

  const sections = [
    { title: "Catégories", path: "/admin/categories", description: "Gérer les catégories de spectacles" },
    { title: "Salles", path: "/admin/salles", description: "Gérer les salles de spectacle" },
    { title: "Spectacles", path: "/admin/spectacles", description: "Gérer les spectacles" },
    { title: "Séances", path: "/admin/seances", description: "Gérer les séances" },
    { title: "Réservations", path: "/admin/reservations", description: "Voir toutes les réservations" },
  ];

  return (
    <Box w="full" maxW="1200px" mx="auto" py={8} px={4}>
      <Heading size="2xl" mb={8}>Administration</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {sections.map((section) => (
          <Card.Root key={section.path} bg="gray.800" _hover={{ bg: "gray.700" }} cursor="pointer" onClick={() => navigate(section.path)}>
            <Card.Body>
              <Stack gap={3}>
                <Heading size="lg" color="red.400">{section.title}</Heading>
                <Text color="gray.400">{section.description}</Text>
                <Button variant="outline" colorScheme="red" size="sm">
                  Gérer
                </Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
}
