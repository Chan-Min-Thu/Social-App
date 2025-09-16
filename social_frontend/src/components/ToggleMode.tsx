import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

export default function ToggleMode() {
  const [theme, setTheme] = useState(Cookies.get("data-theme"));

  useEffect(() => {
    Cookies.set("data-theme", theme!);
    const getTheme = Cookies.get("data-theme");
    setTheme(getTheme ? getTheme : theme);
    document.documentElement.setAttribute("data-theme", theme!);
  }, [theme]);

  const ToggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        className="theme-controller"
        value="synthwave"
        onChange={() => ToggleMode()}
      />
      {theme === "dark" ? (
        <SunIcon className=" w-5 h-5 text-primary" />
      ) : (
        <MoonIcon className="w-5 h-5 text-primary" />
      )}
    </label>
  );
}
