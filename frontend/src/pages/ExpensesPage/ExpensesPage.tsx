import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LuPlus, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import getAllExpenses from "../../api/expenses/getAllExpenses";
import deleteExpense from "../../api/expenses/deleteExpense";
import ExpensesFilters from "../../components/ExpensesFilters/ExpensesFilters";
import ExpensesList from "../../components/ExpensesList/ExpensesList";
import AddNewExpense from "../../components/forms/AddNewExpense/AddNewExpense";
import EditExpense from "../../components/forms/EditExpense/EditExpense";
import type { Expense, ExpenseFilters } from "../../types/expense";

const PAGE_LIMIT = 10;

const ExpensesPage = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    limit: PAGE_LIMIT,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => getAllExpenses(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Wydatek został usunięty.");
    },
    onError: () => {
      toast.error("Nie udało się usunąć wydatku.");
    },
  });

  const expenses = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  const handleFiltersChange = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({ page: 1, limit: PAGE_LIMIT });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wydatek?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxW="6xl" py={{ base: 6, md: 10 }}>
      <Stack gap={6}>
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Heading size="2xl">Wydatki</Heading>
          <Button colorPalette="blue" onClick={() => setIsAddOpen(true)}>
            <LuPlus />
            Dodaj wydatek
          </Button>
        </Flex>

        {/* Filters */}
        <ExpensesFilters
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleFiltersReset}
        />

        {/* Summary */}
        {data && (
          <Flex justify="space-between" align="center" px={1}>
            <Text fontSize="sm" color="fg.muted">
              Łącznie: <strong>{data.total}</strong>{" "}
              {data.total === 1
                ? "wydatek"
                : data.total < 5
                  ? "wydatki"
                  : "wydatków"}
            </Text>
            {data.total > 0 && (
              <Text fontSize="sm" color="fg.muted">
                Strona {currentPage} z {totalPages}
              </Text>
            )}
          </Flex>
        )}

        {/* List */}
        <Box>
          <ExpensesList
            expenses={expenses}
            isLoading={isLoading}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <HStack justify="center" gap={2} pt={2}>
            <IconButton
              aria-label="Poprzednia strona"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <LuChevronLeft />
            </IconButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "solid" : "outline"}
                colorPalette={page === currentPage ? "blue" : undefined}
                onClick={() => handlePageChange(page)}
                minW={9}
              >
                {page}
              </Button>
            ))}

            <IconButton
              aria-label="Następna strona"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <LuChevronRight />
            </IconButton>
          </HStack>
        )}
      </Stack>

      {/* Modals */}
      <AddNewExpense isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditExpense
        isOpen={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
      />
    </Container>
  );
};

export default ExpensesPage;
