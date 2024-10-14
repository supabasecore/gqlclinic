import { UsernamePasswordInput } from "../res/user";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Email incorrecto",
      },
    ];
  }

  if (options.username.length <= 3) {
    return [
      {
        field: "username",
        message: "Su usuario debe tener más caracteres",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 3) {
    return [
      {
        field: "password",
        message: "Su contraseña debe tener más caracteres",
      },
    ];
  }

  return null;
};
