import { useMemo, useState, useEffect } from "react";
import { Box, Grid, Spinner, Text, Center } from "@chakra-ui/react";
import Hero from "../components/Hero";
import { TicketCard } from "../components/TicketCard";
import { TicketPagination } from "../components/TicketPagination";
import { coreService, type Spectacle } from "../services/core.service";

export default function Home() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    loadSpectacles();
  }, []);

  const loadSpectacles = async () => {
    try {
      const data = await coreService.getSpectacles({
        is_published: true,
        per_page: 100,
      });

      const spectaclesList = Array.isArray(data.data) ? data.data : [];

      setSpectacles(spectaclesList);
    } catch (error) {
      console.error('Erreur chargement spectacles:', error);
      setSpectacles([]);
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.ceil(spectacles.length / pageSize);
  const visibleSpectacles = useMemo(
    () => {
      const result = spectacles.slice((page - 1) * pageSize, page * pageSize);
      //console.log('Spectacles visibles page', page, ':', result);
      return result;
    },
    [spectacles, page, pageSize]
  );

  if (loading) {
    return (
      <>
        <Hero />
        <Center minH="50vh">
          <Spinner size="xl" color="red.500" />
        </Center>
      </>
    );
  }

  if (spectacles.length === 0) {
    return (
      <>
        <Hero />
        <Center minH="50vh">
          <Box textAlign="center">
            <Text fontSize="xl" color="gray.500" mb={4}>
              Aucun spectacle disponible pour le moment
            </Text>
            <Text fontSize="sm" color="gray.600">
              (Vérifiez la console pour voir les données reçues)
            </Text>
          </Box>
        </Center>
      </>
    );
  }

  return (
    <>
      <Hero />

      <Box w="full" maxW="1200px" mx="auto" mt={6} px={4}>
        <Text mb={4} fontSize="lg" fontWeight="bold">
          {spectacles.length} spectacle{spectacles.length > 1 ? 's' : ''} disponible{spectacles.length > 1 ? 's' : ''}
        </Text>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          justifyItems="center"
        >
          {visibleSpectacles.map((spectacle) => {
           // console.log('Affichage spectacle', index, ':', spectacle);
            return (
              <TicketCard key={spectacle.id} spectacle={spectacle} />
            );
          })}
        </Grid>

        {pageCount > 1 && (
          <TicketPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </Box>
    </>
  );
}
