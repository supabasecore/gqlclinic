import { ComprehensiveInput } from "../res/comprehensive";

export const validateComprehensive = (options: ComprehensiveInput) => {
  if (
    !options.name ||
    options.name.trim().length < 4 ||
    options.name.length > 255
  ) {
    return [
      {
        field: "name",
        message: "El nombre debe tener entre 4 y 255 caracteres",
      },
    ];
  }

  return null;
};
