import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const [erorrAuth, setErrorAuth] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      // const response = await authorize(data);
      //   localStorage.setItem("access_token", response.access);
      //   localStorage.setItem("refresh_token", response.refresh);
      //  // setLoggedIn(true); // Обновляем состояние loggedIn через Context
      navigate("/");
    } catch (err) {
      console.error(`Ошибка авторизации: ${err}`);
      setErrorAuth(`Ошибка авторизации`);
    }
  };

  return (
    <section className="auth">
      <div className="auth__wrap">
        <p className="auth__title">Авторизация</p>
        <form className="auth__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth__wrap-input">
            <input
              className="auth__input"
              type="text"
              name="username"
              id="username"
              placeholder="Введите логин"
              {...register("username", {
                required: "Введите логин",
                minLength: {
                  value: 3,
                  message: "Логин должен составлять минимум 3 символа",
                },
              })}
            />
            {errors?.username && (
              <p className="auth-error-input">
                {errors?.username?.message || "Не верный логин"}
              </p>
            )}
          </div>
          <div className="auth__wrap-input">
            <input
              className="auth__input"
              type="password"
              name="password"
              id="password"
              placeholder="Введите пароль"
              {...register("password", {
                required: "Введите пароль",
                minLength: {
                  value: 3,
                  message: "Пароль должен составлять минимум 3 символа",
                },
              })}
            />
            {errors?.password && (
              <p className="auth-error-input">{errors?.password?.message}</p>
            )}
          </div>
          <button type="submit" className="auth__btn">
            Вход
          </button>
          <p className="auth-error">{erorrAuth}</p>
        </form>
      </div>
    </section>
  );
}

export default Login;
