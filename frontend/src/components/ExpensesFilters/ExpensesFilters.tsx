import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ExpenseCategory, CATEGORY_LABELS } from "../../types/expense";
import type { ExpenseFilters } from "../../types/expense";

interface ExpensesFiltersProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  onReset: () => void;
}

const CATEGORY_OPTIONS = Object.values(ExpenseCategory);

const ExpensesFilters = ({
  filters,
  onChange,
  onReset,
}: ExpensesFiltersProps) => {
  const handleDateFrom = (date: Date | null) => {
    onChange({
      ...filters,
      dateFrom: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  const handleDateTo = (date: Date | null) => {
    onChange({
      ...filters,
      dateTo: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  const handleMinAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      minAmount: val ? parseFloat(val) : undefined,
      page: 1,
    });
  };

  const handleMaxAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      maxAmount: val ? parseFloat(val) : undefined,
      page: 1,
    });
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ExpenseCategory;
    onChange({ ...filters, category: val || undefined, page: 1 });
  };

  return (
    <Box
      bg="bg.subtle"
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 4, md: 6 }}
    >
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(5, 1fr)" }}
        gap={4}
        alignItems="end"
      >
        <GridItem>
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Data od
            </Text>
            <Box
              css={{
                "& .react-datepicker-wrapper": { width: "100%" },
                "& .react-datepicker__input-container input": {
                  width: "100%",
                  padding: "0 12px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "inherit",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "14px",
                  outline: "none",
                },
              }}
            >
              <DatePicker
                selected={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={handleDateFrom}
                dateFormat="dd.MM.yyyy"
                placeholderText="dd.mm.rrrr"
                isClearable
                maxDate={filters.dateTo ? new Date(filters.dateTo) : undefined}
              />
            </Box>
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Data do
            </Text>
            <Box
              css={{
                "& .react-datepicker-wrapper": { width: "100%" },
                "& .react-datepicker__input-container input": {
                  width: "100%",
                  padding: "0 12px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: "inherit",
                  background: "transparent",
                  color: "inherit",
                  fontSize: "14px",
                  outline: "none",
                },
              }}
            >
              <DatePicker
                selected={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={handleDateTo}
                dateFormat="dd.MM.yyyy"
                placeholderText="dd.mm.rrrr"
                isClearable
                minDate={
                  filters.dateFrom ? new Date(filters.dateFrom) : undefined
                }
              />
            </Box>
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Min. kwota (zł)
            </Text>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={filters.minAmount ?? ""}
              onChange={handleMinAmount}
            />
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Maks. kwota (zł)
            </Text>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={filters.maxAmount ?? ""}
              onChange={handleMaxAmount}
            />
          </Stack>
        </GridItem>

        <GridItem>
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Kategoria
            </Text>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={filters.category ?? ""}
                onChange={handleCategory}
              >
                <option value="">Wszystkie</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Stack>
        </GridItem>
      </Grid>

      <Stack
        direction="row"
        gap={3}
        mt={4}
        justify={{ base: "stretch", sm: "flex-end" }}
      >
        <Button
          variant="outline"
          onClick={onReset}
          flex={{ base: 1, sm: "none" }}
        >
          Wyczyść
        </Button>
        <Button
          colorPalette="blue"
          onClick={() => onChange({ ...filters, page: 1 })}
          flex={{ base: 1, sm: "none" }}
        >
          Filtruj
        </Button>
      </Stack>
    </Box>
  );
};

export default ExpensesFilters;
