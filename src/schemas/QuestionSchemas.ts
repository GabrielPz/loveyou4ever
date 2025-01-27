import { Questions } from "@prisma/client";
import { z } from "zod";

export const questionSchema = z.object({
  choices: z.array(z.string()),
  correctAwser: z.string().min(1, { message: "A resposta é obrigatória." }),
  categoryId: z.string().min(1, { message: "A categoria é obrigatória." }),
  question: z.string().min(1, { message: "A pergunta é obrigatória." }),
  type: z.enum(["TRUE_FALSE", "MULTIPLE_CHOICE"]).optional(),
});

export type QuestionDTO = z.infer<typeof questionSchema>;
