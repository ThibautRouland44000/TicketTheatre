import { useMemo, useState, useEffect } from "react";
import { Box, Flex, Grid, Text, Button, IconButton, Portal, Spinner, Center } from "@chakra-ui/react";
import { SeancesNav } from "../components/SeancesNav";
import { TicketLabel } from "../components/TicketLabel";
import { TicketCard } from "../components/TicketCard";
import { Filter } from "../components/Filter";
import { LuX } from "react-icons/lu";
import { coreService, type Seance } from "../services/core.service";

type SeancesTab = "affiche" | "toutes";

type FilterValues = {
  genre: string;
  metteurEnScene: string;
  date: string;
};

function formatShortDay(d: Date) {
  return d
    .toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" })
    .toUpperCase();
}

function dayLabelByIndex(d: Date, idx: number) {
  if (idx === 0) return "AUJOURD'HUI";
  if (idx === 1) return "DEMAIN";
  if (idx === 2) return "APRÈS-DEMAIN";
  return formatShortDay(d);
}

export default function Programme() {
  const [tab, setTab] = useState<SeancesTab>("affiche");
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    genre: "",
    metteurEnScene: "",
    date: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (tab === "affiche") {
      loadSeancesByDay(selectedDayIndex);
    } else {
      loadAllSeances();
    }
  }, [tab, selectedDayIndex]);

  const loadSeancesByDay = async (dayIndex: number) => {
    setLoading(true);
    try {
      const selectedDate = days[dayIndex];
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDateStr = nextDay.toISOString().split('T')[0];

      const data = await coreService.getSeances({
        date_from: dateStr,
        date_to: nextDateStr,
        status: 'scheduled',
        per_page: 100,
      });
      
      setSeances(data.data || []);
    } catch (error) {
      console.error('Erreur chargement séances:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllSeances = async () => {
    setLoading(true);
    try {
      const data = await coreService.getSeances({
        upcoming_only: true,
        status: 'scheduled',
        per_page: 100,
      });
      setSeances(data.data || []);
    } catch (error) {
      console.error('Erreur chargement séances:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extraire les spectacles uniques des séances
  const spectacles = useMemo(() => {
    const uniqueSpectacles = new Map();
    seances.forEach(seance => {
      if (seance.spectacle && !uniqueSpectacles.has(seance.spectacle.id)) {
        uniqueSpectacles.set(seance.spectacle.id, seance.spectacle);
      }
    });
    return Array.from(uniqueSpectacles.values());
  }, [seances]);

  return (
    <Box w="full" maxW="1200px" mx="auto" pt={4} pb={8}>
      <Flex justify="center" mb={6}>
        <SeancesNav value={tab} onChange={setTab} />
      </Flex>

      {tab === "affiche" && (
        <>
          <Flex
            gap={3}
            pb={2}
            mb={6}
            align="center"
            justify="center"
            flexWrap="wrap"
            w="full"
          >
            {days.map((d, idx) => {
              const label = dayLabelByIndex(d, idx);
              const isActive = idx === selectedDayIndex;

              return (
                <Box key={d.toISOString()} opacity={isActive ? 1 : 0.85}>
                  <TicketLabel
                    text={label}
                    variant={isActive ? "red" : "yellow"}
                    onClick={() => setSelectedDayIndex(idx)}
                  />
                </Box>
              );
            })}
          </Flex>

          <Text mb={4} fontWeight="semibold">
            Séances du{" "}
            {days[selectedDayIndex].toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
            {" "}({seances.length} séance{seances.length > 1 ? 's' : ''})
          </Text>

          {loading ? (
            <Center minH="300px">
              <Spinner size="xl" color="red.500" />
            </Center>
          ) : spectacles.length === 0 ? (
            <Center minH="300px">
              <Text color="gray.500">Aucune séance prévue ce jour</Text>
            </Center>
          ) : (
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              justifyItems="center"
            >
              {spectacles.map((spectacle) => (
                <TicketCard key={spectacle.id} spectacle={spectacle} />
              ))}
            </Grid>
          )}
        </>
      )}

      {tab === "toutes" && (
        <>
          <Flex justify="center" mb={6}>
            <Button
              bg="red.800"
              color="white"
              borderRadius="full"
              px="8"
              _hover={{ bg: "red.700" }}
              onClick={() => setIsFilterOpen(true)}
            >
              FILTRER PAR
            </Button>
          </Flex>

          <Text mb={4} fontWeight="semibold">
            Toutes les séances à venir
            {(filters.genre || filters.metteurEnScene || filters.date) && (
              <> — filtres appliqués</>
            )}
            {" "}({seances.length} séance{seances.length > 1 ? 's' : ''})
          </Text>

          {loading ? (
            <Center minH="300px">
              <Spinner size="xl" color="red.500" />
            </Center>
          ) : spectacles.length === 0 ? (
            <Center minH="300px">
              <Text color="gray.500">Aucune séance disponible</Text>
            </Center>
          ) : (
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              justifyItems="center"
            >
              {spectacles.map((spectacle) => (
                <TicketCard key={spectacle.id} spectacle={spectacle} />
              ))}
            </Grid>
          )}

          {isFilterOpen && (
            <Portal>
              <Box
                position="fixed"
                inset="0"
                bg="rgba(0,0,0,0.6)"
                zIndex="3000"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={4}
                onClick={() => setIsFilterOpen(false)}
              >
                <Box
                  position="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconButton
                    aria-label="Fermer"
                    position="absolute"
                    top="-12px"
                    right="-12px"
                    borderRadius="full"
                    bg="black"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <LuX />
                  </IconButton>

                  <Filter
                    onValidate={(values) => {
                      setFilters(values);
                      console.log("Filters:", values);
                      setIsFilterOpen(false);
                    }}
                  />
                </Box>
              </Box>
            </Portal>
          )}
        </>
      )}
    </Box>
  );
}
