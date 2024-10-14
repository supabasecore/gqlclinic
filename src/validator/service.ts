import { ServiceInput } from "../res/service";

export const validateService = (options: ServiceInput) => {
  if (
    !options.title ||
    options.title.trim().length < 4 ||
    options.title.length > 255
  ) {
    return [
      {
        field: "title",
        message: "El título debe tener entre 4 y 255 caracteres",
      },
    ];
  }

  if (
    !options.description ||
    options.description.trim().length < 4 ||
    options.description.length > 255
  ) {
    return [
      {
        field: "description",
        message: "La descripción debe tener entre 4 y 255 caracteres",
      },
    ];
  }

  return null;
};
