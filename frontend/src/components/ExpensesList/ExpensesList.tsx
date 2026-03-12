import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { CATEGORY_LABELS } from "../../types/expense";
import type { Expense } from "../../types/expense";

interface ExpensesListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "green",
  TRANSPORT: "blue",
  ENTERTAINMENT: "purple",
  BILLS: "red",
  HEALTH: "teal",
  SHOPPING: "orange",
  OTHER: "gray",
};

const ExpensesList = ({
  expenses,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: ExpensesListProps) => {
  if (isLoading) {
    return (
      <Center py={16}>
        <Stack align="center" gap={3}>
          <Spinner size="xl" colorPalette="blue" />
          <Text color="fg.muted">Ładowanie wydatków...</Text>
        </Stack>
      </Center>
    );
  }

  if (expenses.length === 0) {
    return (
      <Center py={16}>
        <Stack align="center" gap={2}>
          <Text fontSize="4xl">📭</Text>
          <Text fontWeight="semibold" fontSize="lg">
            Brak wydatków
          </Text>
          <Text color="fg.muted" fontSize="sm">
            Dodaj pierwszy wydatek lub zmień filtry.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <Box display={{ base: "none", md: "block" }} overflowX="auto">
        <Table.Root variant="outline" size="md">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Tytuł</Table.ColumnHeader>
              <Table.ColumnHeader>Kategoria</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Kwota</Table.ColumnHeader>
              <Table.ColumnHeader>Data</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Akcje</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {expenses.map((expense) => (
              <Table.Row key={expense.id}>
                <Table.Cell fontWeight="medium">{expense.title}</Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={CATEGORY_COLORS[expense.category] ?? "gray"}
                  >
                    {CATEGORY_LABELS[expense.category]}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="right" fontWeight="semibold">
                  {expense.amount.toFixed(2)} zł
                </Table.Cell>
                <Table.Cell color="fg.muted">
                  {new Date(expense.date).toLocaleDateString("pl-PL")}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Flex gap={2} justify="center">
                    <IconButton
                      aria-label="Edytuj"
                      size="sm"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => onEdit(expense)}
                    >
                      <LuPencil />
                    </IconButton>
                    <IconButton
                      aria-label="Usuń"
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => onDelete(expense.id)}
                      disabled={isDeleting}
                    >
                      <LuTrash2 />
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Mobile cards */}
      <Stack gap={3} display={{ base: "flex", md: "none" }}>
        {expenses.map((expense) => (
          <Box
            key={expense.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg="bg.subtle"
          >
            <Flex justify="space-between" align="flex-start" mb={2}>
              <Text fontWeight="semibold" fontSize="md">
                {expense.title}
              </Text>
              <Text fontWeight="bold" fontSize="lg" color="blue.solid">
                {expense.amount.toFixed(2)} zł
              </Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Stack direction="row" gap={2} align="center">
                <Badge
                  colorPalette={CATEGORY_COLORS[expense.category] ?? "gray"}
                  size="sm"
                >
                  {CATEGORY_LABELS[expense.category]}
                </Badge>
                <Text fontSize="xs" color="fg.muted">
                  {new Date(expense.date).toLocaleDateString("pl-PL")}
                </Text>
              </Stack>
              <Flex gap={1}>
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="blue"
                  onClick={() => onEdit(expense)}
                >
                  <LuPencil />
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => onDelete(expense.id)}
                  disabled={isDeleting}
                >
                  <LuTrash2 />
                </Button>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default ExpensesList;
