import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });

    if (errors[input.name]) {
        setErrors({
            ...errors,
            [input.name]: null
        });
    }
};

const validedata = () => {
    const newError = {};

    if (!data.email || !data.email.trim()) {
        newError.email = "Email is required";
    }

    if (!data.password || !data.password.trim()) {
        newError.password = "Password is required";
    }

    setErrors(newError);
    return Object.keys(newError).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validedata()) {
      try {
        const { data: res } = await axios.post("http://localhost:8999/api/auth", data);
        localStorage.setItem("token", res.data);
        window.location = "/";
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
			<input
				type="email"
				placeholder="Email"
				name="email"
				onChange={handleChange}
				value={data.email}
				className={styles.input}
			/>
			{errors.email && <p className={styles.error_msg}>{errors.email}</p>}
            <input
				type="password"
				placeholder="Password"
				name="password"
				onChange={handleChange}
				value={data.password}
				className={styles.input}
			/>
			{errors.password && <p className={styles.error_msg}>{errors.password}</p>}
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <div className={styles.social_icons}>
            <a href="#" className={styles.icon_link}>
              <FontAwesomeIcon icon={faGoogle} size="2x" />
            </a>
            <a href="#" className={styles.icon_link}>
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="#" className={styles.icon_link}>
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;