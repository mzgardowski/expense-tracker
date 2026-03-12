import {
  Button,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useEffect } from "react";
import updateExpense from "../../../api/expenses/updateExpense";
import { ExpenseCategory, CATEGORY_LABELS } from "../../../types/expense";
import type { Expense, UpdateExpensePayload } from "../../../types/expense";

interface EditExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

const CATEGORY_OPTIONS = Object.values(ExpenseCategory);

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Tytuł jest wymagany")
    .max(255, "Maksymalnie 255 znaków"),
  amount: Yup.number()
    .typeError("Podaj liczbę")
    .positive("Kwota musi być większa od 0")
    .required("Kwota jest wymagana"),
  category: Yup.string()
    .oneOf(CATEGORY_OPTIONS, "Wybierz kategorię")
    .required("Kategoria jest wymagana"),
  date: Yup.string().optional(),
});

const EditExpense = ({ isOpen, onClose, expense }: EditExpenseProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: UpdateExpensePayload) =>
      updateExpense(expense!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Wydatek został zaktualizowany!");
      onClose();
    },
    onError: () => {
      toast.error("Nie udało się zaktualizować wydatku.");
    },
  });

  const formik = useFormik<UpdateExpensePayload>({
    initialValues: {
      title: expense?.title ?? "",
      amount: expense?.amount ?? 0,
      category: expense?.category ?? ExpenseCategory.OTHER,
      date: expense?.date ?? new Date().toISOString().split("T")[0],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      mutation.reset();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg" mx={4}>
            <Dialog.Header>
              <Dialog.Title>Edytuj wydatek</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form id="edit-expense-form" onSubmit={formik.handleSubmit}>
                <Stack gap={4}>
                  <Field.Root
                    invalid={!!(formik.touched.title && formik.errors.title)}
                  >
                    <Field.Label>Tytuł</Field.Label>
                    <Input
                      placeholder="np. Zakupy w Biedronce"
                      {...formik.getFieldProps("title")}
                    />
                    <Field.ErrorText>{formik.errors.title}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root
                    invalid={!!(formik.touched.amount && formik.errors.amount)}
                  >
                    <Field.Label>Kwota (zł)</Field.Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      {...formik.getFieldProps("amount")}
                    />
                    <Field.ErrorText>{formik.errors.amount}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root
                    invalid={
                      !!(formik.touched.category && formik.errors.category)
                    }
                  >
                    <Field.Label>Kategoria</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field {...formik.getFieldProps("category")}>
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{formik.errors.category}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Data</Field.Label>
                    <DatePicker
                      selected={
                        formik.values.date ? new Date(formik.values.date) : null
                      }
                      onChange={(date: Date | null) =>
                        formik.setFieldValue(
                          "date",
                          date ? date.toISOString().split("T")[0] : "",
                        )
                      }
                      dateFormat="dd.MM.yyyy"
                      placeholderText="dd.mm.rrrr"
                      customInput={<Input />}
                    />
                  </Field.Root>

                  {mutation.isError && (
                    <Text color="red.500" fontSize="sm">
                      Wystąpił błąd. Spróbuj ponownie.
                    </Text>
                  )}
                </Stack>
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                form="edit-expense-form"
                colorPalette="blue"
                loading={mutation.isPending}
                loadingText="Zapisywanie..."
              >
                Zapisz
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditExpense;
